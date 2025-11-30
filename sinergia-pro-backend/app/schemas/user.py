from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: str
    name: str
    role: str = "patient"

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_approved: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None
    is_approved: Optional[bool] = None
