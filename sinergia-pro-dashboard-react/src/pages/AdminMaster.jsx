import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminMasterLayout from '../components/AdminMasterLayout';

function AdminMaster() {
  const { user } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8000/api/admin';
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const loadPending = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pending-users`, axiosConfig);
      setPendingUsers(res.data);
    } catch (err) {
      console.error('Erro ao carregar usuários pendentes:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId, newRole) => {
    try {
      await axios.post(
        `${API_BASE}/approve-user/${userId}`,
        { new_role: newRole },
        axiosConfig
      );
      loadPending();
    } catch (err) {
      console.error('Erro ao aprovar usuário:', err);
    }
  };

  const rejectUser = async (userId) => {
    try {
      await axios.post(`${API_BASE}/reject-user/${userId}`, {}, axiosConfig);
      loadPending();
    } catch (err) {
      console.error('Erro ao rejeitar usuário:', err);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <AdminMasterLayout>
      <div style={styles.container}>
        {loading ? (
          <p>Carregando usuários...</p>
        ) : pendingUsers.length === 0 ? (
          <p>Nenhum usuário pendente.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>E-mail</th>
                  <th style={styles.th}>Role Atual</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {pendingUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.id}</td>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.role}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.btnApprove}
                        onClick={() => approveUser(u.id, 'admin')}
                      >
                        Aprovar como Admin
                      </button>

                      <button
                        style={styles.btnApprove}
                        onClick={() => approveUser(u.id, 'therapist')}
                      >
                        Aprovar como Terapeuta
                      </button>

                      <button
                        style={styles.btnReject}
                        onClick={() => rejectUser(u.id)}
                      >
                        Rejeitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminMasterLayout>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  tableContainer: {
    marginTop: '20px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  th: {
    padding: '12px',
    backgroundColor: '#0056b3',
    color: 'white',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #004494',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  btnApprove: {
    marginRight: '10px',
    padding: '6px 12px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  btnReject: {
    padding: '6px 12px',
    background: '#E53935',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
};

export default AdminMaster;