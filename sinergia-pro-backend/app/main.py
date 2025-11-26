from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_router, appointments_router, admin_master_router
from app.database.connection import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(auth_router, prefix="/api/auth")
app.include_router(appointments_router, prefix="/api/appointments")
app.include_router(admin_master_router)

@app.get("/")
def read_root():
    return {"message": "API Sinergia Pro funcionando!"}