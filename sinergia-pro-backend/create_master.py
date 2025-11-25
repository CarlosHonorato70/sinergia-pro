import argparse
from app.database.connection import SessionLocal
from app.models.user import User
from app.utils.auth import hash_password

def create_master(email: str, password: str, name: str):
    db = SessionLocal()

    # Verifica se já existe um master
    existing_master = db.query(User).filter(User.role == "master").first()
    if existing_master:
        print("❌ Já existe um Administrador Master cadastrado.")
        print(f"Master atual: {existing_master.email}")
        db.close()
        return

    # Verifica se já existe o e-mail
    existing_email = db.query(User).filter(User.email == email).first()
    if existing_email:
        print(f"❌ O e-mail {email} já está cadastrado.")
        db.close()
        return

    # Cria o administrador master
    master = User(
        email=email,
        password=hash_password(password),
        name=name,
        role="master",
        is_verified=True,
        is_approved=True
    )

    db.add(master)
    db.commit()
    db.refresh(master)
    db.close()

    print("✅ Administrador Master criado com sucesso!")
    print(f"Email: {master.email}")
    print(f"Nome : {master.name}")
    print("Role : master")
    print("Acesso total liberado.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Criar Administrador Master do sistema")
    parser.add_argument("--email", required=True, help="E-mail do Administrador Master")
    parser.add_argument("--senha", required=True, help="Senha do Administrador Master")
    parser.add_argument("--nome", required=True, help="Nome do Administrador Master")

    args = parser.parse_args()
    create_master(args.email, args.senha, args.nome)
