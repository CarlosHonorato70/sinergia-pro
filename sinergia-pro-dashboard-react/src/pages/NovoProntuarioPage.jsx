import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

function NovoProntuarioPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paciente: '',
    data: '',
    notas: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Prontuário criado com sucesso!');
    navigate('/therapist');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/therapist')}>
          ← Voltar
        </Button>
        
        <h1 style={{ marginTop: '20px' }}>Novo Prontuário</h1>
        
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', marginTop: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Paciente</label>
            <input
              type="text"
              name="paciente"
              value={formData.paciente}
              onChange={handleChange}
              placeholder="Nome do paciente"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Anotações da sessão..."
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', height: '150px' }}
            />
          </div>

          <Button variant="primary" type="submit">
            Salvar Prontuário
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NovoProntuarioPage;