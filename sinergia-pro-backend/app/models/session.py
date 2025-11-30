from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    therapist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheduled_date = Column(DateTime, nullable=False)
    status = Column(String, default="agendada")  # agendada, em andamento, concluída, cancelada
    notes = Column(String, nullable=True)
    therapist_rating = Column(Float, nullable=True)
    patient_rating = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    patient = relationship("User", foreign_keys=[patient_id])
    therapist = relationship("User", foreign_keys=[therapist_id])
