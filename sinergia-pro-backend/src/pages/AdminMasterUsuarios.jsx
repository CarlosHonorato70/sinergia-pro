import React, { useState, useEffect } from 'react';

function AdminMasterUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Pega o token do localStorage
        if (!token) {
          setError('Token de autenticação não encontrado. Faça login novamente.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/admin/all-users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Falha ao carregar usuários');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro ao carregar usuários: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'auto' }}>
      <h2>Todos os Usuários</h2>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Função (Role)</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.role}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.isApproved ? 'Aprovado' : 'Pendente'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminMasterUsuarios;