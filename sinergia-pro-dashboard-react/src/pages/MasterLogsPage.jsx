import React, { useState, useEffect } from "react";

function MasterLogsPage() {
  const [logs, setLogs] = useState([
    { id: 1, timestamp: "2025-11-26 10:30:45", user: "coach.honorato@gmail.com", action: "LOGIN", status: "Sucesso", details: "Master realizou login" },
    { id: 2, timestamp: "2025-11-26 10:31:12", user: "coach.honorato@gmail.com", action: "VIEW_USERS", status: "Sucesso", details: "Visualizou lista de usuários" },
    { id: 3, timestamp: "2025-11-26 10:32:00", user: "coach.honorato@gmail.com", action: "APPROVE_USER", status: "Sucesso", details: "Aprovou novo terapeuta" },
    { id: 4, timestamp: "2025-11-26 10:33:15", user: "unknown", action: "LOGIN_FAILED", status: "Erro", details: "Falha na autenticação - credenciais inválidas" },
    { id: 5, timestamp: "2025-11-26 10:34:30", user: "coach.honorato@gmail.com", action: "DELETE_USER", status: "Sucesso", details: "Deletou usuário ID: 15" }
  ]);

  const [filtro, setFiltro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const logsFiltrados = logs.filter(log => {
    const matchTexto = log.user.toLowerCase().includes(filtro.toLowerCase()) ||
                       log.action.toLowerCase().includes(filtro.toLowerCase()) ||
                       log.details.toLowerCase().includes(filtro.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || log.status === filtroStatus;
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

  const getStatusColor = (status) => {
    return status === "Sucesso" ? "#27ae60" : "#e74c3c";
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>📋 Logs do Sistema</h1>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Pesquisar por usuário, ação ou detalhes..."
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
          <option>Sucesso</option>
          <option>Erro</option>
        </select>
      </div>

      <p>Total de registros encontrados: {logsFiltrados.length}</p>

      <table style={tableStyle}>
        <thead>
          <tr style={thStyle}>
            <th style={thStyle}>Data/Hora</th>
            <th style={thStyle}>Usuário</th>
            <th style={thStyle}>Ação</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {logsFiltrados.map((log) => (
            <tr key={log.id} style={tdStyle}>
              <td style={tdStyle}>{log.timestamp}</td>
              <td style={tdStyle}>{log.user}</td>
              <td style={tdStyle}><strong>{log.action}</strong></td>
              <td style={{ ...tdStyle, color: getStatusColor(log.status), fontWeight: "bold" }}>
                {log.status === "Sucesso" ? "✅" : "❌"} {log.status}
              </td>
              <td style={tdStyle}>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "30px", padding: "20px", background: "#f8f9fa", borderRadius: "10px" }}>
        <h3>📊 Resumo de Atividades</h3>
        <p>Total de operações: {logs.length}</p>
        <p>Operações bem-sucedidas: {logs.filter(l => l.status === "Sucesso").length}</p>
        <p>Erros: {logs.filter(l => l.status === "Erro").length}</p>
      </div>
    </div>
  );
}

export default MasterLogsPage;
