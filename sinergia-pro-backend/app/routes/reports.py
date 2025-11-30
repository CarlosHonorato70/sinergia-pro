# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.session import Session as SessionModel
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retorna estatisticas gerais do sistema"""

    if current_user.get("role") not in ["admin_master", "admin"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")

    users = db.query(User).all()

    total_users = len(users)
    active_therapists = len([u for u in users if u.role == "therapist" and u.is_approved])
    registered_patients = len([u for u in users if u.role == "patient" and u.is_approved])
    pending_approval = len([u for u in users if not u.is_approved])

    return {
        "total_users": total_users,
        "active_therapists": active_therapists,
        "registered_patients": registered_patients,
        "pending_approval": pending_approval,
        "user_growth": 0,
        "retention_rate": 0,
    }

@router.get("/sessions")
def get_sessions_report(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retorna relatorio de sessoes"""

    if current_user.get("role") not in ["admin_master", "admin"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")

    sessions = db.query(SessionModel).all()
    total_sessions = len(sessions)
    completed_sessions = len([s for s in sessions if s.status == "completed"])
    cancelled_sessions = len([s for s in sessions if s.status == "cancelled"])
    completion_rate = int((completed_sessions / total_sessions * 100) if total_sessions > 0 else 0)

    return {
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "cancelled_sessions": cancelled_sessions,
        "completion_rate": completion_rate,
    }

@router.get("/satisfaction")
def get_satisfaction_report(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retorna relatorio de satisfacao"""

    if current_user.get("role") not in ["admin_master", "admin"]:
        raise HTTPException(status_code=403, detail="Acesso negado.")

    return {
        "therapists_rating": 0,
        "patients_rating": 0,
        "system_satisfaction": 0,
    }