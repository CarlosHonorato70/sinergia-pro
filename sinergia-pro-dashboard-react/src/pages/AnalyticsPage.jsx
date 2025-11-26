import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/therapist')}>
          ← Voltar
        </Button>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', marginTop: '20px' }}>
          <h1>📊 Analytics</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f0f4f8', borderRadius: '8px' }}>
              <h3>Total de Pacientes</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066CC' }}>3</p>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#f0f4f8', borderRadius: '8px' }}>
              <h3>Sessões este mês</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>12</p>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#f0f4f8', borderRadius: '8px' }}>
              <h3>Taxa de melhora</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>78%</p>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#f0f4f8', borderRadius: '8px' }}>
              <h3>Pacientes ativos</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;