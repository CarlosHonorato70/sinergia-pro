from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.auth import get_current_user

router = APIRouter(tags=["admin"])

class ApproveUserRequest(BaseModel):
    new_role: str

def verify_master(current_user: dict):
    if not current_user or current_user.get("role") != "admin_master":
        raise HTTPException(status_code=403, detail="Acesso negado.")

@router.get("/all-users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_master(current_user)
    users = db.query(User).all()
    return users

@router.get("/pending-users", response_model=List[UserResponse])
def get_pending_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_master(current_user)
    pending_users = db.query(User).filter(User.is_approved == False).all()
    return pending_users

@router.post("/approve-user/{user_id}")
def approve_user(user_id: int, request: ApproveUserRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_master(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado.")
    user.is_approved = True
    user.role = request.new_role
    db.commit()
    db.refresh(user)
    return {"message": f"Usuario {user.email} aprovado."}

@router.post("/reject-user/{user_id}")
def reject_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_master(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado.")
    db.delete(user)
    db.commit()
    return {"message": f"Usuario {user.email} rejeitado."}

@router.delete("/delete-user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    verify_master(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado.")
    db.delete(user)
    db.commit()
    return {"message": f"Usuario {user.email} deletado."}
