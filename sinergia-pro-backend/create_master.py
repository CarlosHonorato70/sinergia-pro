import argparse
from app.database.connection import SessionLocal, Base, engine
from app.models.user import User
from app.utils.auth import hash_password

# Criar todas as tabelas
Base.metadata.create_all(bind=engine)

parser = argparse.ArgumentParser()
parser.add_argument('--email', required=True)
parser.add_argument('--senha', required=True)
parser.add_argument('--nome', required=True)

args = parser.parse_args()

db = SessionLocal()

# Verificar se já existe
existing = db.query(User).filter(User.email == args.email).first()
if existing:
    print(f'❌ Usuário {args.email} já existe!')
    db.close()
    exit(1)

# Criar master
master = User(
    email=args.email,
    password=hash_password(args.senha),
    name=args.nome,
    role='admin_master',
    is_approved=True,
    is_verified=True
)

db.add(master)
db.commit()
db.close()

print('✅ Administrador Master criado com sucesso!')
print(f'Email: {args.email}')
print(f'Nome : {args.nome}')
print(f'Role : admin_master')
print('Acesso total liberado.')
