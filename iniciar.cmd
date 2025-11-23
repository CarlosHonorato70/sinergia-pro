@echo off
chcp 65001 >nul
cd /d "C:\Users\Carlos Honorato\OneDrive\Área de trabalho\sintropia-pro-local\sinergia-pro"

echo.
echo ========================================
echo   SINERGIA PRO - Iniciando Servicos
echo ========================================
echo.

REM Inicia os 4 serviços em paralelo
start "Dashboard" cmd /c "cd sintropia-dashboard\backend && py -m uvicorn main:app --port 8000 --reload"
start "Prontuario" cmd /c "cd prontuario-api && py -m uvicorn main:app --port 8001 --reload"
start "Preditiva" cmd /c "cd predictive-api && py -m uvicorn main:app --port 8002 --reload"
start "Teleterapia" cmd /c "cd teletherapy-api && py -m uvicorn main:app --port 8003 --reload"

timeout /t 8

REM Abre o Dashboard no Chrome
start chrome http://localhost:8000

echo.
echo ========================================
echo   Servicos iniciados!
echo ========================================
pause
