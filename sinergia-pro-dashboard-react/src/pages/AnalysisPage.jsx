import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

function AnalysisPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/therapist')}>
          ← Voltar
        </Button>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', marginTop: '20px' }}>
          <h1>Análise Preditiva - Paciente #{patientId}</h1>
          <p>Análise e previsões serão carregadas aqui...</p>
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0f4f8', borderRadius: '4px' }}>
            <h3>Insights:</h3>
            <ul>
              <li>Tendência de melhora: 85%</li>
              <li>Risco identificado: Baixo</li>
              <li>Recomendação: Continuar tratamento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;