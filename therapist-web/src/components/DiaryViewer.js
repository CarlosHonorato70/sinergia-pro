import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './DiaryViewer.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Dados Mock do Diário Terapêutico (Simulando dados do app mobile)
const MOCK_DIARY_ENTRIES = [
  { date: '15/11', humor: 6, emotions: ['Calma', 'Alegria'], event: 'Passeio no parque', thoughts: 'Dia tranquilo.' },
  { date: '16/11', humor: 4, emotions: ['Tristeza', 'Frustração'], event: 'Discussão com colega', thoughts: 'Não consigo me expressar.' },
  { date: '17/11', humor: 7, emotions: ['Alegria'], event: 'Sessão de terapia', thoughts: 'Me senti compreendido.' },
  { date: '18/11', humor: 3, emotions: ['Ansiedade', 'Raiva'], event: 'Prazo apertado no trabalho', thoughts: 'Vou falhar, não sou bom o suficiente.' },
  { date: '19/11', humor: 5, emotions: ['Ansiedade'], event: 'Consegui dormir 7h', thoughts: 'Pelo menos o sono melhorou.' },
  { date: '20/11', humor: 8, emotions: ['Calma', 'Alegria'], event: 'Dia de folga', thoughts: 'É bom ter tempo para mim.' },
];

// Dados Mock da Análise Preditiva (Simulando chamada à API)
const MOCK_PREDICTIVE_ANALYSIS = {
  pattern_analysis: "Padrão de humor baixo e ansioso consistentemente associado a dias de trabalho e pressão por prazos. O humor melhora significativamente nos dias de folga.",
  trigger_identification: ["Pressão por prazos", "Conflitos interpessoais no trabalho", "Pensamentos de baixa autoeficácia"],
  recidivism_risk: "Moderado. Justificativa: Aumento da ansiedade nas últimas 48h, diretamente ligada a gatilhos de trabalho.",
  suggested_interventions: ["Revisar a técnica de reestruturação cognitiva para lidar com a pressão no trabalho.", "Explorar a assertividade em conflitos interpessoais."],
};

function DiaryViewer({ patientId }) {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const chartData = {
    labels: MOCK_DIARY_ENTRIES.map(entry => entry.date),
    datasets: [
      {
        label: 'Nível de Humor (1-10)',
        data: MOCK_DIARY_ENTRIES.map(entry => entry.humor),
        borderColor: '#9C27B0',
        backgroundColor: 'rgba(156, 39, 176, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Evolução do Nível de Humor' },
    },
    scales: {
      y: { min: 1, max: 10, title: { display: true, text: 'Humor' } },
    },
  };

  const handleRunAnalysis = async () => {
    setIsLoadingAnalysis(true);
    // Simulação de chamada à API de Análise Preditiva (POST /api/v1/predictive/analyze)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAnalysisResult(MOCK_PREDICTIVE_ANALYSIS);
    setIsLoadingAnalysis(false);
  };

  return (
    <div className="diary-viewer">
      <h3>Diário Terapêutico Interativo</h3>
      
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="analysis-section">
        <button onClick={handleRunAnalysis} disabled={isLoadingAnalysis} className="analysis-btn">
          {isLoadingAnalysis ? 'Analisando...' : 'Rodar Análise Preditiva'}
        </button>

        {analysisResult && (
          <div className="analysis-result">
            <h4>Resultado da Análise Preditiva:</h4>
            <p><strong>Risco de Recaída:</strong> <span className={`risk-${analysisResult.recidivism_risk.toLowerCase()}`}>{analysisResult.recidivism_risk}</span></p>
            <p><strong>Padrões Identificados:</strong> {analysisResult.pattern_analysis}</p>
            <p><strong>Gatilhos:</strong> {analysisResult.trigger_identification.join(', ')}</p>
            <p><strong>Sugestões de Intervenção:</strong></p>
            <ul>
              {analysisResult.suggested_interventions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="diary-entries">
        <h4>Entradas Recentes do Diário:</h4>
        {MOCK_DIARY_ENTRIES.slice().reverse().map((entry, index) => (
          <div key={index} className="diary-entry-card">
            <p><strong>{entry.date}</strong> - Humor: {entry.humor}/10</p>
            <p>Emoções: {entry.emotions.join(', ')}</p>
            <details>
              <summary>Ver Detalhes</summary>
              <p><strong>Evento:</strong> {entry.event}</p>
              <p><strong>Pensamentos:</strong> {entry.thoughts}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiaryViewer;
