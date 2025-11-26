import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function AdminMasterDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>📊 Dashboard do Sistema</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <Card title="Total de Usuários">
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066CC', margin: 0 }}>156</p>
          </Card>
          <Card title="Terapeutas Ativos">
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>32</p>
          </Card>
          <Card title="Pacientes Registrados">
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>89</p>
          </Card>
          <Card title="Pendentes de Aprovação">
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>5</p>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Card title="Estatísticas Recentes">
            <div style={{ backgroundColor: '#f0f4f8', padding: '16px', borderRadius: '4px' }}>
              <p>Novos usuários (últimos 30 dias): 12</p>
              <p>Sessões realizadas: 245</p>
              <p>Taxa de satisfação: 92%</p>
            </div>
          </Card>

          <Card title="Alertas do Sistema">
            <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '4px', borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: '8px 0', fontWeight: 'bold' }}>⚠️ 3 usuários inativos por 30 dias</p>
              <p style={{ margin: '8px 0', fontWeight: 'bold' }}>⚠️ Backup do sistema em 2 horas</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminMasterDashboard;