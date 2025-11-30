# -*- coding: utf-8 -*-
from app.database.connection import Base, engine, SessionLocal
from app.models.user import User
import bcrypt

def init_db():
    """Inicializa o banco com dados padrão"""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Verificar se já existe admin_master VERIFICADO
        admin_exists = db.query(User).filter(
            User.role == "admin_master",
            User.is_verified == True
        ).first()
        
        if not admin_exists:
            print("✅ Criando/Atualizando admin_master padrão...")
            
            # Buscar admin existente
            admin = db.query(User).filter(User.role == "admin_master").first()
            
            if admin:
                # Atualizar para verificado
                admin.is_verified = True
                admin.is_approved = True
                db.commit()
                print(f"✅ Admin Master atualizado para verificado!")
            else:
                # Criar novo
                password = "admin123"
                hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
                
                admin = User(
                    email="admin@sinergiapro.com",
                    password=hashed_password,
                    name="Administrador Master",
                    role="admin_master",
                    is_verified=True,
                    is_approved=True
                )
                
                db.add(admin)
                db.commit()
                
                print(f"✅ Admin Master criado!")
                print(f"📧 Email: admin@sinergiapro.com")
                print(f"🔐 Senha: admin123")
        else:
            print("✅ Admin master já existe e está verificado")
    
    except Exception as e:
        print(f"❌ Erro ao inicializar: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()