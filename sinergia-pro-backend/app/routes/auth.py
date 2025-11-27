from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserLogin, UserCreate, UserResponse
from app.utils.auth import verify_password, hash_password, create_access_token, get_current_user

router = APIRouter(tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60

@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == data.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # Verificar se é o primeiro cadastro
    user_count = db.query(User).count()
    
    if user_count == 0:
        # Primeiro cadastro = Admin Master (sem aprovação necessária)
        user = User(
            email=data.email,
            password=hash_password(data.password),
            name=data.name,
            role="admin_master",
            is_approved=True
        )
    else:
        # Demais cadastros = Patient (precisa aprovação)
        user = User(
            email=data.email,
            password=hash_password(data.password),
            name=data.name,
            role="patient",
            is_approved=False
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

    # Admin Master não precisa de aprovação
    if user.role == "admin_master":
        expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token = create_access_token(
            {"sub": str(user.id), "role": user.role},
            expires
        )
        return {
            "access_token": token,
            "role": user.role,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "is_approved": user.is_approved
            }
        }

    # Outros roles (admin, therapist, patient) precisam de aprovação
    if user.is_approved is False:
        raise HTTPException(status_code=403, detail="Seu cadastro ainda não foi aprovado.")

    # BLOQUEIO DE USUÁRIOS REJEITADOS
    if user.role == "rejected":
        raise HTTPException(status_code=403, detail="Seu cadastro foi rejeitado pelo Administrador Master.")

    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        {"sub": str(user.id), "role": user.role},
        expires
    )

    return {
        "access_token": token,
        "role": user.role,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "is_approved": user.is_approved
        }
    }

@router.get("/users/me")
def get_current_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retorna as informações do usuário autenticado"""
    user_id = int(current_user["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "is_approved": user.is_approved
    }