import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function PatientPage() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const sessions = [
    { id: 1, date: '2025-11-21', therapist: 'Dr. Carlos Silva', status: 'concluída', notes: 'Ótima sessão' },
    { id: 2, date: '2025-11-28', therapist: 'Dr. Carlos Silva', status: 'agendada', notes: '' },
  ];

  const handleStartSession = () => {
    alert('📞 Iniciando videochamada com Dr. Carlos Silva...\n\nEm produção, isso integraria com Zoom, Google Meet ou similar.');
    // Em um cenário real, isso abriria uma integração com Zoom/Google Meet
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Voltar
            </Button>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Meu Acompanhamento</h1>
              <p style={{ color: '#666' }}>Área do Paciente</p>
            </div>
          </div>
          <Button variant="danger" size="lg" onClick={() => { handleLogout(); navigate('/login'); }}>
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Quick Actions */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/diary')}
            style={{ padding: '20px', height: 'auto', textAlign: 'center', whiteSpace: 'normal' }}
          >
            📔<br />Diário Terapêutico
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/appointments')}
            style={{ padding: '20px', height: 'auto', textAlign: 'center', whiteSpace: 'normal' }}
          >
            📅<br />Agendamento
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/chat')}
            style={{ padding: '20px', height: 'auto', textAlign: 'center', whiteSpace: 'normal' }}
          >
            💬<br />Chat
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/assessments')}
            style={{ padding: '20px', height: 'auto', textAlign: 'center', whiteSpace: 'normal' }}
          >
            📊<br />Questionários
          </Button>
        </div>

        {/* Info Cards */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card title="Próxima Sessão">
            <div style={{ fontSize: '14px' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Data:</strong> 28 de Novembro, 2025
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Horário:</strong> 10:00 AM
              </p>
              <p style={{ marginBottom: '12px' }}>
                <strong>Terapeuta:</strong> Dr. Carlos Silva
              </p>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleStartSession}
                style={{ width: '100%' }}
              >
                📞 Iniciar Sessão
              </Button>
            </div>
          </Card>

          <Card title="Seu Progresso">
            <div style={{ fontSize: '14px' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Sessões Concluídas:</strong> 5
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Taxa de Assiduidade:</strong> 100%
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Status:</strong> <Badge variant="primary">Em Progresso</Badge>
              </p>
            </div>
          </Card>
        </div>

        {/* Sessions */}
        <Card title="Histórico de Sessões">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Data</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Terapeuta</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Notas</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{new Date(session.date).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px' }}>{session.therapist}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={session.status === 'concluída' ? 'primary' : 'warning'}>
                        {session.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>
                      {session.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default PatientPage;
