import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';

function TherapyDiaryPage() {
  const navigate = useNavigate();
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2025-11-22',
      mood: '😊',
      title: 'Dia produtivo',
      content: 'Consegui completar todos os meus objetivos hoje. Sinto-me melhor.',
      emotion: 'feliz',
      tags: ['produtividade', 'autoconfiança'],
    },
    {
      id: 2,
      date: '2025-11-21',
      mood: '😐',
      title: 'Dia normal',
      content: 'Nada de especial aconteceu. Rotina comum.',
      emotion: 'neutro',
      tags: ['rotina'],
    },
    {
      id: 3,
      date: '2025-11-20',
      mood: '😔',
      title: 'Ansiedade voltou',
      content: 'Tive um episódio de ansiedade no trabalho.',
      emotion: 'ansioso',
      tags: ['ansiedade', 'trabalho'],
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '😊',
    tags: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    const newEntry = {
      id: entries.length + 1,
      date: new Date().toISOString().split('T')[0],
      mood: formData.mood,
      title: formData.title,
      content: formData.content,
      emotion: formData.mood === '😊' ? 'feliz' : formData.mood === '😐' ? 'neutro' : 'ansioso',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    setEntries([newEntry, ...entries]);
    setFormData({ title: '', content: '', mood: '😊', tags: '' });
    setShowNewEntryModal(false);
    alert('Entrada registrada com sucesso!');
  };

  const emotionColors = {
    feliz: '#00AA44',
    neutro: '#0066CC',
    ansioso: '#DC2626',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Diário Terapêutico</h1>
            <p style={{ color: '#666' }}>Registre seus sentimentos e progresso</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary" size="lg" onClick={() => setShowNewEntryModal(true)}>
              + Nova Entrada
            </Button>
            <Button variant="outline" onClick={() => navigate('/patient')}>
              ← Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Stats */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total de Entradas</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066CC' }}>{entries.length}</p>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Esta Semana</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00AA44' }}>3</p>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Humor Atual</p>
              <p style={{ fontSize: '32px' }}>😊</p>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Tendência</p>
              <p style={{ fontSize: '32px' }}>📈 Melhorando</p>
            </div>
          </Card>
        </div>

        {/* Entries Timeline */}
        <Card title="Minhas Entradas">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {entries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  borderLeft: `4px solid ${emotionColors[entry.emotion]}`,
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {entry.mood} {entry.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant={entry.emotion === 'feliz' ? 'primary' : entry.emotion === 'ansioso' ? 'danger' : 'warning'}>
                    {entry.emotion}
                  </Badge>
                </div>

                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px', lineHeight: '1.5' }}>
                  {entry.content}
                </p>

                {entry.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {entry.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: '#dbeafe',
                          color: '#0284c7',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Modal de Nova Entrada */}
      <Modal isOpen={showNewEntryModal} onClose={() => setShowNewEntryModal(false)} title="Nova Entrada no Diário">
        <form onSubmit={handleAddEntry}>
          <Input
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Como você se sente hoje?"
            required
          />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              Humor
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['😊', '😐', '😔'].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mood }))}
                  style={{
                    fontSize: '32px',
                    backgroundColor: formData.mood === mood ? '#dbeafe' : 'white',
                    border: formData.mood === mood ? '2px solid #0284c7' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              O que você está sentindo?
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Descreva seus sentimentos, pensamentos e experiências..."
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
                minHeight: '120px',
              }}
            />
          </div>

          <Input
            label="Tags (separadas por vírgula)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Ex: ansiedade, trabalho, família"
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="submit" variant="primary" style={{ flex: 1 }}>
              ✓ Registrar Entrada
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowNewEntryModal(false)} style={{ flex: 1 }}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TherapyDiaryPage;
