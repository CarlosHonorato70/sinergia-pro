import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

function AssessmentsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState([
    { id: 1, test: 'PHQ-9 (Depressão)', score: 8, date: '2025-11-14', level: 'leve', status: '✓', interpretation: 'Sintomas leves de depressão. Manter acompanhamento regular.' },
    { id: 2, test: 'GAD-7 (Ansiedade)', score: 14, date: '2025-11-14', level: 'moderada', status: '✓', interpretation: 'Ansiedade moderada. Recomenda-se intensificar técnicas de relaxamento.' },
    { id: 3, test: 'PSQI (Sono)', score: 10, date: '2025-11-09', level: 'prejudicial', status: '✓', interpretation: 'Qualidade do sono prejudicada. Considerar intervenção para higiene do sono.' },
  ]);

  const tests = [
    {
      id: 'phq9',
      name: 'PHQ-9 (Patient Health Questionnaire)',
      description: 'Avalia sintomas de depressão',
      duration: '3-5 min',
      icon: '😢',
      questions: [
        'Pouco interesse ou prazer em fazer as coisas?',
        'Se sentir para baixo, deprimido ou desesperado?',
        'Dificuldade em adormecer, permanecer adormecido ou dormir demais?',
        'Se sentir cansado ou com pouca energia?',
        'Pouco apetite ou comendo demais?',
        'Se sentir mal consigo mesmo ou achar que é um fracasso?',
        'Dificuldade em se concentrar?',
        'Movimentar-se ou falar tão lentamente que outros notam?',
        'Pensar que seria melhor estar morto?',
      ],
    },
    {
      id: 'gad7',
      name: 'GAD-7 (Generalized Anxiety Disorder)',
      description: 'Avalia sintomas de ansiedade generalizada',
      duration: '2-3 min',
      icon: '😰',
      questions: [
        'Sentir-se nervoso, ansioso ou no fio da navalha?',
        'Incapaz de parar ou controlar a preocupação?',
        'Se preocupar demais com várias coisas?',
        'Dificuldade em relaxar?',
        'Se sentir tão inquieto que é difícil ficar sentado?',
        'Ficar facilmente irritado ou com raiva?',
        'Sentir medo como se algo horrível fosse acontecer?',
      ],
    },
    {
      id: 'psqi',
      name: 'PSQI (Pittsburgh Sleep Quality Index)',
      description: 'Avalia qualidade do sono',
      duration: '5-10 min',
      icon: '😴',
      questions: [
        'Durante o mês passado, qual era sua hora habitual de dormir?',
        'Durante o mês passado, quanto tempo demorou para adormecer?',
        'Durante o mês passado, quanto tempo você dormiu à noite?',
        'Durante o mês passado, que porcentagem do tempo dormiu bem?',
        'Durante o mês passado, teve dificuldade em respirar?',
        'Durante o mês passado, roncou alto?',
        'Durante o mês passado, teve períodos de parada respiratória?',
      ],
    },
  ];

  const handleStartTest = (test) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowModal(true);
  };

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleTestComplete(newAnswers);
    }
  };

  const handleTestComplete = (finalAnswers) => {
    const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
    const newResult = {
      id: results.length + 1,
      test: selectedTest.name,
      score: totalScore,
      date: new Date().toISOString().split('T')[0],
      level: totalScore < 5 ? 'mínima' : totalScore < 10 ? 'leve' : totalScore < 15 ? 'moderada' : 'severa',
      status: '✓',
      interpretation: `Score: ${totalScore}. ${totalScore < 5 ? 'Sintomas mínimos.' : totalScore < 10 ? 'Sintomas leves. Manter acompanhamento.' : totalScore < 15 ? 'Sintomas moderados. Intensificar tratamento.' : 'Sintomas severos. Intervenção urgente necessária.'}`,
    };
    setResults([newResult, ...results]);
    setShowModal(false);
    alert(`✅ Questionário completo! Seu score: ${totalScore}`);
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Questionários e Escalas</h1>
            <p style={{ color: '#666' }}>Avaliações clínicas padronizadas</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/patient')}>
            ← Voltar
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Tests Available */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {tests.map((test) => (
            <Card key={test.id} style={{ cursor: 'pointer' }}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>{test.icon}</p>
                <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>{test.name}</h3>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>{test.description}</p>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>⏱️ {test.duration}</p>
                <Button variant="primary" size="sm" onClick={() => handleStartTest(test)} style={{ width: '100%' }}>
                  Começar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Results */}
        <Card title="Histórico de Resultados">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Questionário</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold' }}>Score</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold' }}>Nível</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Data</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{result.test}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 'bold' }}>{result.score}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                      <Badge variant={result.level === 'severa' ? 'danger' : result.level === 'moderada' ? 'warning' : 'primary'}>
                        {result.level}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{new Date(result.date).toLocaleDateString('pt-BR')}</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewResult(result)}
                      >
                        📊 Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Modal - Teste */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedTest?.name}>
        {selectedTest && (
          <div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              Pergunta {currentQuestion + 1} de {selectedTest.questions.length}
            </p>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>
                {selectedTest.questions[currentQuestion]}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Button variant="outline" onClick={() => handleAnswer(0)}>Nunca (0)</Button>
              <Button variant="outline" onClick={() => handleAnswer(1)}>Raramente (1)</Button>
              <Button variant="outline" onClick={() => handleAnswer(2)}>Às vezes (2)</Button>
              <Button variant="outline" onClick={() => handleAnswer(3)}>Frequentemente (3)</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal - Resultado Detalhado */}
      <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)} title="Detalhes do Resultado">
        {selectedResult && (
          <div>
            <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Teste</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>{selectedResult.test}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Score</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066CC' }}>{selectedResult.score}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Nível</p>
                  <Badge variant={selectedResult.level === 'severa' ? 'danger' : selectedResult.level === 'moderada' ? 'warning' : 'primary'}>
                    {selectedResult.level}
                  </Badge>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: 'bold' }}>Data</p>
              <p style={{ fontSize: '14px' }}>{new Date(selectedResult.date).toLocaleDateString('pt-BR')}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: 'bold' }}>Interpretação</p>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                {selectedResult.interpretation}
              </p>
            </div>

            <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold', marginBottom: '4px' }}>💡 Recomendação</p>
              <p style={{ fontSize: '13px', color: '#0c4a6e', margin: 0 }}>
                Converse com seu terapeuta sobre esses resultados para planejar as próximas etapas do tratamento.
              </p>
            </div>

            <Button 
              variant="primary" 
              onClick={() => setShowResultModal(false)}
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

export default AssessmentsPage;
