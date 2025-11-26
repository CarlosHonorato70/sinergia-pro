import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function AdminMasterTerapeutas() {
  const navigate = useNavigate();
  const [terapeutas, setTerapeutas] = useState([
    { id: 1, name: 'Dr. João Silva', specialization: 'Psicologia Clínica', patients: 5, rating: 4.8 },
    { id: 2, name: 'Dra. Maria Costa', specialization: 'Terapia Comportamental', patients: 3, rating: 4.9 },
    { id: 3, name: 'Dr. Carlos Santos', specialization: 'Psicanálise', patients: 7, rating: 4.7 },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>🏥 Gerenciar Terapeutas</h1>

        <Button variant="primary" size="lg" style={{ marginBottom: '24px' }}>
          + Adicionar Terapeuta
        </Button>

        <Card title={`Terapeutas Registrados (${terapeutas.length})`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {terapeutas.map((terapeuta) => (
              <div key={terapeuta.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>{terapeuta.name}</h3>
                <p style={{ color: '#666' }}>{terapeuta.specialization}</p>
                <p>👥 Pacientes: {terapeuta.patients}</p>
                <p>⭐ Avaliação: {terapeuta.rating}/5.0</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <Button variant="outline" size="sm">✏️ Editar</Button>
                  <Button variant="danger" size="sm">🗑️ Remover</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminMasterTerapeutas;