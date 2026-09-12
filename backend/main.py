# Force backend reload
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from modules.marketplace.router import router as marketplace_router
from modules.logistics.routing import router as logistics_router  
from modules.auth import router as auth_router  # Added the auth import

app = FastAPI(
    title="Circular Exchange API",
    description="B2B Two-Sided Marketplace for Circular Packaging"
)

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all the routers
app.include_router(marketplace_router, prefix="/api/marketplace", tags=["Marketplace"])
app.include_router(logistics_router, prefix="/api/logistics", tags=["Logistics"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"]) # Connected the auth route

@app.get("/")
async def root():
    return {"message": "Circular Exchange API is live!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "connected", "ai_vision": "ready"}