import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

function PredictiveAnalysisPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    email: '',
    especialidade: 'psiquiatria',
  });

  useEffect(() => {
    setTimeout(() => {
      setData({
        patientName: 'Ana Souza',
        riskLevel: 'médio',
        riskScore: 65,
        trends: [
          { periodo: 'Semana 1', ansiedade: 45, depressao: 30, sono: 25 },
          { periodo: 'Semana 2', ansiedade: 52, depressao: 35, sono: 22 },
          { periodo: 'Semana 3', ansiedade: 48, depressao: 38, sono: 20 },
          { periodo: 'Semana 4', ansiedade: 65, depressao: 45, sono: 15 },
        ],
        predictedTrend: 'ascendente',
        recommendations: [
          'Aumentar frequência de sessões para 2x por semana',
          'Implementar técnicas de mindfulness diárias',
          'Avaliar necessidade de medicação psiquiátrica',
          'Monitorar padrões de sono com maior atenção',
        ],
        aiInsights: 'A análise preditiva indica uma tendência de piora nos próximos 15 dias. Recomenda-se intervenção imediata com aumento na intensidade do tratamento.',
      });
      setLoading(false);
    }, 1500);
  }, []);

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailData.email) {
      alert('❌ Digite um email válido!');
      return;
    }
    alert(`✅ Relatório enviado para ${emailData.email}!`);
    setEmailData({ email: '', especialidade: 'psiquiatria' });
    setShowEmailModal(false);
  };

  const handleSaveReport = () => {
    alert('✅ Relatório salvo com sucesso!');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ fontSize: '24px' }}>Carregando análise...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Análise Preditiva</h1>
            <p style={{ color: '#666' }}>Inteligência Artificial para Saúde Mental</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/therapist')}>
            ← Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Risk Level */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Nível de Risco</p>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#DC2626', marginBottom: '8px' }}>
                {data.riskScore}%
              </div>
              <Badge variant={data.riskLevel === 'alto' ? 'danger' : data.riskLevel === 'médio' ? 'warning' : 'primary'}>
                {data.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Tendência Prevista</p>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {data.predictedTrend === 'ascendente' ? '📈' : '📉'}
              </div>
              <p style={{ fontWeight: 'bold' }}>{data.predictedTrend}</p>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Paciente</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.patientName}</p>
            </div>
          </Card>
        </div>

        {/* Trends */}
        <Card title="Evolução dos Sintomas (últimas 4 semanas)">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Período</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold' }}>Ansiedade</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold' }}>Depressão</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold' }}>Qualidade Sono</th>
                </tr>
              </thead>
              <tbody>
                {data.trends.map((trend, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{trend.periodo}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                      <div style={{ 
                        display: 'inline-block',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {trend.ansiedade}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                      <div style={{ 
                        display: 'inline-block',
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {trend.depressao}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                      <div style={{ 
                        display: 'inline-block',
                        backgroundColor: '#dbeafe',
                        color: '#0284c7',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {trend.sono}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Insights */}
        <Card title="Insights da IA">
          <div style={{
            backgroundColor: '#f0f4f8',
            border: '2px solid #0066CC',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#1f2937', lineHeight: '1.6' }}>
              🤖 {data.aiInsights}
            </p>
          </div>

          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Recomendações Imediatas:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {data.recommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '10px', fontSize: '14px', color: '#374151' }}>
                ✓ {rec}
              </li>
            ))}
          </ul>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleSaveReport}
            style={{ flex: 1, minWidth: '200px' }}
          >
            💾 Salvar Relatório
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setShowEmailModal(true)}
            style={{ flex: 1, minWidth: '200px' }}
          >
            📧 Enviar para Psiquiatra
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/therapist')}
            style={{ flex: 1, minWidth: '200px' }}
          >
            ← Voltar
          </Button>
        </div>
      </main>

      {/* Modal - Enviar para Psiquiatra */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} title="Enviar Relatório para Psiquiatra">
        <form onSubmit={handleSendEmail}>
          <Input
            label="Email do Psiquiatra"
            name="email"
            type="email"
            value={emailData.email}
            onChange={handleEmailChange}
            placeholder="psiquiatra@example.com"
            required
          />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              Especialidade
            </label>
            <select
              name="especialidade"
              value={emailData.especialidade}
              onChange={handleEmailChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            >
              <option value="psiquiatria">👨‍⚕️ Psiquiatria</option>
              <option value="neurologia">🧠 Neurologia</option>
              <option value="clinica_geral">👨‍⚕️ Clínica Geral</option>
              <option value="outro">📋 Outro</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="submit" variant="primary" style={{ flex: 1 }}>
              ✓ Enviar
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowEmailModal(false)} style={{ flex: 1 }}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PredictiveAnalysisPage;
