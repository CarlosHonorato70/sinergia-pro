conteudo = """from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.database.connection import Base, engine, SessionLocal
from app.graphql.schema import schema
from app.graphql.context import get_context
from app.routes.auth import router as auth_router
from app.routes.appointments import router as appointments_router
from app.routes.admin_master import router as admin_master_router
from app.routes.therapists import router as therapists_router
from app.routes.patients import router as patients_router
from app.routes.reports import router as reports_router
from app.models.user import User
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
import bcrypt
from pydantic import BaseModel

load_dotenv()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(
    title="Sinergia Pro API",
    description="API de Saúde Mental com IA",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

app.include_router(auth_router)
app.include_router(appointments_router)
app.include_router(admin_master_router)
app.include_router(therapists_router)
app.include_router(patients_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {
        "message": "Sinergia Pro API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "graphql": "/graphql"
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.delete("/api/admin/database/users")
async def delete_all_users(db: Session = Depends(get_db)):
    db.query(User).delete()
    db.commit()
    return {"message": "Usuários apagados com sucesso"}

@app.delete("/api/admin/database/sessions")
async def delete_all_sessions(db: Session = Depends(get_db)):
    from app.models.session import Session as SessionModel
    db.query(SessionModel).delete()
    db.commit()
    return {"message": "Sessões apagadas com sucesso"}

@app.delete("/api/admin/database/reports")
async def delete_all_reports(db: Session = Depends(get_db)):
    from app.models.report import Report
    try:
        db.query(Report).delete()
        db.commit()
        return {"message": "Relatórios apagados com sucesso"}
    except:
        return {"message": "Módulo de Relatórios não configurado"}

@app.delete("/api/admin/database/financial")
async def delete_all_financial(db: Session = Depends(get_db)):
    from app.models.financial import Financial
    try:
        db.query(Financial).delete()
        db.commit()
        return {"message": "Dados financeiros apagados com sucesso"}
    except:
        return {"message": "Módulo Financeiro não configurado"}

@app.delete("/api/admin/database/logs")
async def delete_all_logs(db: Session = Depends(get_db)):
    from app.models.log import Log
    try:
        db.query(Log).delete()
        db.commit()
        return {"message": "Logs apagados com sucesso"}
    except:
        return {"message": "Módulo de Logs não configurado"}

@app.delete("/api/admin/database/complete")
async def delete_complete_database(db: Session = Depends(get_db)):
    try:
        db.query(User).delete()
        from app.models.session import Session as SessionModel
        db.query(SessionModel).delete()
        db.commit()
        return {"message": "Banco de dados zerado com sucesso!"}
    except Exception as e:
        return {"error": str(e)}

class PasswordRequest(BaseModel):
    password: str

@app.post("/api/admin/verify-password")
async def verify_admin_password(request: PasswordRequest, db: Session = Depends(get_db)):
    print(f"RECEBIDO: {request}")
    print(f"SENHA: {request.password}")
    
    admin_user = db.query(User).filter(User.role == "admin_master").first()
    
    if not admin_user:
        print("Admin não encontrado")
        return {"valid": False}
    
    try:
        resultado = bcrypt.checkpw(
            request.password.encode('utf-8'), 
            admin_user.password.encode('utf-8')
        )
        print(f"RESULTADO: {resultado}")
        return {"valid": resultado}
    except Exception as e:
        print(f"ERRO: {e}")
        return {"valid": False}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
"""

with open("main.py", "w", encoding="utf-8") as f:
    f.write(conteudo)

print("main.py reconstruído!")
