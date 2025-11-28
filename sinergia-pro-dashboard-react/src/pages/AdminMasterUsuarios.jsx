import React, { useEffect, useState } from 'react';
import { graphqlClient, QUERY_USERS, MUTATION_UPDATE_USER, MUTATION_APPROVE_USER, MUTATION_REJECT_USER, MUTATION_DELETE_USER } from '../graphqlClient';

export default function AdminMasterUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await graphqlClient.request(QUERY_USERS);
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const abrirEdicao = (user) => {
    setEditingUser(user.id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const cancelarEdicao = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: '' });
  };

  const salvarEdicao = async () => {
    try {
      await graphqlClient.request(MUTATION_UPDATE_USER, {
        id: editingUser,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      await carregarUsuarios();
      cancelarEdicao();
      alert('✅ Usuário atualizado com sucesso!');
    } catch (err) {
      alert('❌ Erro: ' + err.message);
    }
  };

  const aprovarUsuario = async (userId) => {
    try {
      await graphqlClient.request(MUTATION_APPROVE_USER, { id: userId });
      await carregarUsuarios();
      alert('✅ Usuário aprovado com sucesso!');
    } catch (err) {
      alert('❌ Erro: ' + err.message);
    }
  };

  const rejeitarUsuario = async (userId) => {
    if (!window.confirm('Tem certeza que deseja rejeitar este usuário?')) return;
    try {
      await graphqlClient.request(MUTATION_REJECT_USER, { id: userId });
      await carregarUsuarios();
      alert('✅ Usuário rejeitado!');
    } catch (err) {
      alert('❌ Erro: ' + err.message);
    }
  };

  const deletarUsuario = async (userId, userName) => {
    if (!window.confirm(`Tem certeza que deseja deletar o usuário "${userName}"? Esta ação não pode ser desfeita!`)) return;

    try {
      await graphqlClient.request(MUTATION_DELETE_USER, { id: userId });
      await carregarUsuarios();
      alert('✅ Usuário deletado com sucesso!');
    } catch (err) {
      alert('❌ Erro: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '30px' }}>⏳ Carregando...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>👥 Gerenciamento de Usuários</h1>

      {error && (
        <div style={{ padding: '15px', background: '#ffcccc', borderRadius: '5px', marginBottom: '20px', color: 'red' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={carregarUsuarios} style={buttonStyle}>🔄 Recarregar</button>
      </div>

      {editingUser && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2>Editar Usuário</h2>
            <div style={formGroupStyle}>
              <label>Nome:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label>Role:</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={inputStyle}
              >
                <option value="admin_master">Admin Master</option>
                <option value="admin">Admin</option>
                <option value="therapist">Terapeuta</option>
                <option value="patient">Paciente</option>
              </select>
            </div>
            <div style={buttonGroupStyle}>
              <button onClick={salvarEdicao} style={saveButtonStyle}>💾 Salvar</button>
              <button onClick={cancelarEdicao} style={cancelButtonStyle}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <p style={{ fontSize: '16px', color: '#666' }}>Nenhum usuário encontrado.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={headerStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usr) => (
              <tr key={usr.id} style={rowStyle}>
                <td style={tdStyle}>{usr.id}</td>
                <td style={tdStyle}>{usr.email}</td>
                <td style={tdStyle}>{usr.name}</td>
                <td style={tdStyle}>{usr.role}</td>
                <td style={tdStyle}>
                  {usr.isApproved ? '✅ Aprovado' : '⏳ Pendente'}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => abrirEdicao(usr)}
                      style={editButtonStyle}
                      title="Editar usuário"
                    >
                      ✏️ Editar
                    </button>
                    {!usr.isApproved && (
                      <>
                        <button
                          onClick={() => aprovarUsuario(usr.id)}
                          style={approveButtonStyle}
                          title="Aprovar usuário"
                        >
                          ✅ Aprovar
                        </button>
                        <button
                          onClick={() => rejeitarUsuario(usr.id)}
                          style={rejectButtonStyle}
                          title="Rejeitar usuário"
                        >
                          ❌ Rejeitar
                        </button>
                      </>
                    )}
                    {usr.id !== 1 && (
                      <button
                        onClick={() => deletarUsuario(usr.id, usr.name)}
                        style={deleteButtonStyle}
                        title="Deletar usuário"
                      >
                        🗑️ Deletar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: '20px', color: '#666' }}>Total: {users.length} usuários</p>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderRadius: '5px',
  overflow: 'hidden',
};

const headerStyle = {
  background: '#2c3e50',
  color: 'white',
  fontWeight: 'bold',
};

const thStyle = {
  padding: '15px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
};

const tdStyle = {
  padding: '12px 15px',
  borderBottom: '1px solid #eee',
};

const rowStyle = {
  transition: 'background-color 0.2s',
};

const editButtonStyle = {
  padding: '6px 10px',
  background: '#ffc107',
  color: '#333',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
};

const approveButtonStyle = {
  padding: '6px 10px',
  background: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
};

const rejectButtonStyle = {
  padding: '6px 10px',
  background: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
};

const deleteButtonStyle = {
  padding: '6px 10px',
  background: '#ff6b6b',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  maxWidth: '400px',
  width: '90%',
};

const formGroupStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '14px',
  marginTop: '5px',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
};

const saveButtonStyle = {
  flex: 1,
  padding: '10px',
  background: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const cancelButtonStyle = {
  flex: 1,
  padding: '10px',
  background: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};
