import os
import requests
from fastapi import APIRouter, HTTPException
from ..database import db
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY")

@router.get("/optimize-route")
async def optimize_milk_run(start_lat: float, start_lng: float):
    if not TOMTOM_API_KEY:
        raise HTTPException(status_code=500, detail="TomTom API key not configured in .env")

    # 1. Fetch all available material listings from your Supabase database
    response = db.table("listings").select("id, title, estimated_weight_kg, lat, lng").eq("status", "available").execute()
    listings = response.data
    
    if not listings:
        return {"status": "success", "message": "No materials available for pickup right now."}

    # 2. Format coordinates for TomTom (Format: lat,lng:lat,lng:...)
    coords = [f"{start_lat},{start_lng}"]
    for item in listings:
        coords.append(f"{item['lat']},{item['lng']}")
    
    # Add the truck's starting location at the very end to complete the round trip
    coords.append(f"{start_lat},{start_lng}")
    
    locations_string = ":".join(coords)
    
    # 3. Call TomTom Routing API
    url = f"https://api.tomtom.com/routing/1/calculateRoute/{locations_string}/json"
    params = {
        "key": TOMTOM_API_KEY,
        "computeBestOrder": "true", 
        "routeType": "fastest",
        "traffic": "true",
        "travelMode": "truck"
    }
    
    try:
        tomtom_response = requests.get(url, params=params)
        data = tomtom_response.json()
        
        if 'error' in data:
            raise HTTPException(status_code=400, detail=data['error']['description'])

        # 4. Extract total distance and calculate carbon offset (Hackathon magic!)
        total_distance_m = data['routes'][0]['summary']['lengthInMeters']
        total_distance_km = total_distance_m / 1000
        
        # Upgraded to use the ACTUAL database weights for the carbon math!
        total_weight_kg = sum(item.get('estimated_weight_kg', 0) for item in listings)
        carbon_saved_kg = total_weight_kg - (total_distance_km * 1.2)
        
        return {
            "status": "success",
            "message": "Milk run optimized successfully!",
            "total_stops": len(listings),
            "total_distance_km": round(total_distance_km, 2),
            "embodied_carbon_saved_kg": round(carbon_saved_kg, 2),
            "optimized_route_data": data['routes'][0] 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routing failed: {str(e)}")