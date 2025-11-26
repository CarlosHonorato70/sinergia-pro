import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserStatus } from "../context/useUserStatus";

function MasterAprovacoesPage() {
  const { user } = useUserStatus();
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processando, setProcessando] = useState({});

  useEffect(() => {
    fetchPendentes();
  }, []);

  const fetchPendentes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const response = await axios.get("http://localhost:8000/api/admin/pending-users?timestamp=" + Date.now(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
      console.log("Pendentes carregados:", response.data);
      setPendentes(response.data);
    } catch (err) {
      setError("Erro ao carregar pendencias");
      console.error("Erro detalhado:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, role) => {
    setProcessando({ ...processando, [id]: "aprovando" });
    try {
      const token = localStorage.getItem("token");
      console.log("Aprovando usuario:", id, "com role:", role);
      
      const response = await axios.post(`http://localhost:8000/api/admin/approve-user/${id}`,
        { new_role: role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Resposta:", response.data);
      alert("Usuario aprovado com sucesso!");

      setPendentes(pendentes.filter(p => p.id !== id));
      setProcessando({ ...processando, [id]: null });
      
      // Recarrega pendentes apos 1 segundo
      setTimeout(() => fetchPendentes(), 1000);
    } catch (err) {
      console.error("Erro ao aprovar:", err.response?.data || err.message);
      alert("Erro ao aprovar: " + (err.response?.data?.detail || err.message));
      setProcessando({ ...processando, [id]: null });
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Tem certeza que deseja rejeitar?")) return;

    setProcessando({ ...processando, [id]: "rejeitando" });
    try {
      const token = localStorage.getItem("token");
      console.log("Rejeitando usuario:", id);
      
      const response = await axios.post(`http://localhost:8000/api/admin/reject-user/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Resposta:", response.data);
      alert("Usuario rejeitado!");

      setPendentes(pendentes.filter(p => p.id !== id));
      setProcessando({ ...processando, [id]: null });
      
      // Recarrega pendentes apos 1 segundo
      setTimeout(() => fetchPendentes(), 1000);
    } catch (err) {
      console.error("Erro ao rejeitar:", err.response?.data || err.message);
      alert("Erro ao rejeitar: " + (err.response?.data?.detail || err.message));
      setProcessando({ ...processando, [id]: null });
    }
  };

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
        <h1>Aprovacoes Pendentes</h1>
        <button
          onClick={fetchPendentes}
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
          Recarregar
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>Total de pendencias: {pendentes.length}</p>
          {pendentes.length === 0 ? (
            <p style={{ color: "green", fontSize: "16px" }}>Nenhuma aprovacao pendente!</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={thStyle}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pendentes.map((p) => (
                  <tr key={p.id} style={tdStyle}>
                    <td style={tdStyle}>{p.id}</td>
                    <td style={tdStyle}>{p.name}</td>
                    <td style={tdStyle}>{p.email}</td>
                    <td style={tdStyle}>{p.role === "therapist" ? "Terapeuta" : "Paciente"}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleApprove(p.id, p.role)}
                        disabled={processando[p.id] !== null && processando[p.id] !== undefined}
                        style={{
                          padding: "8px 12px",
                          background: processando[p.id] ? "#95a5a6" : "#27ae60",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: processando[p.id] ? "not-allowed" : "pointer",
                          marginRight: "8px"
                        }}
                      >
                        {processando[p.id] === "aprovando" ? "Aprovando..." : "Aprovar"}
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        disabled={processando[p.id] !== null && processando[p.id] !== undefined}
                        style={{
                          padding: "8px 12px",
                          background: processando[p.id] ? "#95a5a6" : "#e74c3c",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: processando[p.id] ? "not-allowed" : "pointer"
                        }}
                      >
                        {processando[p.id] === "rejeitando" ? "Rejeitando..." : "Rejeitar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default MasterAprovacoesPage;
