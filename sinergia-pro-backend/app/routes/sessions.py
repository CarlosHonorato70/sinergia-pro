# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.get("/therapist/{therapist_id}")
def get_therapist_sessions(
    therapist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna todas as sessoes de um terapeuta"""
    
    if current_user.get("role") not in ["admin_master", "admin", "therapist"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")
    
    # TODO: Implementar logica de sessoes
    return {
        "therapist_id": therapist_id,
        "total_sessions": 0,
        "completed_sessions": 0,
        "cancelled_sessions": 0,
        "sessions": []
    }

@router.post("/create")
def create_session(
    session_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria uma nova sessao"""
    
    if current_user.get("role") not in ["admin_master", "admin", "therapist"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")
    
    # TODO: Implementar criacao de sessao
    return {"status": "success", "message": "Sessao criada"}

@router.get("/dashboard-stats")
def get_sessions_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna estatisticas de sessoes"""
    
    if current_user.get("role") not in ["admin_master", "admin", "therapist"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")
    
    return {
        "total_sessions": 0,
        "completed_sessions": 0,
        "cancelled_sessions": 0,
        "completion_rate": 0
    }