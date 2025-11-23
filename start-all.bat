@echo off
chcp 65001 >nul
REM Script para iniciar todos os serviços do Sintropia Pro

echo ========================================
echo   Sintropia Pro - Iniciando Serviços
echo ========================================

REM Abre 4 janelas do Git Bash, cada uma com um serviço

start "Dashboard" bash -i -c "cd ~/OneDrive/Área\ de\ trabalho/sintropia-pro-local/sinergia-pro/sintropia-dashboard/backend && py -m uvicorn main:app --port 8000 --reload"

timeout /t 2 /nobreak

start "Prontuário API" bash -i -c "cd ~/OneDrive/Área\ de\ trabalho/sintropia-pro-local/sinergia-pro/prontuario-api && py -m uvicorn main:app --port 8001 --reload"

timeout /t 2 /nobreak

start "Análise Preditiva" bash -i -c "cd ~/OneDrive/Área\ de\ trabalho/sintropia-pro-local/sinergia-pro/predictive-api && py -m uvicorn main:app --port 8002 --reload"

timeout /t 2 /nobreak

start "Teleterapia API" bash -i -c "cd ~/OneDrive/Área\ de\ trabalho/sintropia-pro-local/sinergia-pro/teletherapy-api && py -m uvicorn main:app --port 8003 --reload"

echo.
echo ========================================
echo   Todos os serviços foram iniciados!
echo ========================================
echo.
echo Acesse o Dashboard em: http://localhost:8000
echo.
pause
