from pydantic import BaseModel, Field
from datetime import datetime

class MaterialListingBase(BaseModel):
    title: str = Field(..., example="500kg of Baled Cardboard")
    material_category: str = Field(..., example="Cardboard")
    condition: str = Field(..., example="Baled")
    estimated_weight_kg: int = Field(..., gt=0)
    price: float = Field(..., gt=0, example=2500.00)
    lat: float
    lng: float

class MaterialListingCreate(MaterialListingBase):
    # The frontend will pass this ID after the user logs in
    supplier_id: str 

class MaterialListingResponse(MaterialListingBase):
    id: str
    supplier_id: str
    status: str = "available"
    created_at: datetime
    
    class Config:
        from_attributes = True

class ESGReportResponse(BaseModel):
    user_id: str
    total_materials_recycled_kg: int
    total_carbon_saved_kg: float
    equivalent_trees_planted: int
    active_listings: int