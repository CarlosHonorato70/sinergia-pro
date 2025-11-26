import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

function TeletherapyPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/therapist')}>
          ← Voltar
        </Button>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', marginTop: '20px' }}>
          <h1>Teleterapia - Paciente #{patientId}</h1>
          <div style={{ backgroundColor: '#000', width: '100%', height: '400px', borderRadius: '8px', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <p>Vídeo da teleterapia apareceria aqui</p>
          </div>
          <Button variant="primary">Iniciar Sessão</Button>
        </div>
      </div>
    </div>
  );
}

export default TeletherapyPage;