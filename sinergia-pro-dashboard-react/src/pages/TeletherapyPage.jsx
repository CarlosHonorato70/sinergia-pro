import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function TeletherapyPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [callActive, setCallActive] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let interval;
    if (callActive) {
      interval = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallActive(false);
    alert('Sessão encerrada. Anotações podem ser salvas.');
  };

  const handleSaveNotes = () => {
    if (!notes.trim()) {
      alert('❌ Digite alguma anotação antes de salvar!');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('✅ Anotações salvas com sucesso!');
      setNotes('');
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Teleterapia</h1>
            <p style={{ color: '#666' }}>Sessão Online</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/therapist')}>
            ← Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Video Area */}
          <Card>
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '8px',
              padding: '40px 20px',
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              {callActive ? (
                <>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📹</div>
                  <p style={{ fontSize: '18px', marginBottom: '8px' }}>Ana Souza</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00AA44', marginBottom: '24px' }}>
                    {formatTime(callTime)}
                  </p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📞</div>
                  <p style={{ fontSize: '18px' }}>Pronto para iniciar a sessão</p>
                </>
              )}
            </div>

            {/* Controls */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!callActive ? (
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => setCallActive(true)}
                  style={{ minWidth: '150px' }}
                >
                  ✓ Iniciar Sessão
                </Button>
              ) : (
                <>
                  <Button 
                    variant={micOn ? 'primary' : 'danger'}
                    size="lg"
                    onClick={() => setMicOn(!micOn)}
                    title={micOn ? 'Desligar Microfone' : 'Ligar Microfone'}
                  >
                    {micOn ? '🎤' : '🔇'}
                  </Button>
                  <Button 
                    variant={cameraOn ? 'primary' : 'danger'}
                    size="lg"
                    onClick={() => setCameraOn(!cameraOn)}
                    title={cameraOn ? 'Desligar Câmera' : 'Ligar Câmera'}
                  >
                    {cameraOn ? '📷' : '📵'}
                  </Button>
                  <Button 
                    variant="danger"
                    size="lg"
                    onClick={handleEndCall}
                  >
                    ✕ Encerrar
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Info */}
            <Card title="Informações da Sessão">
              <div style={{ fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Paciente:</strong> Ana Souza
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Horário:</strong> {new Date().toLocaleTimeString('pt-BR')}
                </p>
                <div style={{ marginTop: '12px' }}>
                  <Badge variant={callActive ? 'primary' : 'warning'}>
                    {callActive ? 'EM ANDAMENTO' : 'PENDENTE'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card title="Anotações">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Digite suas anotações da sessão..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  minHeight: '150px',
                  resize: 'vertical',
                }}
              />
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleSaveNotes}
                disabled={saving}
                style={{ width: '100%', marginTop: '12px' }}
              >
                {saving ? '⏳ Salvando...' : '💾 Salvar Anotações'}
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TeletherapyPage;
