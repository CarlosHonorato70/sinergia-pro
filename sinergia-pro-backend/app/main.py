from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth_router, appointments_router
from app.routes import admin_master
from app.database.connection import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(appointments_router)
app.include_router(admin_master.router, prefix="/api/admin", tags=["Admin Master"])

@app.get("/")
def root():
    return {"message": "API Sinergia funcionando!"}
