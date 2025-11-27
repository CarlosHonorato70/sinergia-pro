from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.database.connection import Base, engine
from app.graphql.schema import schema
from app.graphql.context import get_context
from app.routes.auth import router as auth_router
from app.routes.appointments import router as appointments_router
from app.routes.admin_master import router as admin_master_router
from app.routes.therapists import router as therapists_router
from app.routes.patients import router as patients_router
import os
from dotenv import load_dotenv

load_dotenv()

# Criar tabelas
Base.metadata.create_all(bind=engine)

# Criar app
app = FastAPI(
    title="Sinergia Pro API",
    description="API de Saúde Mental com IA",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL
graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

# Rotas REST
app.include_router(auth_router)
app.include_router(appointments_router)
app.include_router(admin_master_router)
app.include_router(therapists_router)
app.include_router(patients_router)

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
