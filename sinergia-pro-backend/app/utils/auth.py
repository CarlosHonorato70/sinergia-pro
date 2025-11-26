import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from fastapi import Header, HTTPException
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_secreta")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

    return encoded_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        return None

def get_current_user(authorization: str = Header(None, alias="Authorization")):
    """
    Extrai o usuário do header Authorization.
    Esperado formato: "Bearer <token>"
    Retorna um dicionário com o payload do token
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não fornecido")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Esquema inválido")
    except ValueError:
        raise HTTPException(status_code=401, detail="Formato de token inválido")

    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token sem user_id")

    # Retorna o payload do token (que contém sub e role)
    return payload


def verify_master(current_user):
    """Verifica se o usuário é master"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")
    
    role = current_user.get("role") if isinstance(current_user, dict) else getattr(current_user, 'role', None)
    
    if role != "master":
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas Master pode executar esta ação.")
    
    return True
