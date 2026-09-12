from fastapi import APIRouter
from .routing import calculate_milk_run_route

router = APIRouter()

@router.post("/calculate-route")
async def get_route(driver_location: dict, pickup_locations: list):
    route_data = calculate_milk_run_route(driver_location, pickup_locations)
    return {"status": "success", "data": route_data}
