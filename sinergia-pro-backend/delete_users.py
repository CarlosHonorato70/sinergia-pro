from app.database.connection import SessionLocal
from app.models.user import User

db = SessionLocal()

# Deletar TODOS os usuários
db.query(User).delete()
db.commit()

# Verificar quantos restam
count = db.query(User).count()
print(f"✅ Usuários restantes: {count}")

db.close()
