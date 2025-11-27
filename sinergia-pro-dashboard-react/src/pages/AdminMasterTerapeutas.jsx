import React, { useEffect, useState } from 'react';
import { graphqlClient, QUERY_THERAPISTS } from '../graphqlClient';

export default function AdminMasterTerapeutas() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const data = await graphqlClient.request(QUERY_THERAPISTS);
        setTherapists(data.approvedTherapists);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Terapeutas Aprovados</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Nome</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Especialidade</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map((therapist) => (
            <tr key={therapist.id}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{therapist.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{therapist.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{therapist.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{therapist.specialty || 'N/A'}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                {therapist.isApproved ? '✅ Aprovado' : '❌ Pendente'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total: {therapists.length} terapeutas aprovados</p>
    </div>
  );
}
