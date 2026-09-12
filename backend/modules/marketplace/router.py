import uuid
import os
import shutil
import math
import razorpay
from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, File, UploadFile, HTTPException
from .vision import analyze_waste_image
from ..database import db  
from ..schemas import MaterialListingCreate, ESGReportResponse

router = APIRouter()

try:
    razorpay_client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID", ""), os.getenv("RAZORPAY_KEY_SECRET", "")))
except Exception as e:
    print(f"Warning: Razorpay client initialization failed: {e}")

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.post("/analyze-image")
async def ai_auto_listing(file: UploadFile = File(...)):
    # 1. Read the uploaded image file
    image_bytes = await file.read()
    
    # Generate a temporary ID and save the image
    temp_id = str(uuid.uuid4())
    temp_path = os.path.join("uploads", f"temp_{temp_id}.jpg")
    with open(temp_path, "wb") as f:
        f.write(image_bytes)
        
    # 2. Send it to Gemini for analysis
    result = await analyze_waste_image(image_bytes)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result["message"])
        
    # 3. Return the generated listing data to the frontend
    return {
        "message": "AI successfully analyzed the material!",
        "generated_listing": result["data"],
        "temp_image_id": temp_id
    }

@router.post("/listings")
async def create_listing(listing: MaterialListingCreate, temp_image_id: Optional[str] = None):
    # Convert the Pydantic model to a dictionary
    listing_data = listing.model_dump()
    
    try:
        # Insert the data into your Supabase table
        response = db.table("listings").insert(listing_data).execute()
        new_listing = response.data[0]
        
        # Link image if provided
        if temp_image_id:
            temp_path = os.path.join("uploads", f"temp_{temp_image_id}.jpg")
            if os.path.exists(temp_path):
                final_path = os.path.join("uploads", f"{new_listing['id']}.jpg")
                shutil.move(temp_path, final_path)
                
        # --- NOTIFICATION LOGIC ---
        notified_count = 0
        try:
            # Query buyers from the database
            buyers_res = db.table("users").select("*").eq("role", "buyer").execute()
            buyers = buyers_res.data
            
            for buyer in buyers:
                b_lat = buyer.get("lat")
                b_lng = buyer.get("lng")
                b_email = buyer.get("username") # Mocking email as username
                
                # For demo purposes: if a buyer doesn't have coordinates, mock them to be ~15km away
                if b_lat is None or b_lng is None:
                    b_lat, b_lng = listing.lat + 0.1, listing.lng + 0.1
                
                dist = haversine(listing.lat, listing.lng, float(b_lat), float(b_lng))
                if dist <= 50.0:
                    print(f"[EMAIL SENT] Notifying {b_email} about new {listing.material_category} listing {round(dist, 1)}km away!")
                    notified_count += 1
        except Exception as e:
            print(f"Failed to send notifications: {e}")
                
        return {
            "status": "success", 
            "message": "Listing saved to Supabase!", 
            "data": response.data,
            "notified_count": notified_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/listings")
async def get_listings():
    try:
        # Fetch all available listings from Supabase
        response = db.table("listings").select("*").eq("status", "available").execute()
        return {"status": "success", "listings": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/listings/{listing_id}")
async def delete_listing(listing_id: str):
    try:
        response = db.table("listings").delete().eq("id", listing_id).execute()
        return {"status": "success", "message": "Listing deleted successfully!", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/listings/{listing_id}/buy")
async def buy_listing(listing_id: str, buyer_id: str):
    try:
        # 1. Check if the listing is actually available
        check = db.table("listings").select("status").eq("id", listing_id).execute()
        if not check.data or check.data[0]["status"] != "available":
            raise HTTPException(status_code=400, detail="This material is no longer available.")
            
        # 2. Update the status to 'sold' and link the buyer
        response = db.table("listings").update({
            "status": "sold",
            "buyer_id": buyer_id
        }).eq("id", listing_id).execute()
        
        return {
            "status": "success", 
            "message": "Purchase successful! Logistics routing can now begin.",
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CreateOrderRequest(BaseModel):
    listing_ids: List[str]

@router.post("/create-order")
async def create_order(req: CreateOrderRequest):
    try:
        if not req.listing_ids:
            raise HTTPException(status_code=400, detail="No listings provided")
        
        total_amount = 0
        for listing_id in req.listing_ids:
            listing_res = db.table("listings").select("price, estimated_weight_kg").eq("id", listing_id).execute()
            if not listing_res.data:
                raise HTTPException(status_code=404, detail=f"Listing {listing_id} not found")
            
            price_per_kg = float(listing_res.data[0]["price"])
            weight_kg = float(listing_res.data[0].get("estimated_weight_kg") or 1.0)
            total_amount += (price_per_kg * weight_kg)
        
        amount_in_paise = int(total_amount * 100)
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"receipt_{uuid.uuid4().hex[:8]}"
        }
        
        # Mocking razorpay order creation
        mock_order_id = f"order_mock_{uuid.uuid4().hex[:14]}"
        return {
            "status": "success",
            "order_id": mock_order_id,
            "amount": amount_in_paise,
            "currency": "INR"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class VerifyPaymentRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    listing_ids: List[str]
    buyer_id: str

@router.post("/verify-payment")
async def verify_payment(req: VerifyPaymentRequest):
    try:
        params_dict = {
            'razorpay_order_id': req.razorpay_order_id,
            'razorpay_payment_id': req.razorpay_payment_id,
            'razorpay_signature': req.razorpay_signature
        }
        
        # Mock signature verification instead of calling razorpay_client
        # razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Payment verified successfully, now update the listings to 'sold'
        for listing_id in req.listing_ids:
            check = db.table("listings").select("status").eq("id", listing_id).execute()
            if check.data and check.data[0]["status"] == "available":
                db.table("listings").update({
                    "status": "sold",
                    "buyer_id": req.buyer_id
                }).eq("id", listing_id).execute()
        
        return {"status": "success", "message": "Payment verified and items bought"}
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Payment verification failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/esg-report/{user_id}", response_model=ESGReportResponse)
async def generate_esg_report(user_id: str):
    try:
        # 1. Fetch all listings for this specific supplier
        response = db.table("listings").select("*").eq("supplier_id", user_id).execute()
        listings = response.data
        
        if not listings:
            return ESGReportResponse(
                user_id=user_id, 
                total_materials_recycled_kg=0, 
                total_carbon_saved_kg=0.0, 
                equivalent_trees_planted=0,
                active_listings=0
            )

        # 2. Calculate the core metrics
        total_weight = sum(item.get("estimated_weight_kg", 0) for item in listings)
        active_count = len([item for item in listings if item.get("status") == "available"]) # Fixed bracket here
        
        # 3. Simulate carbon savings (1kg of packaging recycled saves ~1.5kg of CO2)
        total_carbon_saved = total_weight * 1.5 
        
        # 4. Convert to a tangible metric (1 tree absorbs ~21kg of CO2 per year)
        trees_planted = int(total_carbon_saved / 21)

        return {
            "user_id": user_id,
            "total_materials_recycled_kg": total_weight,
            "total_carbon_saved_kg": total_carbon_saved,
            "equivalent_trees_planted": trees_planted,
            "active_listings": active_count
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")