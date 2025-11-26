import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function AdminMaster() {
  const { user } = useContext(AuthContext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8000/api/admin";

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Carregar pendentes
  const loadPending = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pending-users`, axiosConfig);
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários pendentes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Aprovar
  const approveUser = async (userId, newRole) => {
    try {
      await axios.post(
        `${API_BASE}/approve-user/${userId}`,
        { new_role: newRole },
        axiosConfig
      );
      loadPending();
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
    }
  };

  // Rejeitar
  const rejectUser = async (userId) => {
    try {
      await axios.post(
        `${API_BASE}/reject-user/${userId}`,
        {},
        axiosConfig
      );
      loadPending();
    } catch (err) {
      console.error("Erro ao rejeitar usuário:", err);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Painel do Administrador Master</h1>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : pendingUsers.length === 0 ? (
        <p>Nenhum usuário pendente.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Role Atual</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {pendingUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      style={styles.btnApprove}
                      onClick={() => approveUser(u.id, "admin")}
                    >
                      Aprovar como Admin
                    </button>

                    <button
                      style={styles.btnApprove}
                      onClick={() => approveUser(u.id, "therapist")}
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
  );
}

const styles = {
  container: {
    padding: "40px",
  },
  tableContainer: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  btnApprove: {
    marginRight: "10px",
    padding: "6px 12px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnReject: {
    padding: "6px 12px",
    background: "#E53935",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminMaster;
