import React, { useState, useEffect } from "react";
import axios from "axios";

function MasterRelatoriosPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTerapeutas: 0,
    totalPacientes: 0,
    totalAprovados: 0,
    totalPendentes: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const users = response.data;
      const terapeutas = users.filter(u => u.role === "therapist").length;
      const pacientes = users.filter(u => u.role === "patient").length;
      const aprovados = users.filter(u => u.is_approved).length;
      const pendentes = users.filter(u => !u.is_approved).length;

      setStats({
        totalUsers: users.length,
        totalTerapeutas: terapeutas,
        totalPacientes: pacientes,
        totalAprovados: aprovados,
        totalPendentes: pendentes
      });
    } catch (err) {
      setError("Erro ao carregar relatórios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
    flex: 1,
    minWidth: "200px"
  };

  const containerStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "20px"
  };

  const titleStyle = {
    fontSize: "14px",
    opacity: 0.8,
    marginBottom: "10px"
  };

  const numberStyle = {
    fontSize: "32px",
    fontWeight: "bold"
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>📈 Relatórios do Sistema</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Carregando relatórios...</p>
      ) : (
        <>
          <div style={containerStyle}>
            <div style={{ ...cardStyle, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <div style={titleStyle}>Total de Usuários</div>
              <div style={numberStyle}>{stats.totalUsers}</div>
            </div>

            <div style={{ ...cardStyle, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <div style={titleStyle}>🏥 Terapeutas</div>
              <div style={numberStyle}>{stats.totalTerapeutas}</div>
            </div>

            <div style={{ ...cardStyle, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <div style={titleStyle}>👤 Pacientes</div>
              <div style={numberStyle}>{stats.totalPacientes}</div>
            </div>

            <div style={{ ...cardStyle, background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
              <div style={titleStyle}>✅ Aprovados</div>
              <div style={numberStyle}>{stats.totalAprovados}</div>
            </div>

            <div style={{ ...cardStyle, background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
              <div style={titleStyle}>⏳ Pendentes</div>
              <div style={numberStyle}>{stats.totalPendentes}</div>
            </div>
          </div>

          <div style={{ marginTop: "40px", padding: "20px", background: "#f8f9fa", borderRadius: "10px" }}>
            <h2>📊 Resumo Executivo</h2>
            <p>Total de usuários no sistema: <strong>{stats.totalUsers}</strong></p>
            <p>Taxa de aprovação: <strong>{stats.totalUsers > 0 ? ((stats.totalAprovados / stats.totalUsers) * 100).toFixed(1) : 0}%</strong></p>
            <p>Taxa de pendência: <strong>{stats.totalUsers > 0 ? ((stats.totalPendentes / stats.totalUsers) * 100).toFixed(1) : 0}%</strong></p>
            <p>Proporção de terapeutas: <strong>{stats.totalUsers > 0 ? ((stats.totalTerapeutas / stats.totalUsers) * 100).toFixed(1) : 0}%</strong></p>
            <p>Proporção de pacientes: <strong>{stats.totalUsers > 0 ? ((stats.totalPacientes / stats.totalUsers) * 100).toFixed(1) : 0}%</strong></p>
          </div>
        </>
      )}
    </div>
  );
}

export default MasterRelatoriosPage;
