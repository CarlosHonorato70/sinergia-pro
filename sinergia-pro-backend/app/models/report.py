from sqlalchemy import Column, Integer, String, DateTime, Float, Text
from datetime import datetime
from app.database.connection import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    report_type = Column(String)  # satisfaction, sessions, financial, etc
    created_by = Column(Integer)  # user_id
    created_at = Column(DateTime, default=datetime.utcnow)
    data = Column(Text, nullable=True)  # JSON data