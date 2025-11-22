import React, { useState } from 'react';
import './MarketingAgent.css';

function MarketingAgent() {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Instagram Post');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Empático e informativo');
  const [expertise, setExpertise] = useState('TCC e Mindfulness');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateContent = async () => {
    if (!topic || !audience) {
      alert('Por favor, preencha o Tópico e o Público-Alvo.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Simulação de chamada à API de Marketing (POST /api/v1/marketing/generate_content)
    // Em um ambiente real, a URL seria http://localhost:8004/api/v1/marketing/generate_content
    const mockResponse = {
      title: `Como a ${topic} pode ajudar ${audience}`,
      content: `Olá! Como especialista em ${expertise}, preparei um conteúdo especial sobre ${topic}. O tom é ${tone}. Este é um post de ${format} focado em ${audience}. [Conteúdo gerado pela IA aqui...]`,
      hashtags: [`#${topic.replace(/\s/g, '')}`, `#${audience.replace(/\s/g, '')}`, `#${expertise.replace(/\s/g, '')}`, '#SinergiaPro'],
      call_to_action: "Agende sua consulta e comece sua jornada de transformação!",
    };

    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));

    setResult(mockResponse);
    setIsLoading(false);
  };

  return (
    <div className="marketing-agent-card">
      <h3>Agente de Marketing 2.0 (IA)</h3>
      <div className="form-group">
        <label>Tópico Central:</label>
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Lidando com a procrastinação" />
      </div>
      <div className="form-group">
        <label>Formato:</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option>Instagram Post</option>
          <option>Blog Article</option>
          <option>Email Newsletter</option>
        </select>
      </div>
      <div className="form-group">
        <label>Público-Alvo:</label>
        <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex: Pais de adolescentes" />
      </div>
      <div className="form-group">
        <label>Tom de Voz:</label>
        <input type="text" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Ex: Inspirador e direto" />
      </div>
      <div className="form-group">
        <label>Sua Expertise:</label>
        <input type="text" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="Ex: Terapia Familiar e Sistêmica" />
      </div>

      <button onClick={handleGenerateContent} disabled={isLoading} className="generate-btn">
        {isLoading ? 'Gerando Conteúdo...' : 'Gerar Conteúdo com IA'}
      </button>

      {result && (
        <div className="marketing-result">
          <h4>Conteúdo Gerado:</h4>
          <p><strong>Título:</strong> {result.title}</p>
          <p><strong>Corpo:</strong> {result.content}</p>
          <p><strong>Hashtags:</strong> {result.hashtags.join(' ')}</p>
          <p><strong>Chamada para Ação:</strong> {result.call_to_action}</p>
        </div>
      )}
    </div>
  );
}

export default MarketingAgent;
