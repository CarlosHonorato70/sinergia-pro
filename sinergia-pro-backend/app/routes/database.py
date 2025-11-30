# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from app.database.connection import engine, Base, get_db, DATABASE_URL
from app.models.user import User
import bcrypt
from sqlalchemy.orm import sessionmaker

router = APIRouter(
    prefix="/api/database",
    tags=["Database Management"]
)

class ResetRequest(BaseModel):
    password: str

@router.delete("/reset-all")
def reset_database(
    reset_req: ResetRequest,
    authorization: str = Header(None)
):
    """
    Reseta o banco de dados completamente.
    NÃO precisa de token válido - apenas a senha correta.
    """
    
    try:
        # 1. Criar uma sessão ANTES de dropar as tabelas
        Session = sessionmaker(bind=engine)
        db = Session()
        
        try:
            # 2. Buscar QUALQUER admin_master no banco (antes de apagar)
            admin_master = db.query(User).filter(
                User.role == "admin_master"
            ).first()
            
            if not admin_master:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Nenhum admin_master encontrado no sistema"
                )
            
            # 3. Validar a senha
            try:
                # Tentar decodificar a senha
                is_valid = bcrypt.checkpw(
                    reset_req.password.encode(),
                    admin_master.password.encode()
                )
            except:
                # Se falhar na comparação, a senha está errada
                is_valid = False
            
            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Senha do admin_master incorreta"
                )
            
            # 4. Fechar a sessão ANTES de dropar as tabelas
            db.close()
            
            # 5. AGORA pode fazer o reset seguro
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            
            return {
                "status": "success",
                "message": "Banco de dados resetado com sucesso",
                "redirect": "/login",
                "clear_token": True
            }
            
        finally:
            db.close()
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERRO NO RESET: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao resetar banco: {str(e)}"
        )