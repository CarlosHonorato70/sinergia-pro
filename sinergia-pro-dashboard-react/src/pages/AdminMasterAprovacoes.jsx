import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminMasterAprovacoes() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');
  const API_BASE = 'http://localhost:8000';

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/admin/pending-users`, axiosConfig);
      setPendingUsers(response.data || []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar usuários pendentes:', err);
      setError('Erro ao carregar usuários pendentes');
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userRole) => {
    try {
      await axios.post(
        `${API_BASE}/api/admin/approve-user/${userId}`,
        { new_role: userRole },
        axiosConfig
      );
      setSuccessMessage('Usuário aprovado com sucesso!');
      loadPendingUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao aprovar usuário:', err);
      setError('Erro ao aprovar usuário');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `${API_BASE}/api/admin/reject-user/${userId}`,
        {},
        axiosConfig
      );
      setSuccessMessage('Usuário rejeitado com sucesso!');
      loadPendingUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao rejeitar usuário:', err);
      setError('Erro ao rejeitar usuário');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <p>Carregando usuários pendentes...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#333' }}>✅ Aprovações de Usuários</h1>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px' }}>
            {successMessage}
          </div>
        )}

        {pendingUsers.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', fontSize: '18px' }}>✓ Nenhum usuário pendente de aprovação!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #f59e0b',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    {user.name}
                  </p>
                  <p style={{ margin: '0 0 4px 0', color: '#666' }}>
                    📧 Email: {user.email}
                  </p>
                  <p style={{ margin: '0', color: '#666' }}>
                    👤 Tipo: <span style={{ fontWeight: 'bold', color: '#0066CC' }}>{user.role}</span>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleApprove(user.id, user.role)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    ✓ Aprovar
                  </button>

                  <button
                    onClick={() => handleReject(user.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                  >
                    ✗ Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMasterAprovacoes;