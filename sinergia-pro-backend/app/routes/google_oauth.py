from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database.connection import get_db
from app.models.user import User
from app.utils.auth import create_access_token, hash_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/google-login")
def google_login(email: str, name: str | None = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    # Se email nunca existiu → criar como pendente
    if not user:
        user = User(
            email=email,
            password=hash_password("oauth_google"),
            name=name,
            role="pending",
            is_approved=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # BLOQUEIO DE USUÁRIOS PENDENTES
    if user.role == 'pending' or user.is_approved is False:
        raise HTTPException(status_code=403, detail='Aguarde aprovação do Administrador Master.')

    # BLOQUEIO DE USUÁRIOS REJEITADOS
    if user.role == 'rejected':
        raise HTTPException(status_code=403, detail='Cadastro rejeitado pelo Administrador Master.')

    token = create_access_token({"sub": user.email, "role": user.role})

    return {
        "access_token": token,
        "role": user.role,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }
