import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Chart } from '../components/Chart';
import { generateReport } from '../utils/exportPDF';

function TherapistAnalyticsPage() {
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [emailData, setEmailData] = useState({
    destinatario: '',
    assunto: 'Relatório Terapêutico',
    mensagem: '',
  });
  const [configData, setConfigData] = useState({
    frequencia: 'semanal',
    destinatarios: '',
    incluirGraficos: true,
    incluirAlertas: true,
  });

  const evolutionData = [
    { name: 'Semana 1', ansiedade: 45, depressao: 30, sono: 25 },
    { name: 'Semana 2', ansiedade: 52, depressao: 35, sono: 22 },
    { name: 'Semana 3', ansiedade: 48, depressao: 38, sono: 20 },
    { name: 'Semana 4', ansiedade: 65, depressao: 45, sono: 15 },
  ];

  const patientProgress = [
    { name: 'Ana Souza', value: 75 },
    { name: 'João Silva', value: 68 },
    { name: 'Maria Santos', value: 52 },
    { name: 'Pedro Costa', value: 81 },
  ];

  const stats = [
    { label: 'Total de Pacientes', value: 12, color: '#0066CC' },
    { label: 'Sessões Este Mês', value: 48, color: '#00AA44' },
    { label: 'Taxa de Melhora', value: '73%', color: '#F59E0B' },
    { label: 'Pacientes em Risco', value: 3, color: '#DC2626' },
  ];

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      const reportData = [
        { label: 'Total de Pacientes', value: '12' },
        { label: 'Sessões Este Mês', value: '48' },
        { label: 'Taxa de Melhora', value: '73%' },
        { label: 'Pacientes em Risco', value: '3' },
        { label: 'Score Médio Ansiedade', value: '52.5' },
        { label: 'Score Médio Depressão', value: '37' },
        { label: 'Qualidade Sono Média', value: '20.5' },
      ];
      
      generateReport('Relatório Geral', reportData);
      setExporting(false);
      alert('✅ PDF exportado com sucesso!');
    }, 1500);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailData.destinatario) {
      alert('❌ Digite um email válido!');
      return;
    }
    alert(`✅ Relatório enviado para ${emailData.destinatario}!`);
    setEmailData({ destinatario: '', assunto: 'Relatório Terapêutico', mensagem: '' });
    setShowEmailModal(false);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    alert(`✅ Configuração salva!\n📅 Frequência: ${configData.frequencia}\n📧 Destinatários: ${configData.destinatarios || 'Nenhum'}`);
    setShowConfigModal(false);
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Análise e Relatórios</h1>
            <p style={{ color: '#666' }}>Dashboard Analítico</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/therapist')}>
            ← Voltar
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Stats */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>{stat.label}</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <Card title="Evolução de Sintomas - Ana Souza">
            <Chart type="line" data={evolutionData} height={300} />
          </Card>

          <Card title="Progresso dos Pacientes">
            <Chart type="bar" data={patientProgress} height={300} />
          </Card>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? '⏳ Exportando...' : '📊 Exportar Relatório (PDF)'}
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => setShowEmailModal(true)}
          >
            📧 Enviar Relatório por Email
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setShowConfigModal(true)}
          >
            ⚙️ Configurar Relatórios
          </Button>
        </div>

        {/* Alerts */}
        <Card title="🚨 Alertas de Risco">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderLeft: '4px solid #DC2626', borderRadius: '4px' }}>
              <p style={{ fontWeight: 'bold', color: '#DC2626', marginBottom: '4px' }}>⚠️ Alto Risco - Maria Santos</p>
              <p style={{ fontSize: '14px', color: '#7f1d1d' }}>Scores aumentaram 45% na última semana. Recomenda-se intervenção imediata.</p>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderLeft: '4px solid #F59E0B', borderRadius: '4px' }}>
              <p style={{ fontWeight: 'bold', color: '#F59E0B', marginBottom: '4px' }}>⚠️ Risco Moderado - João Silva</p>
              <p style={{ fontSize: '14px', color: '#92400e' }}>Falta de entradas no diário há 3 dias. Enviar lembretes.</p>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderLeft: '4px solid #0284C7', borderRadius: '4px' }}>
              <p style={{ fontWeight: 'bold', color: '#0284C7', marginBottom: '4px' }}>ℹ️ Informação - Ana Souza</p>
              <p style={{ fontSize: '14px', color: '#0c4a6e' }}>Progredindo bem. Manter sessões regulares.</p>
            </div>
          </div>
        </Card>
      </main>

      {/* Modal - Enviar Email */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} title="Enviar Relatório por Email">
        <form onSubmit={handleSendEmail}>
          <Input
            label="Email do Destinatário"
            name="destinatario"
            type="email"
            value={emailData.destinatario}
            onChange={handleEmailChange}
            placeholder="destinatario@example.com"
            required
          />

          <Input
            label="Assunto"
            name="assunto"
            value={emailData.assunto}
            onChange={handleEmailChange}
            placeholder="Assunto do email"
            required
          />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              Mensagem
            </label>
            <textarea
              name="mensagem"
              value={emailData.mensagem}
              onChange={handleEmailChange}
              placeholder="Digite uma mensagem (opcional)"
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

      {/* Modal - Configurar Relatórios */}
      <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title="Configurar Relatórios Automáticos">
        <form onSubmit={handleSaveConfig}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              Frequência de Envio
            </label>
            <select
              name="frequencia"
              value={configData.frequencia}
              onChange={handleConfigChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            >
              <option value="diario">📅 Diário</option>
              <option value="semanal">📅 Semanal</option>
              <option value="mensal">📅 Mensal</option>
              <option value="nunca">❌ Nunca</option>
            </select>
          </div>

          <Input
            label="Emails dos Destinatários (separados por vírgula)"
            name="destinatarios"
            value={configData.destinatarios}
            onChange={handleConfigChange}
            placeholder="email1@example.com, email2@example.com"
          />

          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="incluirGraficos"
                checked={configData.incluirGraficos}
                onChange={handleConfigChange}
              />
              <span style={{ fontSize: '14px' }}>📊 Incluir gráficos</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="incluirAlertas"
                checked={configData.incluirAlertas}
                onChange={handleConfigChange}
              />
              <span style={{ fontSize: '14px' }}>🚨 Incluir alertas</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="submit" variant="primary" style={{ flex: 1 }}>
              ✓ Salvar Configuração
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowConfigModal(false)} style={{ flex: 1 }}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TherapistAnalyticsPage;
