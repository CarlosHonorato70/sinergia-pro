"""Backend do Dashboard - FastAPI"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict
import os
from config import SERVICES, DASHBOARD_PORT
from services_manager import ServiceManager

# Inicializa o FastAPI
app = FastAPI(
    title="Sintropia Pro Dashboard",
    description="Dashboard para gerenciar os 3 serviços do Sintropia Pro",
    version="1.0.0"
)

# CORS - Permite requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gerenciador de serviços
manager = ServiceManager()

# --- Modelos Pydantic ---

class ServiceResponse(BaseModel):
    name: str
    service_id: str
    running: bool
    port: int
    url: str

class ActionResponse(BaseModel):
    status: str
    message: str
    pid: int = None

# --- Endpoints ---

@app.get("/health")
async def health_check():
    """Verifica se o Dashboard está ativo"""
    return {"status": "ok", "service": "Sintropia Pro Dashboard"}

@app.get("/api/services", response_model=List[ServiceResponse])
async def get_all_services():
    """Lista todos os serviços e seus status"""
    return manager.get_all_status()

@app.get("/api/services/{service_id}", response_model=ServiceResponse)
async def get_service_status(service_id: str):
    """Obtém o status de um serviço específico"""
    if service_id not in SERVICES:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return manager.get_status(service_id)

@app.post("/api/services/{service_id}/start", response_model=ActionResponse)
async def start_service(service_id: str):
    """Inicia um serviço específico"""
    result = manager.start_service(service_id)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.post("/api/services/{service_id}/stop", response_model=ActionResponse)
async def stop_service(service_id: str):
    """Para um serviço específico"""
    result = manager.stop_service(service_id)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.post("/api/services/{service_id}/restart", response_model=ActionResponse)
async def restart_service(service_id: str):
    """Reinicia um serviço específico"""
    result = manager.restart_service(service_id)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.get("/api/services/{service_id}/logs")
async def get_service_logs(service_id: str):
    """Obtém os logs de um serviço"""
    if service_id not in SERVICES:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    logs = manager.get_logs(service_id)
    return {"service_id": service_id, "logs": logs}

@app.post("/api/start-all")
async def start_all_services():
    """Inicia todos os serviços"""
    results = {}
    for service_id in SERVICES.keys():
        results[service_id] = manager.start_service(service_id)
    return {"status": "success", "results": results}

@app.post("/api/stop-all")
async def stop_all_services():
    """Para todos os serviços"""
    results = {}
    for service_id in SERVICES.keys():
        results[service_id] = manager.stop_service(service_id)
    return {"status": "success", "results": results}

# Servir arquivos estáticos (Frontend)
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=DASHBOARD_PORT)
