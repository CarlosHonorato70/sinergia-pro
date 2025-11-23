import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';

function ProntuarioPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prontuario, setProntuario] = useState(null);
  const [formData, setFormData] = useState({
    queixa: '',
    historico: '',
    sintomas: '',
    medicacoes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateProntuario = async () => {
    setLoading(true);
    try {
      // Simula chamada à API de geração de prontuário
      setTimeout(() => {
        setProntuario({
          id: 1,
          paciente: 'Ana Souza',
          dataAtendimento: new Date().toLocaleDateString('pt-BR'),
          queixa: formData.queixa,
          historico: formData.historico,
          sintomas: formData.sintomas,
          medicacoes: formData.medicacoes,
          diagnostico: 'Transtorno de Ansiedade Generalizada (TAG)',
          recomendacoes: [
            'Terapia Cognitivo-Comportamental (TCC)',
            'Técnicas de relaxamento',
            'Atividade física regular',
            'Acompanhamento psiquiátrico',
          ],
          iaAnalysis: 'A análise da IA identificou padrões de comportamento ansioso com picos de intensidade nos períodos vespertinos. Recomenda-se acompanhamento intensivo.',
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao gerar prontuário:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Prontuário do Paciente</h1>
            <p style={{ color: '#666' }}>Geração automática com IA</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/therapist')}>
            ← Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Form */}
          <Card title="Informações da Consulta">
            <Input
              label="Queixa Principal"
              name="queixa"
              value={formData.queixa}
              onChange={handleChange}
              placeholder="Descreva a queixa principal"
            />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
                Histórico
              </label>
              <textarea
                name="historico"
                value={formData.historico}
                onChange={handleChange}
                placeholder="Histórico clínico do paciente"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  minHeight: '100px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
                Sintomas Observados
              </label>
              <textarea
                name="sintomas"
                value={formData.sintomas}
                onChange={handleChange}
                placeholder="Descreva os sintomas"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  minHeight: '100px',
                }}
              />
            </div>

            <Input
              label="Medicações em Uso"
              name="medicacoes"
              value={formData.medicacoes}
              onChange={handleChange}
              placeholder="Lista de medicações"
            />

            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerateProntuario}
              disabled={loading || !formData.queixa}
              style={{ width: '100%' }}
            >
              {loading ? 'Gerando...' : '🤖 Gerar Prontuário com IA'}
            </Button>
          </Card>

          {/* Result */}
          <div>
            {loading && <Loading />}
            {prontuario && (
              <Card title="Prontuário Gerado">
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Data:</strong> {prontuario.dataAtendimento}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Paciente:</strong> {prontuario.paciente}
                  </p>
                </div>

                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Diagnóstico</h4>
                  <p style={{ color: '#00AA44', fontWeight: 'bold' }}>{prontuario.diagnostico}</p>
                </div>

                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Análise da IA</h4>
                  <p style={{ fontSize: '14px', color: '#4b5563', backgroundColor: '#f0f4f8', padding: '12px', borderRadius: '6px' }}>
                    {prontuario.iaAnalysis}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Recomendações</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {prontuario.recomendacoes.map((rec, idx) => (
                      <li key={idx} style={{ marginBottom: '6px', fontSize: '14px' }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="secondary" size="lg" style={{ width: '100%' }}>
                  💾 Salvar Prontuário
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProntuarioPage;
