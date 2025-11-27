from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/patients", tags=["patients"])

@router.get("", response_model=List[UserResponse])
def get_patients(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Lista todos os pacientes do sistema. Apenas usuários autenticados podem acessar.
    """
    patients = db.query(User).filter(User.role == "patient").all()
    return patients

@router.get("/{patient_id}", response_model=UserResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Retorna os detalhes de um paciente específico.
    """
    patient = db.query(User).filter(User.id == patient_id, User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")
    return patient

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Deleta um paciente. Apenas usuários master podem realizar esta ação.
    """
    if current_user.get("role") != "admin_master":
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas master podem deletar pacientes.")
    
    patient = db.query(User).filter(User.id == patient_id, User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")
    
    db.delete(patient)
    db.commit()
    
    return {"message": f"Paciente {patient.email} deletado com sucesso."}
