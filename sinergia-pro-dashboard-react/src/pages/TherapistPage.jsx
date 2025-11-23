import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { PatientModal } from '../components/PatientModal';

function TherapistPage() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [patients, setPatients] = useState([
    { id: 1, name: 'Ana Souza', lastSession: '2025-11-19', nextSession: '2025-11-21', status: 'ativo' },
    { id: 2, name: 'João Silva', lastSession: '2025-11-18', nextSession: '2025-11-24', status: 'ativo' },
    { id: 3, name: 'Maria Santos', lastSession: '2025-11-17', nextSession: '2025-11-26', status: 'parado' },
  ]);

  const [notifications] = useState([
    { id: 1, type: 'sessão', message: 'Sessão com Ana Souza em 1 hora', timestamp: '09:00', read: false },
    { id: 2, type: 'diário', message: 'João Silva não registrou diário há 3 dias', timestamp: '08:30', read: false },
    { id: 3, type: 'risco', message: 'Alerta: Maria Santos com risco elevado', timestamp: '07:00', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleAddPatient = (formData) => {
    const newPatient = {
      id: patients.length + 1,
      name: formData.name,
      lastSession: 'N/A',
      nextSession: 'A agendar',
      status: 'ativo',
    };
    setPatients([...patients, newPatient]);
    setShowPatientModal(false);
    alert('Paciente adicionado com sucesso!');
  };

  const handleViewProntuario = (patientId) => {
    navigate(`/prontuario/${patientId}`);
  };

  const handleViewAnalysis = (patientId) => {
    navigate(`/analise-preditiva/${patientId}`);
  };

  const handleStartTeletherapy = (patientId) => {
    navigate(`/teleterapia/${patientId}`);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'sessão': return '📅';
      case 'diário': return '📔';
      case 'risco': return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Voltar
            </Button>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Meus Pacientes</h1>
              <p style={{ color: '#666' }}>Gerenciamento de Pacientes</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#DC2626',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  width: '320px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 100,
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Notificações</h3>
                  </div>

                  <div>
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: notif.read ? 'white' : '#f0f4f8',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ fontSize: '18px' }}>{getNotificationIcon(notif.type)}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '500' }}>
                              {notif.message}
                            </p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>{notif.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button variant="secondary" size="lg" onClick={() => navigate('/analytics')}>
              📊 Analytics
            </Button>
            <Button variant="danger" size="lg" onClick={() => { handleLogout(); navigate('/login'); }}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
          <Button variant="primary" size="lg" onClick={() => setShowPatientModal(true)}>
            + Novo Paciente
          </Button>
          <Button variant="secondary" size="lg">
            📄 Novo Prontuário
          </Button>
        </div>

        <Card title={`Lista de Pacientes (${patients.length})`}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Última Sessão</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Próxima Sessão</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{patient.name}</td>
                    <td style={{ padding: '12px 16px' }}>{patient.lastSession}</td>
                    <td style={{ padding: '12px 16px' }}>{patient.nextSession}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={patient.status === 'ativo' ? 'primary' : 'warning'}>
                        {patient.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="Prontuário"
                          onClick={() => handleViewProntuario(patient.id)}
                        >
                          📋
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="Análise Preditiva"
                          onClick={() => handleViewAnalysis(patient.id)}
                        >
                          🧠
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="Teleterapia"
                          onClick={() => handleStartTeletherapy(patient.id)}
                        >
                          📹
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <PatientModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSubmit={handleAddPatient}
      />
    </div>
  );
}

export default TherapistPage;
