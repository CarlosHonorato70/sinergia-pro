import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function AdminMasterAprovacoes() {
  const navigate = useNavigate();
  const [pendentes, setPendentes] = useState([
    { id: 1, name: 'Dr. Ricardo Alves', email: 'ricardo@example.com', role: 'therapist', requestDate: '2025-11-20', documents: 'sim' },
    { id: 2, name: 'Ana Paula Oliveira', email: 'ana.paula@example.com', role: 'patient', requestDate: '2025-11-22', documents: 'não' },
    { id: 3, name: 'Dr. Fernando Costa', email: 'fernando@example.com', role: 'therapist', requestDate: '2025-11-23', documents: 'sim' },
  ]);

  const handleApprove = (id) => {
    alert('Usuário aprovado com sucesso!');
    setPendentes(pendentes.filter(p => p.id !== id));
  };

  const handleReject = (id) => {
    alert('Usuário rejeitado!');
    setPendentes(pendentes.filter(p => p.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>⏳ Aprovações Pendentes ({pendentes.length})</h1>

        <Card title="Solicitações de Aprovação">
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendentes.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 4px 0', color: '#666' }}>Email: {item.email}</p>
                    <p style={{ margin: '0 0 4px 0', color: '#666' }}>Função: {item.role}</p>
                    <p style={{ margin: '0 0 4px 0', color: '#666' }}>Solicitado em: {item.requestDate}</p>
                    <Badge variant={item.documents === 'sim' ? 'primary' : 'warning'}>
                      {item.documents === 'sim' ? '✅ Documentos Enviados' : '❌ Sem Documentos'}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <Button variant="primary" size="lg" onClick={() => handleApprove(item.id)}>
                      ✅ Aprovar
                    </Button>
                    <Button variant="danger" size="lg" onClick={() => handleReject(item.id)}>
                      ❌ Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminMasterAprovacoes;