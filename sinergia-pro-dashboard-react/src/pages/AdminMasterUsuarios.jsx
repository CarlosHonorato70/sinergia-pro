import React, { useEffect, useState } from 'react';
import { graphqlClient, QUERY_USERS } from '../graphqlClient';

export default function AdminMasterUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await graphqlClient.request(QUERY_USERS);
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Usuários do Sistema</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Nome</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Papel</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Aprovado</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.role}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                {user.isApproved ? 'Sim' : 'Não'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total: {users.length} usuários</p>
    </div>
  );
}
