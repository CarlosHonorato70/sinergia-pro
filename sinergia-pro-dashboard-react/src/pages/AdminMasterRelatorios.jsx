import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function AdminMasterRelatorios() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>📈 Relatórios do Sistema</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <Card title="Crescimento de Usuários">
            <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066CC', margin: 0 }}>↗️ 15%</p>
              <p style={{ color: '#666' }}>em relação ao mês anterior</p>
            </div>
          </Card>

          <Card title="Taxa de Retencão">
            <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>92%</p>
              <p style={{ color: '#666' }}>usuários ativos</p>
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          <Card title="Relatório de Sessões">
            <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '4px' }}>
              <p>Total de sessões este mês: 245</p>
              <p>Sessões concluídas: 238</p>
              <p>Sessões canceladas: 7</p>
              <p>Taxa de conclusão: 97%</p>
            </div>
          </Card>

          <Card title="Relatório de Satisfação">
            <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '4px' }}>
              <p>Avaliação média dos terapeutas: 4.8/5.0</p>
              <p>Avaliação média dos pacientes: 4.6/5.0</p>
              <p>Satisfação geral do sistema: 91%</p>
            </div>
          </Card>

          <Button variant="secondary" size="lg" style={{ marginTop: '16px' }}>
            📥 Exportar Relatório em PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminMasterRelatorios;