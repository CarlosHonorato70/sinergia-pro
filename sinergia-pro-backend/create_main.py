with open('app/main.py', 'w', encoding='utf-8') as f:
    f.write("""from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, therapists
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sinergia API",
    description="Backend da plataforma Sinergia",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(therapists.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API Sinergia! 🚀"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
""")
print("✅ app/main.py criado!")