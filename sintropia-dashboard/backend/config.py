"""Configurações do Dashboard"""
import os

# Caminhos dos serviços
BASE_PATH = os.path.expanduser("~/OneDrive/Área de trabalho/sintropia-pro-local/sinergia-pro")

SERVICES = {
    "prontuario": {
        "name": "Prontuário API",
        "path": f"{BASE_PATH}/prontuario-api",
        "port": 8001,
        "command": "py -m uvicorn main:app --port 8001 --reload"
    },
    "predictive": {
        "name": "Análise Preditiva API",
        "path": f"{BASE_PATH}/predictive-api",
        "port": 8002,
        "command": "py -m uvicorn main:app --port 8002 --reload"
    },
    "teletherapy": {
        "name": "Teleterapia API",
        "path": f"{BASE_PATH}/teletherapy-api",
        "port": 8003,
        "command": "py -m uvicorn main:app --port 8003 --reload"
    }
}

# Porta do Dashboard
DASHBOARD_PORT = 8000

# URLs dos serviços
SERVICE_URLS = {
    "prontuario": "http://localhost:8001",
    "predictive": "http://localhost:8002",
    "teletherapy": "http://localhost:8003"
}
