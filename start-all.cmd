@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "BASE_PATH=C:\Users\Carlos Honorato\OneDrive\Área de trabalho\sintropia-pro-local\sinergia-pro"

echo ========================================
echo   Sinergia Pro - Iniciando Servicos
echo ========================================
echo.

REM Dashboard
start "Dashboard" cmd /k "cd /d "!BASE_PATH!\sintropia-dashboard\backend" && py -m uvicorn main:app --port 8000 --reload"
timeout /t 5 /nobreak

REM Prontuário API
start "Prontuario API" cmd /k "cd /d "!BASE_PATH!\prontuario-api" && py -m uvicorn main:app --port 8001 --reload"
timeout /t 3 /nobreak

REM Análise Preditiva
start "Analise Preditiva" cmd /k "cd /d "!BASE_PATH!\predictive-api" && py -m uvicorn main:app --port 8002 --reload"
timeout /t 3 /nobreak

REM Teleterapia API
start "Teleterapia API" cmd /k "cd /d "!BASE_PATH!\teletherapy-api" && py -m uvicorn main:app --port 8003 --reload"
timeout /t 5 /nobreak

REM Abre o Dashboard no Chrome
start chrome http://localhost:8000

echo.
echo ========================================
echo   Todos os servicos foram iniciados!
echo ========================================
