from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    role = Column(String, default="patient")  # master, admin, therapist, patient

    # ⚠️ Campo que estava faltando
    is_approved = Column(Boolean, default=False)

    # se quiser verificar email por token mais tarde
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    verification_token_expires = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
