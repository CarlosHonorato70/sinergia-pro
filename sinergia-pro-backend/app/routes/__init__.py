from app.routes.auth import router as auth_router
from app.routes.appointments import router as appointments_router
from app.routes import admin_master

__all__ = ["auth_router", "appointments_router", "admin_master"]
