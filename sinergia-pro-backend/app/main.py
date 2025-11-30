# -*- coding: utf-8 -*-
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, appointments, sessions, reports, database, admin, admin_master, patients, therapists
from app.database.connection import Base, engine

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sinergia Pro API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Importar rotas
app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(sessions.router)
app.include_router(reports.router)
app.include_router(database.router)
app.include_router(admin.router)
app.include_router(admin_master.router)
app.include_router(patients.router)
app.include_router(therapists.router)

@app.get("/")
def read_root():
    return {"message": "Sinergia Pro API"}