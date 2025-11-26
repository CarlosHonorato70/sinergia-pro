import React, { useState, useEffect } from "react";
import axios from "axios";

function MasterTerapeutasPage() {
  const [terapeutas, setTerapeutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  useEffect(() => {
    fetchTerapeutas();
    const interval = setInterval(fetchTerapeutas, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTerapeutas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const terapeutasData = response.data.filter(u => u.role === "therapist");
      setTerapeutas(terapeutasData);
    } catch (err) {
      setError("Erro ao carregar terapeutas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTerapeuta = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este terapeuta?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTerapeutas(terapeutas.filter(t => t.id !== id));
      alert("Terapeuta deletado com sucesso!");
    } catch (err) {
      alert("Erro ao deletar terapeuta");
    }
  };

  const terapeutasFiltrados = terapeutas.filter(t => {
    const matchTexto = t.name.toLowerCase().includes(filtro.toLowerCase()) ||
                       t.email.toLowerCase().includes(filtro.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || 
                       (filtroStatus === "Aprovados" && t.is_approved) ||
                       (filtroStatus === "Pendentes" && !t.is_approved);
    return matchTexto && matchStatus;
  });

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

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>🏥 Gerenciar Terapeutas</h1>
        <button
          onClick={fetchTerapeutas}
          style={{
            padding: "10px 20px",
            background: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          🔄 Recarregar
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            padding: "10px",
            flex: 1,
            minWidth: "250px",
            borderRadius: "5px",
            border: "1px solid #ddd"
          }}
        />

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            cursor: "pointer"
          }}
        >
          <option>Todos</option>
          <option>Aprovados</option>
          <option>Pendentes</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <p>Total de terapeutas: {terapeutasFiltrados.length}</p>
          <table style={tableStyle}>
            <thead>
              <tr style={thStyle}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {terapeutasFiltrados.map((t) => (
                <tr key={t.id} style={tdStyle} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                  <td style={tdStyle}>{t.id}</td>
                  <td style={tdStyle}>{t.name}</td>
                  <td style={tdStyle}>{t.email}</td>
                  <td style={tdStyle}>{t.is_approved ? "✅ Aprovado" : "⏳ Pendente"}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDeleteTerapeuta(t.id)}
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

export default MasterTerapeutasPage;
