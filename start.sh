#!/bin/bash

# Iniciar o backend
cd sinergia-pro-backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Aguardar um pouco
sleep 5

# Iniciar o frontend
cd ../sinergia-pro-dashboard-react
npm install
npm run build
npm install -g serve
serve -s build -l 3000
