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

    # Se email nunca existiu → criar como paciente por padrão
    if not user:
        user = User(
            email=email,
            password=hash_password("oauth_google"),
            name=name,
            role="patient"  # padrão seguro
        )
        db.add(user)
        db.commit()
        db.refresh(user)

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

# GOOGLE LOGIN BLOQUEIO DE PENDENTES/REJEITADOS
if user.role == 'pending' or user.is_approved == False:
 raise HTTPException(status_code=403, detail='Aguarde aprovação do Administrador Master.')
if user.role == 'rejected':
 raise HTTPException(status_code=403, detail='Cadastro rejeitado pelo Administrador Master.')

# DEFINIR GOOGLE USER COMO PENDING
user.role = 'pending'
user.is_approved = False
