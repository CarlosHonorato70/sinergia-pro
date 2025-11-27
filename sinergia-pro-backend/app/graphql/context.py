from app.database.connection import SessionLocal

async def get_context():
    db = SessionLocal()
    try:
        return {"db": db}
    finally:
        db.close()
