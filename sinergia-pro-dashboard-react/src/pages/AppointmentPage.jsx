import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

function AppointmentPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([
    { id: 1, date: '2025-11-28', time: '10:00', therapist: 'Dr. Carlos Silva', status: 'agendada', paciente: 'João Paciente', notas: 'Discussão sobre ansiedade' },
    { id: 2, date: '2025-12-05', time: '14:00', therapist: 'Dr. Carlos Silva', status: 'agendada', paciente: 'João Paciente', notas: 'Avaliação de progresso' },
    { id: 3, date: '2025-11-21', time: '16:00', therapist: 'Dr. Carlos Silva', status: 'concluída', paciente: 'João Paciente', notas: 'Sessão produtiva. Paciente relata melhora.' },
  ]);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    therapist: 'Dr. Carlos Silva',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: appointments.length + 1,
      date: formData.date,
      time: formData.time,
      therapist: formData.therapist,
      status: 'agendada',
      paciente: 'João Paciente',
      notas: '',
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({ date: '', time: '', therapist: 'Dr. Carlos Silva' });
    setShowModal(false);
    alert('✅ Sessão agendada com sucesso!');
  };

  const handleViewDetails = (apt) => {
    setSelectedAppointment(apt);
    setShowDetailsModal(true);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta sessão?')) {
      setAppointments(appointments.filter(apt => apt.id !== id));
      alert('✅ Sessão cancelada!');
    }
  };

  const handleReschedule = (id) => {
    alert('📅 Função de remarcação abrirá em breve. Por enquanto, cancele e agende novamente.');
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'agendada');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Agendamento de Sessões</h1>
            <p style={{ color: '#666' }}>Organize suas consultas</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
              + Agendar Sessão
            </Button>
            <Button variant="outline" onClick={() => navigate('/patient')}>
              ← Voltar
            </Button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Stats */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Próximas Sessões</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066CC' }}>{upcomingAppointments.length}</p>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Agendadas</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00AA44' }}>{appointments.length}</p>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Próxima Sessão</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {upcomingAppointments.length > 0 
                  ? new Date(upcomingAppointments[0].date).toLocaleDateString('pt-BR')
                  : 'Sem agendamento'
                }
              </p>
            </div>
          </Card>
        </div>

        {/* Upcoming */}
        <Card title="Próximas Sessões">
          {upcomingAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>📅 {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>{apt.therapist}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Badge variant="primary">Agendada</Badge>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleViewDetails(apt)}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>Nenhuma sessão agendada</p>
          )}
        </Card>

        {/* All Appointments */}
        <Card title="Histórico de Agendamentos" style={{ marginTop: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Data</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Hora</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Terapeuta</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{new Date(apt.date).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px' }}>{apt.time}</td>
                    <td style={{ padding: '12px 16px' }}>{apt.therapist}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={apt.status === 'concluída' ? 'primary' : 'warning'}>
                        {apt.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(apt)}
                        >
                          📝 Ver
                        </Button>
                        {apt.status === 'agendada' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReschedule(apt.id)}
                            >
                              📅 Remarcar
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleCancelAppointment(apt.id)}
                            >
                              ✕ Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Modal - Agendar */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Agendar Nova Sessão">
        <form onSubmit={handleSchedule}>
          <Input
            label="Data"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            label="Hora"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              Terapeuta
            </label>
            <select
              name="therapist"
              value={formData.therapist}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            >
              <option>Dr. Carlos Silva</option>
              <option>Dra. Maria Santos</option>
              <option>Dr. João Costa</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="submit" variant="primary" style={{ flex: 1 }}>
              ✓ Agendar
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal - Detalhes da Sessão */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Detalhes da Sessão">
        {selectedAppointment && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Data</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {new Date(selectedAppointment.date).toLocaleDateString('pt-BR')} às {selectedAppointment.time}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Terapeuta</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedAppointment.therapist}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Status</p>
              <Badge variant={selectedAppointment.status === 'concluída' ? 'primary' : 'warning'}>
                {selectedAppointment.status}
              </Badge>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Notas</p>
              <p style={{ fontSize: '14px', color: '#374151' }}>
                {selectedAppointment.notas || 'Sem notas'}
              </p>
            </div>

            <Button 
              variant="primary" 
              onClick={() => setShowDetailsModal(false)}
              style={{ width: '100%' }}
            >
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AppointmentPage;
