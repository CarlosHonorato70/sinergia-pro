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

  const [deleteOptions, setDeleteOptions] = useState({
    users: false,
    sessions: false,
    reports: false,
    financial: false,
    logs: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword] = useState('admin123'); // Em produção, verificar no backend!
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleDeleteOptionChange = (option) => {
    setDeleteOptions({ ...deleteOptions, [option]: !deleteOptions[option] });
  };

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  const handleDeleteClick = () => {
    const selectedOptions = Object.entries(deleteOptions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selectedOptions.length === 0) {
      alert('⚠️ Selecione pelo menos um módulo para apagar!');
      return;
    }

    const confirmation = window.confirm(
      `⚠️ ATENÇÃO!\n\nVocê está prestes a apagar:\n${selectedOptions
        .map((opt) => {
          const labels = {
            users: 'Usuários',
            sessions: 'Sessões',
            reports: 'Relatórios',
            financial: 'Dados Financeiros',
            logs: 'Logs',
          };
          return `• ${labels[opt]}`;
        })
        .join('\n')}\n\nEsta ação é IRREVERSÍVEL!\n\nTem certeza?`
    );

    if (confirmation) {
      setShowPasswordModal(true);
    }
  };

  const handleCompleteReset = () => {
    const confirmation = window.confirm(
      '🔴 ATENÇÃO MÁXIMA!\n\nVocê está prestes a ZERAR TODO O BANCO DE DADOS!\n\nTodos os usuários, sessões, relatórios e dados serão APAGADOS PERMANENTEMENTE!\n\nEsta ação é IRREVERSÍVEL!\n\nTem certeza?'
    );

    if (confirmation) {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async () => {
    if (password !== adminPassword) {
      setError('❌ Senha incorreta!');
      return;
    }

    setError('');
    setShowPasswordModal(false);
    setPassword('');

    // Determinar qual endpoint chamar
    const selectedOptions = Object.entries(deleteOptions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    try {
      if (selectedOptions.includes('users') && selectedOptions.length === 1) {
        await fetch('http://localhost:8000/api/admin/database/users', { method: 'DELETE' });
        alert('✅ Usuários apagados com sucesso!');
      } else if (selectedOptions.includes('sessions') && selectedOptions.length === 1) {
        await fetch('http://localhost:8000/api/admin/database/sessions', { method: 'DELETE' });
        alert('✅ Sessões apagadas com sucesso!');
      } else if (selectedOptions.includes('reports') && selectedOptions.length === 1) {
        await fetch('http://localhost:8000/api/admin/database/reports', { method: 'DELETE' });
        alert('✅ Relatórios apagados com sucesso!');
      } else if (selectedOptions.includes('financial') && selectedOptions.length === 1) {
        await fetch('http://localhost:8000/api/admin/database/financial', { method: 'DELETE' });
        alert('✅ Dados financeiros apagados com sucesso!');
      } else if (selectedOptions.includes('logs') && selectedOptions.length === 1) {
        await fetch('http://localhost:8000/api/admin/database/logs', { method: 'DELETE' });
        alert('✅ Logs apagados com sucesso!');
      }

      // Resetar checkboxes
      setDeleteOptions({
        users: false,
        sessions: false,
        reports: false,
        financial: false,
        logs: false,
      });
    } catch (err) {
      alert('❌ Erro ao deletar: ' + err.message);
    }
  };

  const handleCompleteResetPassword = async () => {
    if (password !== adminPassword) {
      setError('❌ Senha incorreta!');
      return;
    }

    setError('');
    setShowPasswordModal(false);
    setPassword('');

    try {
      await fetch('http://localhost:8000/api/admin/database/complete', { method: 'DELETE' });
      alert('✅ Banco de dados zerado com sucesso! O sistema foi resetado!');
      setDeleteOptions({
        users: false,
        sessions: false,
        reports: false,
        financial: false,
        logs: false,
      });
    } catch (err) {
      alert('❌ Erro ao resetar: ' + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>⚙️ Configurações do Sistema</h1>

        {/* SEÇÃO 1: CONFIGURAÇÕES GERAIS */}
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

        {/* SEÇÃO 2: MANUTENÇÃO DO BANCO DE DADOS */}
        <Card title="🔧 Manutenção do Banco de Dados" style={{ marginTop: '30px', borderColor: '#ff6b6b' }}>
          <div style={{ backgroundColor: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid #ff6b6b' }}>
            <p style={{ margin: '0', color: '#856404', fontWeight: 'bold' }}>
              ⚠️ ATENÇÃO: Estas ações são IRREVERSÍVEIS!
            </p>
            <p style={{ margin: '8px 0 0 0', color: '#856404', fontSize: '12px' }}>
              Faça backup antes de prosseguir.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>Selecione o que deseja apagar:</p>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.users}
                  onChange={() => handleDeleteOptionChange('users')}
                />
                <span>👥 Apagar Usuários</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.sessions}
                  onChange={() => handleDeleteOptionChange('sessions')}
                />
                <span>📅 Apagar Sessões</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.reports}
                  onChange={() => handleDeleteOptionChange('reports')}
                />
                <span>📊 Apagar Relatórios</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.financial}
                  onChange={() => handleDeleteOptionChange('financial')}
                />
                <span>💰 Apagar Dados Financeiros</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.logs}
                  onChange={() => handleDeleteOptionChange('logs')}
                />
                <span>📝 Apagar Logs</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              variant="danger"
              size="lg"
              onClick={handleDeleteClick}
              style={{ backgroundColor: '#ff6b6b', color: 'white' }}
            >
              🗑️ Executar Limpeza Seletiva
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={handleCompleteReset}
              style={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 'bold' }}
            >
              🔴 ZERAR BANCO COMPLETO
            </Button>
          </div>
        </Card>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE SENHA */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>🔐 Confirmação de Segurança</h2>
            
            <p style={{ marginBottom: '16px', color: '#666' }}>
              Digite sua senha de administrador para confirmar:
            </p>

            <input
              type="password"
              placeholder="Senha do Admin Master"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '12px',
                boxSizing: 'border-box',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const selectedOptions = Object.values(deleteOptions).some(v => v);
                  if (selectedOptions) {
                    handlePasswordSubmit();
                  }
                }
              }}
            />

            {error && <p style={{ color: '#d32f2f', marginBottom: '12px', fontWeight: 'bold' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setError('');
                }}
                style={{ flex: 1 }}
              >
                ❌ Cancelar
              </Button>

              <Button
                variant="primary"
                onClick={handlePasswordSubmit}
                style={{ flex: 1, backgroundColor: '#d32f2f', color: 'white' }}
              >
                ✅ Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMasterConfiguracoes;