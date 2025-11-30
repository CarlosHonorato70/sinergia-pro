from app.database.connection import SessionLocal, Base, engine
from app.models.user import User
import bcrypt

# Criar tabelas
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Verificar se já existe admin
existing_admin = db.query(User).filter(User.email == "coach.honorato@gmail.com").first()
if existing_admin:
    print("⚠️ Admin Master já existe!")
    db.close()
    exit()

# Hash da senha
hashed = bcrypt.hashpw("892578".encode(), bcrypt.gensalt()).decode()

# Criar ADMIN MASTER
admin = User(
    name="Coach Honorato",
    email="coach.honorato@gmail.com",
    password=hashed,
    role="admin_master",
    is_verified=True,
    is_approved=True
)

db.add(admin)
db.commit()
print("✅ Admin Master criado!")
print("   Email: coach.honorato@gmail.com")
print("   Senha: 892578")

db.close()
