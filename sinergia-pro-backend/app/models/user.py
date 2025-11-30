from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.database.connection import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    role = Column(String, default="patient")
    is_approved = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    verification_token_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def set_password(self, password: str):
        """Hash e armazena a senha"""
        self.password = pwd_context.hash(password)

    def check_password(self, password: str) -> bool:
        """Verifica se a senha esta correta"""
        return pwd_context.verify(password, self.password)