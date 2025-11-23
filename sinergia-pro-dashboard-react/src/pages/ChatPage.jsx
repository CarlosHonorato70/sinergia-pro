import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'terapeuta', text: 'Olá! Como você está se sentindo hoje?', timestamp: '09:30' },
    { id: 2, sender: 'paciente', text: 'Oi! Estou melhor que ontem', timestamp: '09:35' },
    { id: 3, sender: 'terapeuta', text: 'Que bom ouvir! Quer conversar sobre o que mudou?', timestamp: '09:36' },
    { id: 4, sender: 'paciente', text: 'Sim, acho que as técnicas que você ensinou estão ajudando', timestamp: '09:40' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'paciente',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simula resposta do terapeuta
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: 'terapeuta',
        text: 'Que legal! Continue praticando essas técnicas. 😊',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC' }}>Chat com Terapeuta</h1>
            <p style={{ color: '#666' }}>Converse entre sessões</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/patient')}>
            ← Voltar
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px', flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'paciente' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: msg.sender === 'paciente' ? '#0066CC' : '#e5e7eb',
                    color: msg.sender === 'paciente' ? 'white' : '#1f2937',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px' }}>{msg.text}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.7 }}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              📤 Enviar
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default ChatPage;
