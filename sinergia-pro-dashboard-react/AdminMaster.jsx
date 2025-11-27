import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminMasterLayout from "../components/AdminMasterLayout"; // Importa o layout

function AdminMaster() {
  const { user } = useContext(AuthContext); // user é usado para verificar o role
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8000/api/admin";

  // Verifica o token no localStorage
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Redireciona se o usuário não for admin_master ou não estiver logado
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin_master') {
      navigate('/forbidden'); // Ou para uma página de acesso negado
    }
  }, [user, navigate]);

  // Carregar usuários pendentes
  const loadPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/pending-users`, axiosConfig);
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários pendentes:", err);
      setError("Não foi possível carregar os usuários pendentes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Aprovar usuário
  const approveUser = async (userId, newRole) => {
    try {
      await axios.post(
        `${API_BASE}/approve-user/${userId}`,
        { new_role: newRole },
        axiosConfig
      );
      loadPendingUsers(); // Recarrega a lista após a aprovação
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
      alert("Erro ao aprovar usuário. Verifique o console para mais detalhes.");
    }
  };

  // Rejeitar usuário
  const rejectUser = async (userId) => {
    try {
      await axios.post(
        `${API_BASE}/reject-user/${userId}`,
        {},
        axiosConfig
      );
      loadPendingUsers(); // Recarrega a lista após a rejeição
    } catch (err) {
      console.error("Erro ao rejeitar usuário:", err);
      alert("Erro ao rejeitar usuário. Verifique o console para mais detalhes.");
    }
  };

  // Carrega os usuários pendentes quando o componente é montado ou o usuário muda
  useEffect(() => {
    if (user && user.role === 'admin_master') {
      loadPendingUsers();
    }
  }, [user]); // Depende de 'user' para garantir que o role seja verificado

  return (
    <AdminMasterLayout>
      <div style={contentStyles.container}>
        <h2 style={contentStyles.title}>Aprovações de Usuários</h2>
        {error && <p style={contentStyles.errorMessage}>{error}</p>}
        {loading ? (
          <p>Carregando usuários...</p>
        ) : pendingUsers.length === 0 ? (
          <p>Nenhum usuário pendente para aprovação.</p>
        ) : (
          <div style={contentStyles.tableContainer}>
            <table style={contentStyles.table}>
              <thead>
                <tr>
                  <th style={contentStyles.th}>ID</th>
                  <th style={contentStyles.th}>Nome</th>
                  <th style={contentStyles.th}>E-mail</th>
                  <th style={contentStyles.th}>Role Solicitado</th>
                  <th style={contentStyles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((u) => (
                  <tr key={u.id} style={contentStyles.tr}>
                    <td style={contentStyles.td}>{u.id}</td>
                    <td style={contentStyles.td}>{u.name}</td>
                    <td style={contentStyles.td}>{u.email}</td>
                    <td style={contentStyles.td}>{u.role}</td>
                    <td style={contentStyles.td}>
                      <button
                        style={contentStyles.btnApprove}
                        onClick={() => approveUser(u.id, "admin")}
                      >
                        Aprovar como Admin
                      </button>
                      <button
                        style={contentStyles.btnApprove}
                        onClick={() => approveUser(u.id, "therapist")}
                      >
                        Aprovar como Terapeuta
                      </button>
                      <button
                        style={contentStyles.btnReject}
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

const contentStyles = {
  container: {
    padding: "20px",
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    minHeight: 'calc(100vh - 120px)', // Ajusta a altura para preencher o espaço
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  errorMessage: {
    color: '#dc3545',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: 'left',
    padding: '12px 15px',
    backgroundColor: '#f2f2f2',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
    color: '#555',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    color: '#333',
  },
  tr: {
    ':hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  btnApprove: {
    marginRight: "10px",
    padding: "8px 15px",
    background: "#28a745", // Verde mais escuro
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: '14px',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#218838',
    },
  },
  btnReject: {
    padding: "8px 15px",
    background: "#dc3545", // Vermelho
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: '14px',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#c82333',
    },
  },
};

export default AdminMaster;