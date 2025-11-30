# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.utils.auth import create_access_token
import bcrypt

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    user_type: str = Field(..., pattern="^(therapist|patient|admin_master)$")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.get("/status")
def auth_status(db: Session = Depends(get_db)):
    """
    Retorna o status do sistema:
    - empty: banco vazio (sem usuários)
    - ready: pronto para login
    """
    user_count = db.query(User).count()

    return {
        "status": "empty" if user_count == 0 else "ready",
        "user_count": user_count
    }

@router.post("/register-first-admin")
def register_first_admin(
    req: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Registra o PRIMEIRO admin_master do sistema.
    Só funciona se o banco estiver vazio!
    """

    user_count = db.query(User).count()
    if user_count > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sistema já inicializado. Use /login para acessar ou /register para outros usuários."
        )

    if req.user_type != "admin_master":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O primeiro usuário deve ser do tipo 'admin_master'."
        )

    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já registrado"
        )

    try:
        hashed_password = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()

        admin = User(
            email=req.email,
            password=hashed_password,
            name=req.full_name,
            role="admin_master",
            is_verified=True,
            is_approved=True
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        access_token = create_access_token(
            data={
                "sub": admin.email,
                "role": admin.role
            }
        )

        return {
            "status": "success",
            "message": "Admin master criado com sucesso!",
            "access_token": access_token,
            "user": {
                "email": admin.email,
                "name": admin.name,
                "role": admin.role
            }
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao registrar: {str(e)}"
        )

@router.post("/register")
def register_user(
    req: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Registra um novo usuário (terapeuta ou paciente).
    Requer que o banco NÃO esteja vazio (admin já criado).
    """

    user_count = db.query(User).count()
    if user_count == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sistema não inicializado. Registre o admin_master primeiro usando /register-first-admin."
        )

    if req.user_type not in ["therapist", "patient"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de usuário inválido. Deve ser 'therapist' ou 'patient'."
        )

    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já registrado"
        )

    try:
        hashed_password = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()

        new_user = User(
            email=req.email,
            password=hashed_password,
            name=req.full_name,
            role=req.user_type,
            is_verified=True,
            is_approved=False
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "status": "success",
            "message": f"Usuário '{req.user_type}' registrado com sucesso! Aguardando aprovação do administrador.",
            "user": {
                "email": new_user.email,
                "name": new_user.name,
                "role": new_user.role
            }
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao registrar: {str(e)}"
        )

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Login padrão para usuários já registrados
    """

    user_count = db.query(User).count()
    if user_count == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sistema não inicializado. Faça o registro do admin_master primeiro."
        )

    user = db.query(User).filter(User.email == req.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    try:
        is_valid = bcrypt.checkpw(req.password.encode(), user.password.encode())
    except:
        is_valid = False

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário não verificado"
        )
    if not user.is_approved:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário aguardando aprovação do administrador"
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "status": "success",
        "access_token": access_token,
        "user": {
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }
