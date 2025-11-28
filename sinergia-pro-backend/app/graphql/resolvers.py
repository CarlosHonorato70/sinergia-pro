import strawberry
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.connection import get_db
from app.models.user import User
from app.models.appointment import Appointment
from app.models.session import Session as SessionModel

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
class SessionType:
    id: int
    appointment_id: int
    therapist_id: int
    patient_id: int
    status: str
    therapist_rating: Optional[float]
    patient_rating: Optional[float]
    notes: Optional[str]
    started_at: str
    ended_at: Optional[str]
    created_at: str

@strawberry.type
class DashboardStats:
    total_users: int
    total_therapists: int
    total_patients: int
    approved_therapists: int
    approved_patients: int
    pending_users: int
    total_sessions_this_month: int
    completed_sessions: int
    cancelled_sessions: int
    avg_therapist_rating: float
    avg_patient_rating: float
    user_growth_percentage: float

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

    @strawberry.field
    def sessions(self, info) -> List[SessionType]:
        db: Session = info.context["db"]
        try:
            sessions = db.query(SessionModel).all()
            return [SessionType(
                id=s.id,
                appointment_id=s.appointment_id,
                therapist_id=s.therapist_id,
                patient_id=s.patient_id,
                status=s.status,
                therapist_rating=s.therapist_rating,
                patient_rating=s.patient_rating,
                notes=s.notes,
                started_at=s.started_at.isoformat() if s.started_at else "",
                ended_at=s.ended_at.isoformat() if s.ended_at else None,
                created_at=s.created_at.isoformat() if s.created_at else ""
            ) for s in sessions]
        except Exception as e:
            print(f"Erro ao buscar sessões: {e}")
            raise e

    @strawberry.field
    def dashboard_stats(self, info) -> DashboardStats:
        db: Session = info.context["db"]
        try:
            from sqlalchemy import func
            from datetime import datetime, timedelta

            # Contagens
            total_users = db.query(User).count()
            total_therapists = db.query(User).filter(User.role == "therapist").count()
            total_patients = db.query(User).filter(User.role == "patient").count()
            approved_therapists = db.query(User).filter(User.is_approved == True, User.role == "therapist").count()
            approved_patients = db.query(User).filter(User.is_approved == True, User.role == "patient").count()
            pending_users = db.query(User).filter(User.is_approved == False).count()

            # Sessões deste mês
            now = datetime.utcnow()
            month_start = datetime(now.year, now.month, 1)
            
            total_sessions_this_month = db.query(SessionModel).filter(
                SessionModel.created_at >= month_start
            ).count()
            
            completed_sessions = db.query(SessionModel).filter(
                SessionModel.status == "concluída",
                SessionModel.created_at >= month_start
            ).count()
            
            cancelled_sessions = db.query(SessionModel).filter(
                SessionModel.status == "cancelada",
                SessionModel.created_at >= month_start
            ).count()

            # Avaliações médias
            avg_therapist_rating = db.query(func.avg(SessionModel.therapist_rating)).scalar() or 0.0
            avg_patient_rating = db.query(func.avg(SessionModel.patient_rating)).scalar() or 0.0

            # Crescimento de usuários (este mês vs mês anterior)
            last_month_start = month_start - timedelta(days=1)
            last_month_start = datetime(last_month_start.year, last_month_start.month, 1)
            
            users_this_month = db.query(User).filter(
                User.created_at >= month_start
            ).count()
            
            users_last_month = db.query(User).filter(
                User.created_at >= last_month_start,
                User.created_at < month_start
            ).count()
            
            user_growth_percentage = 0.0
            if users_last_month > 0:
                user_growth_percentage = ((users_this_month - users_last_month) / users_last_month) * 100

            return DashboardStats(
                total_users=total_users,
                total_therapists=total_therapists,
                total_patients=total_patients,
                approved_therapists=approved_therapists,
                approved_patients=approved_patients,
                pending_users=pending_users,
                total_sessions_this_month=total_sessions_this_month,
                completed_sessions=completed_sessions,
                cancelled_sessions=cancelled_sessions,
                avg_therapist_rating=float(avg_therapist_rating),
                avg_patient_rating=float(avg_patient_rating),
                user_growth_percentage=user_growth_percentage
            )
        except Exception as e:
            print(f"Erro ao buscar estatísticas: {e}")
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

    @strawberry.mutation
    def create_session(self, info, appointment_id: int, therapist_id: int, patient_id: int, started_at: str) -> SessionType:
        db: Session = info.context["db"]
        try:
            session = SessionModel(
                appointment_id=appointment_id,
                therapist_id=therapist_id,
                patient_id=patient_id,
                status="concluída",
                started_at=datetime.fromisoformat(started_at)
            )
            db.add(session)
            db.commit()
            db.refresh(session)

            return SessionType(
                id=session.id,
                appointment_id=session.appointment_id,
                therapist_id=session.therapist_id,
                patient_id=session.patient_id,
                status=session.status,
                therapist_rating=session.therapist_rating,
                patient_rating=session.patient_rating,
                notes=session.notes,
                started_at=session.started_at.isoformat(),
                ended_at=session.ended_at.isoformat() if session.ended_at else None,
                created_at=session.created_at.isoformat()
            )
        except Exception as e:
            db.rollback()
            print(f"Erro ao criar sessão: {e}")
            raise e

    @strawberry.mutation
    def rate_session(self, info, session_id: int, therapist_rating: Optional[float] = None, patient_rating: Optional[float] = None) -> SessionType:
        db: Session = info.context["db"]
        try:
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if not session:
                raise Exception(f"Sessão com ID {session_id} não encontrada")

            if therapist_rating:
                session.therapist_rating = therapist_rating
            if patient_rating:
                session.patient_rating = patient_rating

            db.commit()
            db.refresh(session)

            return SessionType(
                id=session.id,
                appointment_id=session.appointment_id,
                therapist_id=session.therapist_id,
                patient_id=session.patient_id,
                status=session.status,
                therapist_rating=session.therapist_rating,
                patient_rating=session.patient_rating,
                notes=session.notes,
                started_at=session.started_at.isoformat(),
                ended_at=session.ended_at.isoformat() if session.ended_at else None,
                created_at=session.created_at.isoformat()
            )
        except Exception as e:
            db.rollback()
            print(f"Erro ao avaliar sessão: {e}")
            raise e
