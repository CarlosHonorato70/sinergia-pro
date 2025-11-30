import React, { useState, useEffect } from 'react';

function AdminMasterPacientes() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token'); // Pega o token do localStorage
        if (!token) {
          setError('Token de autenticação não encontrado. Faça login novamente.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/patients', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Falha ao carregar pacientes');
        }

        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Carregando pacientes...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro ao carregar pacientes: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'auto' }}>
      <h2>Pacientes Aprovados</h2>
      {patients.length === 0 ? (
        <p>Nenhum paciente aprovado encontrado.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Terapeuta</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{patient.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{patient.therapist ? patient.therapist.name : 'N/A'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{patient.status}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(patient.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminMasterPacientes;