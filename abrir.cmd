@echo off
cd /d "C:\Users\Carlos Honorato\OneDrive\Área de trabalho\sintropia-pro-local\sinergia-pro"
start "" "bash" "-i" "-c" "cd sintropia-dashboard/backend && py -m uvicorn main:app --port 8000 --reload"
timeout /t 3 /nobreak
start "" "bash" "-i" "-c" "cd ../../../prontuario-api && py -m uvicorn main:app --port 8001 --reload"
timeout /t 2 /nobreak
start "" "bash" "-i" "-c" "cd ../../../predictive-api && py -m uvicorn main:app --port 8002 --reload"
timeout /t 2 /nobreak
start "" "bash" "-i" "-c" "cd ../../../teletherapy-api && py -m uvicorn main:app --port 8003 --reload"
timeout /t 3 /nobreak
start http://localhost:8000
