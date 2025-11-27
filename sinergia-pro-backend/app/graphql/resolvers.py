import strawberry
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User

@strawberry.type
class UserType:
    id: int
    name: Optional[str]
    email: str
    role: str
    is_approved: bool

@strawberry.type
class TherapistType:
    id: int
    name: Optional[str]
    email: str
    role: str
    is_approved: bool
    specialty: Optional[str] = None

@strawberry.type
class Query:
    @strawberry.field
    def approved_patients(self, info) -> List[UserType]:
        db: Session = info.context["db"]
        try:
            patients = db.query(User).filter(User.is_approved == True, User.role == "patient").all()
            return [UserType(
                id=p.id,
                name=p.name,
                email=p.email,
                role=p.role,
                is_approved=p.is_approved
            ) for p in patients]
        except Exception as e:
            print(f"Erro ao buscar pacientes aprovados: {e}")
            raise e

    @strawberry.field
    def approved_therapists(self, info) -> List[TherapistType]:
        db: Session = info.context["db"]
        try:
            therapists = db.query(User).filter(User.is_approved == True, User.role == "therapist").all()
            return [TherapistType(
                id=t.id,
                name=t.name,
                email=t.email,
                role=t.role,
                is_approved=t.is_approved,
                specialty=getattr(t, 'specialty', None)
            ) for t in therapists]
        except Exception as e:
            print(f"Erro ao buscar terapeutas aprovados: {e}")
            raise e

    @strawberry.field
    def users(self, info) -> List[UserType]:
        db: Session = info.context["db"]
        try:
            all_users = db.query(User).all()
            return [UserType(
                id=u.id,
                name=u.name,
                email=u.email,
                role=u.role,
                is_approved=u.is_approved
            ) for u in all_users]
        except Exception as e:
            print(f"Erro ao buscar todos os usuários: {e}")
            raise e

@strawberry.type
class Mutation:
    @strawberry.mutation
    def update_user(self, info, id: int, role: Optional[str] = None, name: Optional[str] = None, email: Optional[str] = None) -> UserType:
        db: Session = info.context["db"]
        try:
            user = db.query(User).filter(User.id == id).first()
            if not user:
                raise Exception(f"Usuário com ID {id} não encontrado")
            
            if role:
                user.role = role
            if name:
                user.name = name
            if email:
                user.email = email
            
            db.commit()
            db.refresh(user)
            
            return UserType(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
                is_approved=user.is_approved
            )
        except Exception as e:
            db.rollback()
            print(f"Erro ao atualizar usuário: {e}")
            raise e

    @strawberry.mutation
    def delete_user(self, info, id: int) -> bool:
        db: Session = info.context["db"]
        try:
            user = db.query(User).filter(User.id == id).first()
            if not user:
                raise Exception(f"Usuário com ID {id} não encontrado")
            
            db.delete(user)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            print(f"Erro ao deletar usuário: {e}")
            raise e

    @strawberry.mutation
    def approve_user(self, info, id: int) -> UserType:
        db: Session = info.context["db"]
        try:
            user = db.query(User).filter(User.id == id).first()
            if not user:
                raise Exception(f"Usuário com ID {id} não encontrado")
            
            user.is_approved = True
            db.commit()
            db.refresh(user)
            
            return UserType(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
                is_approved=user.is_approved
            )
        except Exception as e:
            db.rollback()
            print(f"Erro ao aprovar usuário: {e}")
            raise e

    @strawberry.mutation
    def reject_user(self, info, id: int) -> UserType:
        db: Session = info.context["db"]
        try:
            user = db.query(User).filter(User.id == id).first()
            if not user:
                raise Exception(f"Usuário com ID {id} não encontrado")
            
            user.is_approved = False
            db.commit()
            db.refresh(user)
            
            return UserType(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
                is_approved=user.is_approved
            )
        except Exception as e:
            db.rollback()
            print(f"Erro ao rejeitar usuário: {e}")
            raise e
