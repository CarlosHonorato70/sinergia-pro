import React, { useState, useEffect } from "react";
import axios from "axios";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/admin/all-users?timestamp=" + Date.now(), {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
      setUsers(response.data);
    } catch (err) {
      setError("Erro ao carregar usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      alert("Usuarios criado com sucesso!");
      setFormData({ name: "", email: "", password: "", role: "patient" });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert("Erro ao criar usuario: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
      alert("Usuario deletado com sucesso!");
    } catch (err) {
      alert("Erro ao deletar usuario");
    }
  };

  const usersFiltrados = users.filter(u =>
    u.name.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  };

  const thStyle = {
    background: "#2c3e50",
    color: "white",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold"
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd"
  };

  const formStyle = {
    background: "#f5f5f5",
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "20px",
    maxWidth: "500px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    boxSizing: "border-box"
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Usuarios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            background: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {showForm ? "Cancelar" : "+ Criar Usuario"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {showForm && (
        <div style={formStyle}>
          <h2>Criar novo usuario</h2>
          <form onSubmit={handleCreateUser}>
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={inputStyle}
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={inputStyle}
            >
              <option value="patient">Paciente</option>
              <option value="therapist">Terapeuta</option>
              <option value="master">Master</option>
            </select>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%"
              }}
            >
              Criar Usuario
            </button>
          </form>
        </div>
      )}

      <input
        type="text"
        placeholder="Pesquisar por nome ou email..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ddd"
        }}
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <p>Total de usuarios: {usersFiltrados.length}</p>
          <table style={tableStyle}>
            <thead>
              <tr style={thStyle}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {usersFiltrados.map((u) => (
                <tr key={u.id} style={tdStyle} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                  <td style={tdStyle}>{u.id}</td>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.role === "therapist" ? "Terapeuta" : u.role === "patient" ? "Paciente" : "Master"}</td>
                  <td style={tdStyle}>{u.is_approved ? "Aprovado" : "Pendente"}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{
                        padding: "8px 12px",
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default UsersPage;
