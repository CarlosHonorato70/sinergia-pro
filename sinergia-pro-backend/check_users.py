from app.database.connection import SessionLocal
from app.models.user import User

db = SessionLocal()
users = db.query(User).all()

print(f"Total de usuários: {len(users)}\n")
for u in users:
    print(f"ID: {u.id} | Nome: {u.name} | Email: {u.email} | Role: {u.role} | Aprovado: {u.is_approved}")

db.close()
