import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MasterUsuariosPage() {
  const { user } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await fetch("http://localhost:8000/api/admin/all-users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro ${response.status}: ${errorData.detail || response.statusText}`);
      }

      const data = await response.json();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar usuários: " + err.message);
      console.error("Erro completo:", err);
    } finally {
      setLoading(false);
    }
  };

  const aprovarUsuario = async (userId, novaRole) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8000/api/admin/approve-user/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ new_role: novaRole })
      });

      if (!response.ok) throw new Error("Erro ao aprovar usuário");

      await carregarUsuarios();
      alert("? Usuário aprovado com sucesso!");
    } catch (err) {
      alert("? Erro: " + err.message);
    }
  };

  const rejeitarUsuario = async (userId) => {
    if (!window.confirm("Tem certeza que deseja rejeitar este usuário?")) return;

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8000/api/admin/reject-user/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Erro ao rejeitar usuário");

      await carregarUsuarios();
      alert("? Usuário rejeitado!");
    } catch (err) {
      alert("? Erro: " + err.message);
    }
  };

  const atualizarRole = async (userId, novaRole) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8000/api/admin/update-role/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ new_role: novaRole })
      });

      if (!response.ok) throw new Error("Erro ao atualizar role");

      await carregarUsuarios();
      alert("? Role atualizada com sucesso!");
    } catch (err) {
      alert("? Erro: " + err.message);
    }
  };

  const deletarUsuario = async (userId, userName) => {
    if (!window.confirm(`Tem certeza que deseja deletar o usuário "${userName}"? Esta ação não pode ser desfeita!`)) return;

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:8000/api/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erro ao deletar usuário");
      }

      await carregarUsuarios();
      alert("? Usuário deletado com sucesso!");
    } catch (err) {
      alert("? Erro: " + err.message);
    }
  };

  if (loading) return <div style={{ padding: "30px" }}>? Carregando...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>?? Gerenciamento de Usuários</h1>

      {error && <div style={{ padding: "15px", background: "#ffcccc", borderRadius: "5px", marginBottom: "20px", color: "red" }}>{error}</div>}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={carregarUsuarios} style={buttonStyle}>?? Recarregar</button>
      </div>

      {usuarios.length === 0 ? (
        <p style={{ fontSize: "16px", color: "#666" }}>Nenhum usuário pendente encontrado.</p>
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
            {usuarios.map((usr) => (
              <tr key={usr.id} style={rowStyle}>
                <td style={tdStyle}>{usr.id}</td>
                <td style={tdStyle}>{usr.email}</td>
                <td style={tdStyle}>{usr.name}</td>
                <td style={tdStyle}>{usr.role}</td>
                <td style={tdStyle}>
                  {usr.is_approved ? "? Aprovado" : "? Pendente"}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {!usr.is_approved && (
                      <>
                        <select 
                          onChange={(e) => aprovarUsuario(usr.id, e.target.value)} 
                          style={selectActionStyle}
                          defaultValue=""
                        >
                          <option value="">Aprovar como...</option>
                          <option value="admin">Admin</option>
                          <option value="therapist">Terapeuta</option>
                          <option value="patient">Paciente</option>
                        </select>
                        <button 
                          onClick={() => rejeitarUsuario(usr.id)}
                          style={rejectButtonStyle}
                        >
                          ? Rejeitar
                        </button>
                      </>
                    )}
                    {usr.is_approved && usr.role !== "rejected" && (
                      <>
                        <select 
                          onChange={(e) => atualizarRole(usr.id, e.target.value)} 
                          style={selectActionStyle}
                          defaultValue={usr.role}
                        >
                          <option value={usr.role}>{usr.role}</option>
                          <option value="admin">Admin</option>
                          <option value="therapist">Terapeuta</option>
                          <option value="patient">Paciente</option>
                        </select>
                        {usr.id !== 1 && (
                          <button 
                            onClick={() => deletarUsuario(usr.id, usr.name)}
                            style={deleteButtonStyle}
                          >
                            ??? Deletar
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderRadius: "5px",
  overflow: "hidden"
};

const headerStyle = {
  background: "#2c3e50",
  color: "white",
  fontWeight: "bold"
};

const thStyle = {
  padding: "15px",
  textAlign: "left",
  borderBottom: "2px solid #ddd"
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #eee"
};

const rowStyle = {
  transition: "background-color 0.2s"
};

const selectActionStyle = {
  padding: "6px 10px",
  borderRadius: "3px",
  border: "1px solid #ddd",
  fontSize: "12px",
  cursor: "pointer"
};

const rejectButtonStyle = {
  padding: "6px 10px",
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold"
};

const deleteButtonStyle = {
  padding: "6px 10px",
  background: "#ff6b6b",
  color: "white",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold"
};

export default MasterUsuariosPage;
