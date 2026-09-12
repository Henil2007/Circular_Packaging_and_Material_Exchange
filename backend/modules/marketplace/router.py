from fastapi import APIRouter, File, UploadFile, HTTPException
from .vision import analyze_waste_image
from ..database import db  
from ..schemas import MaterialListingCreate, ESGReportResponse

router = APIRouter()

@router.post("/analyze-image")
async def ai_auto_listing(file: UploadFile = File(...)):
    # 1. Read the uploaded image file
    image_bytes = await file.read()
    
    # 2. Send it to Gemini for analysis
    result = await analyze_waste_image(image_bytes)
    
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result["message"])
        
    # 3. Return the generated listing data to the frontend
    return {
        "message": "AI successfully analyzed the material!",
        "generated_listing": result["data"]
    }

@router.post("/listings")
async def create_listing(listing: MaterialListingCreate):
    # Convert the Pydantic model to a dictionary
    listing_data = listing.model_dump()
    
    try:
        # Insert the data into your Supabase table
        response = db.table("listings").insert(listing_data).execute()
        return {"status": "success", "message": "Listing saved to Supabase!", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/listings")
async def get_listings():
    try:
        # Fetch all listings from Supabase
        response = db.table("listings").select("*").execute()
        return {"status": "success", "listings": response.data}
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