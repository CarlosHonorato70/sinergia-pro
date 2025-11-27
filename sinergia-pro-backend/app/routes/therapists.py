from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/therapists", tags=["therapists"])

@router.get("", response_model=List[UserResponse])
def get_therapists(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Lista todos os terapeutas do sistema. Apenas usuários autenticados podem acessar.
    """
    therapists = db.query(User).filter(User.role == "therapist").all()
    return therapists

@router.get("/{therapist_id}", response_model=UserResponse)
def get_therapist(therapist_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Retorna os detalhes de um terapeuta específico.
    """
    therapist = db.query(User).filter(User.id == therapist_id, User.role == "therapist").first()
    if not therapist:
        raise HTTPException(status_code=404, detail="Terapeuta não encontrado.")
    return therapist

@router.delete("/{therapist_id}")
def delete_therapist(therapist_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Deleta um terapeuta. Apenas usuários master podem realizar esta ação.
    """
    if current_user.get("role") != "admin_master":
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas master podem deletar terapeutas.")
    
    therapist = db.query(User).filter(User.id == therapist_id, User.role == "therapist").first()
    if not therapist:
        raise HTTPException(status_code=404, detail="Terapeuta não encontrado.")
    
    db.delete(therapist)
    db.commit()
    
    return {"message": f"Terapeuta {therapist.email} deletado com sucesso."}
