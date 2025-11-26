import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function AdminMasterConfiguracoes() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    appName: 'Sinérgia Pro',
    maintenanceMode: false,
    emailNotifications: true,
    backupDaily: true,
    maxUploadSize: 50,
  });

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>⚙️ Configurações do Sistema</h1>

        <Card title="Configurações Gerais">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Nome da Aplicação</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
                <span style={{ fontWeight: 'bold' }}>Modo de Manutenção</span>
              </label>
              <p style={{ color: '#666', fontSize: '12px' }}>Quando ativado, apenas admins podem acessar</p>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span style={{ fontWeight: 'bold' }}>Notificações por Email</span>
              </label>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.backupDaily}
                  onChange={(e) => handleChange('backupDaily', e.target.checked)}
                />
                <span style={{ fontWeight: 'bold' }}>Backup Diário Automático</span>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tamanho Máximo de Upload (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleChange('maxUploadSize', e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={handleSave} style={{ marginTop: '20px' }}>
            💾 Salvar Configurações
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default AdminMasterConfiguracoes;