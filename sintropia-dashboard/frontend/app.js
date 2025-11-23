const API_BASE_URL = 'http://localhost:8000/api';

// Estado global
let currentServiceLogs = 'prontuario';

// Elementos DOM
const servicesContainer = document.getElementById('servicesContainer');
const logText = document.getElementById('logText');
const logTabs = document.querySelectorAll('.log-tab');
const startAllBtn = document.getElementById('startAllBtn');
const stopAllBtn = document.getElementById('stopAllBtn');
const refreshBtn = document.getElementById('refreshBtn');

// Event Listeners
startAllBtn.addEventListener('click', startAllServices);
stopAllBtn.addEventListener('click', stopAllServices);
refreshBtn.addEventListener('click', loadServices);

logTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        logTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentServiceLogs = e.target.dataset.service;
        loadLogs(currentServiceLogs);
    });
});

// Função: Carregar todos os serviços
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const services = await response.json();
        
        renderServices(services);
        loadLogs(currentServiceLogs);
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        servicesContainer.innerHTML = `<p style="color: red;">❌ Erro ao conectar ao Dashboard. Verifique se está rodando.</p>`;
    }
}

// Função: Renderizar cards dos serviços
function renderServices(services) {
    servicesContainer.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-header">
                <span class="service-name">${getServiceIcon(service.service_id)} ${service.name}</span>
                <span class="service-status ${service.running ? 'status-running' : 'status-stopped'}">
                    ${service.running ? '🟢 Ativo' : '🔴 Parado'}
                </span>
            </div>
            
            <div class="service-info">
                <strong>Porta:</strong> ${service.port}
            </div>
            
            <div class="service-info">
                <strong>URL:</strong> <a href="${service.url}/docs" target="_blank">${service.url}</a>
            </div>
            
            <div class="service-actions">
                ${service.running 
                    ? `
                        <button class="btn btn-danger btn-small" onclick="stopService('${service.service_id}')">⏹️ Parar</button>
                        <button class="btn btn-info btn-small" onclick="restartService('${service.service_id}')">🔄 Reiniciar</button>
                    `
                    : `
                        <button class="btn btn-success btn-small" onclick="startService('${service.service_id}')">▶️ Iniciar</button>
                    `
                }
                <button class="btn btn-info btn-small" onclick="openSwagger('${service.url}')">📖 Swagger</button>
            </div>
        </div>
    `).join('');
}

// Função: Obter ícone do serviço
function getServiceIcon(serviceId) {
    const icons = {
        prontuario: '📝',
        predictive: '🔮',
        teletherapy: '💬'
    };
    return icons[serviceId] || '⚙️';
}

// Função: Iniciar um serviço
async function startService(serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}/start`, {
            method: 'POST'
        });
        const result = await response.json();
        
        if (response.ok) {
            alert(`✅ ${result.message}`);
            loadServices();
        } else {
            alert(`❌ ${result.detail}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao iniciar serviço');
    }
}

// Função: Parar um serviço
async function stopService(serviceId) {
    if (!confirm('Tem certeza que deseja parar este serviço?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}/stop`, {
            method: 'POST'
        });
        const result = await response.json();
        
        if (response.ok) {
            alert(`✅ ${result.message}`);
            loadServices();
        } else {
            alert(`❌ ${result.detail}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao parar serviço');
    }
}

// Função: Reiniciar um serviço
async function restartService(serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}/restart`, {
            method: 'POST'
        });
        const result = await response.json();
        
        if (response.ok) {
            alert(`✅ ${result.message}`);
            loadServices();
        } else {
            alert(`❌ ${result.detail}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao reiniciar serviço');
    }
}

// Função: Iniciar todos os serviços
async function startAllServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/start-all`, {
            method: 'POST'
        });
        const result = await response.json();
        
        alert('✅ Iniciando todos os serviços...');
        loadServices();
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao iniciar serviços');
    }
}

// Função: Parar todos os serviços
async function stopAllServices() {
    if (!confirm('Tem certeza que deseja parar TODOS os serviços?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/stop-all`, {
            method: 'POST'
        });
        const result = await response.json();
        
        alert('✅ Parando todos os serviços...');
        loadServices();
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao parar serviços');
    }
}

// Função: Carregar logs
async function loadLogs(serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}/logs`);
        const data = await response.json();
        
        if (data.logs && data.logs.length > 0) {
            logText.textContent = data.logs.join('\n');
        } else {
            logText.textContent = `[${new Date().toLocaleTimeString()}] Sem logs disponíveis ainda...`;
        }
    } catch (error) {
        logText.textContent = '❌ Erro ao carregar logs';
        console.error('Erro:', error);
    }
}

// Função: Abrir Swagger
function openSwagger(url) {
    window.open(`${url}/docs`, '_blank');
}

// Inicializar
loadServices();

// Atualizar a cada 5 segundos
setInterval(() => {
    loadServices();
}, 5000);
