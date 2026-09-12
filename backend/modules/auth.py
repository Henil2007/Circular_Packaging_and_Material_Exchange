from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from .database import db

router = APIRouter()

# Setup the password encryption engine
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- SCHEMAS ---
class UserRegister(BaseModel):
    company_name: str
    email: str
    phone: str
    password: str
    role: str = "supplier"

class UserLogin(BaseModel):
    email: str
    password: str

# --- ROUTES ---
@router.post("/register")
async def register_user(user: UserRegister):
    try:
        # 1. Check if the email already exists
        existing_email = db.table("users").select("*").eq("username", user.email).execute()
        if len(existing_email.data) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")

        # 3. Encrypt the password!
        hashed_password = pwd_context.hash(user.password)

        # 4. Save to Supabase using 'username' column for email
        new_user = {
            "username": user.email,
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
        existing = db.table("users").select("*").eq("username", user.email).execute()
        if len(existing.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_record = existing.data[0]
        
        # 2. Check if the typed password matches the scrambled hash in the database
        is_valid = pwd_context.verify(user.password, user_record["password_hash"])
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid password")
            
        # 3. Success! Return the user's details
        return {
            "status": "success",
            "message": "Login successful!",
            "user_data": {
                "id": user_record.get("id"),
                "email": user_record.get("username"),
                "role": user_record.get("role")
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")