"""Gerenciador de Processos dos Serviços"""
import subprocess
import psutil
import os
from typing import Dict, List
from config import SERVICES

class ServiceManager:
    def __init__(self):
        self.processes: Dict[str, subprocess.Popen] = {}
        self.logs: Dict[str, List[str]] = {service: [] for service in SERVICES.keys()}

    def start_service(self, service_name: str) -> Dict:
        """Inicia um serviço específico"""
        if service_name not in SERVICES:
            return {"status": "error", "message": f"Serviço '{service_name}' não encontrado"}
        
        if self.is_running(service_name):
            return {"status": "warning", "message": f"{SERVICES[service_name]['name']} já está rodando"}

        try:
            service = SERVICES[service_name]
            
            # Muda para o diretório do serviço
            os.chdir(service["path"])
            
            # Inicia o processo
            process = subprocess.Popen(
                service["command"],
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            self.processes[service_name] = process
            self.logs[service_name].append(f"✅ Serviço iniciado com PID {process.pid}")
            
            return {
                "status": "success",
                "message": f"{service['name']} iniciado com sucesso",
                "pid": process.pid
            }
        
        except Exception as e:
            self.logs[service_name].append(f"❌ Erro ao iniciar: {str(e)}")
            return {"status": "error", "message": f"Erro ao iniciar serviço: {str(e)}"}

    def stop_service(self, service_name: str) -> Dict:
        """Para um serviço específico"""
        if service_name not in SERVICES:
            return {"status": "error", "message": f"Serviço '{service_name}' não encontrado"}
        
        if not self.is_running(service_name):
            return {"status": "warning", "message": f"{SERVICES[service_name]['name']} não está rodando"}

        try:
            process = self.processes[service_name]
            process.terminate()
            process.wait(timeout=5)
            
            del self.processes[service_name]
            self.logs[service_name].append(f"⛔ Serviço parado")
            
            return {
                "status": "success",
                "message": f"{SERVICES[service_name]['name']} parado com sucesso"
            }
        
        except subprocess.TimeoutExpired:
            process.kill()
            del self.processes[service_name]
            self.logs[service_name].append(f"⛔ Serviço forçadamente encerrado")
            return {"status": "success", "message": f"{SERVICES[service_name]['name']} forçadamente encerrado"}
        
        except Exception as e:
            self.logs[service_name].append(f"❌ Erro ao parar: {str(e)}")
            return {"status": "error", "message": f"Erro ao parar serviço: {str(e)}"}

    def is_running(self, service_name: str) -> bool:
        """Verifica se um serviço está rodando"""
        if service_name not in self.processes:
            return False
        
        process = self.processes[service_name]
        return process.poll() is None

    def get_status(self, service_name: str) -> Dict:
        """Obtém o status de um serviço"""
        if service_name not in SERVICES:
            return {"status": "error", "message": "Serviço não encontrado"}

        service = SERVICES[service_name]
        is_running = self.is_running(service_name)
        
        return {
            "name": service["name"],
            "service_id": service_name,
            "running": is_running,
            "port": service["port"],
            "url": f"http://localhost:{service['port']}"
        }

    def get_all_status(self) -> List[Dict]:
        """Obtém o status de todos os serviços"""
        return [self.get_status(service_name) for service_name in SERVICES.keys()]

    def get_logs(self, service_name: str) -> List[str]:
        """Obtém os logs de um serviço"""
        if service_name not in self.logs:
            return []
        return self.logs[service_name][-50:]  # Últimas 50 linhas

    def restart_service(self, service_name: str) -> Dict:
        """Reinicia um serviço"""
        self.stop_service(service_name)
        return self.start_service(service_name)
