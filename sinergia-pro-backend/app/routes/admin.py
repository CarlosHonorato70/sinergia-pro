# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.connection import get_db
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

class UpdateUserRequest(BaseModel):
    name: str
    email: str
    role: str

@router.get("/pending-users")
def get_pending_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retorna usuarios pendentes de aprovacao"""

    if current_user.get("role") not in ["admin_master", "admin"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")

    pending = db.query(User).filter(User.is_approved == False).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in pending]

@router.get("/all-users")
def get_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retorna todos os usuarios"""

    if current_user.get("role") not in ["admin_master", "admin"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")

    users = db.query(User).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "is_approved": u.is_approved} for u in users]

@router.post("/approve-user/{user_id}")
def approve_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Aprova um usuario"""

    if current_user.get("role") not in ["admin_master", "admin"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado!")

    user.is_approved = True
    db.commit()

    return {"message": "Usuario aprovado com sucesso!"}

@router.post("/reject-user/{user_id}")
def reject_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Rejeita um usuario"""

    if current_user.get("role") not in ["admin_master", "admin"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado!")

    db.delete(user)
    db.commit()

    return {"message": "Usuario rejeitado com sucesso!"}

@router.put("/update-user/{user_id}")
def update_user(user_id: int, data: UpdateUserRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Edita um usuario (nome, email, role)"""

    if current_user.get("role") != "admin_master":
        raise HTTPException(status_code=403, detail="Apenas Admin Master pode editar usuarios!")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado!")

    user.name = data.name
    user.email = data.email
    user.role = data.role
    db.commit()

    return {"message": "Usuario atualizado com sucesso!", "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}

@router.delete("/delete-user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Deleta um usuario"""

    if current_user.get("role") != "admin_master":
        raise HTTPException(status_code=403, detail="Apenas Admin Master pode deletar usuarios!")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario nao encontrado!")

    if user.role == "admin_master":
        raise HTTPException(status_code=403, detail="Nao e possivel deletar o Admin Master!")

    db.delete(user)
    db.commit()

    return {"message": "Usuario deletado com sucesso!"}