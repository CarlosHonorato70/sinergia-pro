import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

function AdminMasterRelatorios() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    user_growth: 0,
    retention_rate: 0,
    total_sessions: 0,
    completed_sessions: 0,
    cancelled_sessions: 0,
    completion_rate: 0,
    therapists_rating: 0,
    patients_rating: 0,
    system_satisfaction: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const statsRes = await fetch(`${API_BASE}/api/reports/dashboard-stats`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json; charset=utf-8"
        },
      });
      const statsData = statsRes.ok ? await statsRes.json() : {};

      const sessionsRes = await fetch(`${API_BASE}/api/reports/sessions`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json; charset=utf-8"
        },
      });
      const sessionsData = sessionsRes.ok ? await sessionsRes.json() : {};

      const satisfactionRes = await fetch(`${API_BASE}/api/reports/satisfaction`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json; charset=utf-8"
        },
      });
      const satisfactionData = satisfactionRes.ok ? await satisfactionRes.json() : {};

      setStats({
        user_growth: statsData.user_growth || 0,
        retention_rate: statsData.retention_rate || 0,
        total_sessions: sessionsData.total_sessions || 0,
        completed_sessions: sessionsData.completed_sessions || 0,
        cancelled_sessions: sessionsData.cancelled_sessions || 0,
        completion_rate: sessionsData.completion_rate || 0,
        therapists_rating: satisfactionData.therapists_rating || 0,
        patients_rating: satisfactionData.patients_rating || 0,
        system_satisfaction: satisfactionData.system_satisfaction || 0,
      });
    } catch (err) {
      console.error("Erro ao carregar relatorios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    alert("Funcionalidade de exportacao em desenvolvimento!");
  };

  if (loading) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center" }}>
        <p>Carregando relatorios...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "32px 16px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
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
          }}
        >
          Voltar
        </button>

        <h1 style={{ marginTop: "20px", marginBottom: "30px" }}>
          Relatorios do Sistema
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ color: "#666", margin: "0 0 10px 0" }}>
              Crescimento de Usuarios
            </p>
            <div
              style={{
                backgroundColor: "#f0f4f8",
                padding: "20px",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#0066CC",
                  margin: 0,
                }}
              >
                {stats.user_growth}%
              </p>
              <p style={{ color: "#666" }}>em relacao ao mes anterior</p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ color: "#666", margin: "0 0 10px 0" }}>Taxa de Retencao</p>
            <div
              style={{
                backgroundColor: "#f0f4f8",
                padding: "20px",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#10b981",
                  margin: 0,
                }}
              >
                {stats.retention_rate}%
              </p>
              <p style={{ color: "#666" }}>usuarios ativos</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0" }}>Relatorio de Sessoes</h3>
            <div style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "4px" }}>
              <p>
                <strong>Total de sessoes este mes:</strong> {stats.total_sessions}
              </p>
              <p>
                <strong>Sessoes concluidas:</strong> {stats.completed_sessions}
              </p>
              <p>
                <strong>Sessoes canceladas:</strong> {stats.cancelled_sessions}
              </p>
              <p>
                <strong>Taxa de conclusao:</strong> {stats.completion_rate}%
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0" }}>Relatorio de Satisfacao</h3>
            <div style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "4px" }}>
              <p>
                <strong>Avaliacao media dos terapeutas:</strong>{" "}
                {stats.therapists_rating}/5.0
              </p>
              <p>
                <strong>Avaliacao media dos pacientes:</strong>{" "}
                {stats.patients_rating}/5.0
              </p>
              <p>
                <strong>Satisfacao geral do sistema:</strong>{" "}
                {stats.system_satisfaction}%
              </p>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            style={{
              padding: "12px 24px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "16px",
              fontSize: "16px",
            }}
          >
            Exportar Relatorio em PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminMasterRelatorios;