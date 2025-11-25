from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserLogin, UserCreate, UserResponse
from app.utils.auth import verify_password, hash_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60

@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == data.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    user = User(
        email=data.email,
        password=hash_password(data.password),
        name=data.name,
        role="patient",  # Novo usuário sempre começa como patient
        is_approved=False  # Pendente de aprovação
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role
    )

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    # BLOQUEIO DE USUÁRIOS PENDENTES
    if user.is_approved is False:
        raise HTTPException(status_code=403, detail="Seu cadastro ainda não foi aprovado.")

    # BLOQUEIO DE USUÁRIOS REJEITADOS
    if user.role == "rejected":
        raise HTTPException(status_code=403, detail="Seu cadastro foi rejeitado pelo Administrador Master.")

    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        {"sub": user.email, "role": user.role},
        expires
    )

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
