from app.database.connection import SessionLocal
from app.models.user import User

db = SessionLocal()
admin = db.query(User).filter(User.email == "coach.honorato@gmail.com").first()

if admin:
    print(f"✅ Admin encontrado!")
    print(f"   ID: {admin.id}")
    print(f"   Nome: {admin.name}")
    print(f"   Email: {admin.email}")
    print(f"   Role: {admin.role}")
    print(f"   Aprovado: {admin.is_approved}")
else:
    print("❌ Admin NÃO encontrado!")

db.close()
