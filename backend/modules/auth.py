from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from .database import db

router = APIRouter()

# Setup the password encryption engine
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- SCHEMAS ---
class UserRegister(BaseModel):
    username: str
    password: str
    role: str = "supplier" # Can be 'supplier' or 'buyer'

class UserLogin(BaseModel):
    username: str
    password: str

# --- ROUTES ---
@router.post("/register")
async def register_user(user: UserRegister):
    try:
        # 1. Check if the username already exists
        existing = db.table("users").select("*").eq("username", user.username).execute()
        if len(existing.data) > 0:
            raise HTTPException(status_code=400, detail="Username already taken")

        # 2. Encrypt the password!
        hashed_password = pwd_context.hash(user.password)

        # 3. Save to Supabase
        new_user = {
            "username": user.username,
            "password_hash": hashed_password,
            "role": user.role
        }
        
        response = db.table("users").insert(new_user).execute()
        return {"status": "success", "message": "User created successfully!"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")


@router.post("/login")
async def login_user(user: UserLogin):
    try:
        # 1. Find the user in the database
        existing = db.table("users").select("*").eq("username", user.username).execute()
        if len(existing.data) == 0:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        user_record = existing.data[0]
        
        # 2. Check if the typed password matches the scrambled hash in the database
        is_valid = pwd_context.verify(user.password, user_record["password_hash"])
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid username or password")
            
        # 3. Success! Return the user's details (helpful for the frontend to know their role)
        return {
            "status": "success",
            "message": "Login successful!",
            "user_data": {
                "username": user_record["username"],
                "role": user_record["role"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")