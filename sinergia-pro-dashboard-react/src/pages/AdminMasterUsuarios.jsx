import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function AdminMasterUsuarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/admin/all-users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      if (!response.ok) throw new Error("Erro ao carregar usuarios");
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar usuarios: " + err.message);
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
    setFormData({ name: "", email: "", role: "" });
  };

  const salvarEdicao = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/admin/update-user/${editingUser}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erro ao atualizar usuario");
      await carregarUsuarios();
      cancelarEdicao();
      alert("Usuario atualizado com sucesso!");
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  const deletarUsuario = async (userId, userName) => {
    if (
      !window.confirm(
        `Tem certeza que deseja deletar o usuario "${userName}"? Esta acao nao pode ser desfeita!`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      if (!response.ok) throw new Error("Erro ao deletar usuario");
      await carregarUsuarios();
      alert("Usuario deletado com sucesso!");
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  if (loading)
    return <div style={{ padding: "30px" }}>Carregando...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/admin/master")}
        style={{
          padding: "10px 20px",
          background: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Voltar
      </button>

      <h1 style={{ marginTop: 0 }}>Gerenciamento de Usuarios</h1>

      {error && (
        <div
          style={{
            padding: "15px",
            background: "#ffcccc",
            borderRadius: "5px",
            marginBottom: "20px",
            color: "red",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={carregarUsuarios}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Recarregar
        </button>
      </div>

      {editingUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h2>Editar Usuario</h2>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Nome:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Email:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Funcao:
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              >
                <option value="admin_master">Admin Master</option>
                <option value="admin">Admin</option>
                <option value="therapist">Terapeuta</option>
                <option value="patient">Paciente</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={salvarEdicao}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Salvar
              </button>
              <button
                onClick={cancelarEdicao}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          overflow: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Nome</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Funcao</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: "1px solid #dee2e6",
                }}
              >
                <td style={{ padding: "12px" }}>{user.id}</td>
                <td style={{ padding: "12px" }}>{user.email}</td>
                <td style={{ padding: "12px" }}>{user.name}</td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        user.role === "admin_master"
                          ? "#dc3545"
                          : user.role === "admin"
                          ? "#fd7e14"
                          : user.role === "therapist"
                          ? "#0d6efd"
                          : "#6c757d",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {user.role === "admin_master"
                      ? "Admin Master"
                      : user.role === "admin"
                      ? "Admin"
                      : user.role === "therapist"
                      ? "Terapeuta"
                      : "Paciente"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: user.is_approved ? "#28a745" : "#ffc107",
                      color: user.is_approved ? "white" : "#000",
                      fontSize: "12px",
                    }}
                  >
                    {user.is_approved ? "Aprovado" : "Pendente"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => abrirEdicao(user)}
                    style={{
                      padding: "6px 12px",
                      background: "#0d6efd",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "5px",
                      fontSize: "12px",
                    }}
                  >
                    Editar
                  </button>
                  {user.role !== "admin_master" && (
                    <button
                      onClick={() => deletarUsuario(user.id, user.name)}
                      style={{
                        padding: "6px 12px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Deletar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: "20px", color: "#666" }}>
        Total: {users.length} usuario{users.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}