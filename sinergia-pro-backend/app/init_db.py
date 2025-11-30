from app.database.connection import engine, Base
from app.models.user import User
from app.models.appointment import Appointment
from app.models.session import Session
from app.models.report import Report

def init_db():
    """Cria todas as tabelas no banco de dados VAZIAS"""
    Base.metadata.create_all(bind=engine)
    print("✅ Banco de dados inicializado (vazio)!")

if __name__ == "__main__":
    init_db()