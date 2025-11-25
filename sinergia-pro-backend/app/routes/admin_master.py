from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.connection import get_db
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(tags=["admin"])

class ApproveUserRequest(BaseModel):
    new_role: str

class UpdateRoleRequest(BaseModel):
    new_role: str

def require_master(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """Verifica se o usuário atual é master"""
    user = db.query(User).filter(User.email == current_user).first()
    if not user or user.role != "master":
        raise HTTPException(
            status_code=403,
            detail="Acesso permitido somente ao Administrador Master."
        )
    return user

@router.get("/pending-users")
def get_pending_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_master)
):
    """Lista todos os usuários pendentes de aprovação"""
    pending = db.query(User).filter(User.is_approved == False).all()
    return pending

@router.post("/approve-user/{user_id}")
def approve_user(
    user_id: int,
    request: ApproveUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_master)
):
    """Aprova um usuário pendente"""
    valid_roles = ["admin", "therapist", "patient"]
    if request.new_role not in valid_roles:
        raise HTTPException(status_code=400, detail="Role inválida.")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    user.role = request.new_role
    user.is_approved = True
    db.commit()
    db.refresh(user)
    return {"message": "Usuário aprovado com sucesso.", "user": user}

@router.post("/reject-user/{user_id}")
def reject_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_master)
):
    """Rejeita um usuário pendente"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    user.role = "rejected"
    user.is_approved = False
    db.commit()
    return {"message": "Usuário rejeitado."}

@router.post("/update-role/{user_id}")
def update_role(
    user_id: int,
    request: UpdateRoleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_master)
):
    """Atualiza a role de um usuário"""
    valid_roles = ["admin", "therapist", "patient", "pending"]
    if request.new_role not in valid_roles:
        raise HTTPException(status_code=400, detail="Role inválida.")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    user.role = request.new_role
    db.commit()
    db.refresh(user)
    return {"message": "Role atualizada com sucesso.", "user": user}