from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.auth import get_current_user

# 1. Router FastAPI com prefix "/api/admin"
router = APIRouter(prefix="/api/admin", tags=["admin"])

# 5. Schema Pydantic para aprovação de usuário
class ApproveUserRequest(BaseModel):
    new_role: str

# 2. Função verify_master() que valida se o usuário é master
def verify_master(current_user: dict):
    """Valida se o usuário tem role 'admin_master'"""
    if not current_user or current_user.get("role") != "admin_master":
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas usuários master podem realizar esta ação.")

# 3. Endpoints: GET /all-users - listar todos os usuários
@router.get("/all-users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Lista todos os usuários do sistema. Apenas usuários master podem acessar.
    """
    verify_master(current_user)

    # Força recarregar do banco de dados
    db.expunge_all()

    users = db.query(User).all()
    return users

# 3. Endpoints: GET /pending-users - listar usuários pendentes de aprovação
@router.get("/pending-users", response_model=List[UserResponse])
def get_pending_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Lista usuários pendentes de aprovação. Apenas usuários master podem acessar.
    """
    verify_master(current_user)

    # Força recarregar do banco de dados
    db.expunge_all()

    pending_users = db.query(User).filter(User.is_approved == False).all()
    return pending_users

# 3. Endpoints: POST /approve-user/{user_id} - aprovar usuário com new_role no body (JSON)
@router.post("/approve-user/{user_id}")
def approve_user(user_id: int, request: ApproveUserRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Aprova um usuário e atribui uma nova role. Apenas usuários master podem realizar esta ação.
    A nova role deve ser fornecida no corpo da requisição (JSON).
    """
    verify_master(current_user)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    user.is_approved = True
    user.role = request.new_role
    db.commit()

    # Força refresh do objeto
    db.refresh(user)
    db.expunge_all()

    return {"message": f"Usuário {user.email} aprovado com sucesso e role '{user.role}' atribuído."}

# 3. Endpoints: POST /reject-user/{user_id} - rejeitar usuário
@router.post("/reject-user/{user_id}")
def reject_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Rejeita um usuário (deleta da base de dados). Apenas usuários master podem realizar esta ação.
    """
    verify_master(current_user)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    db.delete(user)
    db.commit()
    db.expunge_all()

    return {"message": f"Usuário {user.email} rejeitado e deletado com sucesso."}

# 3. Endpoints: DELETE /delete-user/{user_id} - deletar usuário
@router.delete("/delete-user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Deleta um usuário do sistema. Apenas usuários master podem realizar esta ação.
    """
    verify_master(current_user)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    db.delete(user)
    db.commit()
    db.expunge_all()

    return {"message": f"Usuário {user.email} deletado com sucesso."}