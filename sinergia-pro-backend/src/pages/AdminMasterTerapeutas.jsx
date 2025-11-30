import React, { useState, useEffect } from 'react';

function AdminMasterTerapeutas() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const token = localStorage.getItem('token'); // Pega o token do localStorage
        if (!token) {
          setError('Token de autenticação não encontrado. Faça login novamente.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/therapists', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Falha ao carregar terapeutas');
        }

        const data = await response.json();
        setTherapists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) return <p>Carregando terapeutas...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro ao carregar terapeutas: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'auto' }}>
      <h2>Terapeutas Aprovados</h2>
      {therapists.length === 0 ? (
        <p>Nenhum terapeuta aprovado encontrado.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Especialidade</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Pacientes</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Avaliação</th>
            </tr>
          </thead>
          <tbody>
            {therapists.map((therapist) => (
              <tr key={therapist.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{therapist.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{therapist.specialty}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{therapist.patients ? therapist.patients.length : 0}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{therapist.rating ? `${therapist.rating}/5.0` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminMasterTerapeutas;