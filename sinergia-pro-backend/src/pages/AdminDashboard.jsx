import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token de autenticação não encontrado. Faça login novamente.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8000/api/reports/dashboard-stats", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Falha ao carregar estatísticas");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;
  if (!stats) return <p>Nenhum dado disponível</p>;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Administrativo</h1>
      
      <div className="dashboard-grid">
        {/* Linha 1: Métricas principais */}
        <div className="stat-card">
          <h3>Crescimento de Usuários</h3>
          <p className="stat-value">{stats.userGrowth.toFixed(1)}%</p>
          <p className="stat-label">Este mês</p>
        </div>

        <div className="stat-card">
          <h3>Taxa de Retenção</h3>
          <p className="stat-value">{stats.retentionRate.toFixed(1)}%</p>
          <p className="stat-label">Pacientes ativos</p>
        </div>

        <div className="stat-card">
          <h3>Taxa de Conclusão</h3>
          <p className="stat-value">{stats.sessionCompletionRate.toFixed(1)}%</p>
          <p className="stat-label">Sessões concluídas</p>
        </div>

        <div className="stat-card">
          <h3>Satisfação Geral</h3>
          <p className="stat-value">{stats.overallSatisfaction.toFixed(1)}%</p>
          <p className="stat-label">Média de avaliações</p>
        </div>

        {/* Linha 2: Avaliações */}
        <div className="stat-card">
          <h3>Avaliação Terapeutas</h3>
          <p className="stat-value">{stats.avgTherapistRating.toFixed(1)}/5.0</p>
          <p className="stat-label">⭐ Média</p>
        </div>

        <div className="stat-card">
          <h3>Avaliação Pacientes</h3>
          <p className="stat-value">{stats.avgPatientRating.toFixed(1)}/5.0</p>
          <p className="stat-label">⭐ Média</p>
        </div>

        {/* Linha 3: Sessões */}
        <div className="stat-card">
          <h3>Total de Sessões</h3>
          <p className="stat-value">{stats.totalSessions}</p>
          <p className="stat-label">Este mês</p>
        </div>

        <div className="stat-card">
          <h3>Sessões Concluídas</h3>
          <p className="stat-value">{stats.completedSessions}</p>
          <p className="stat-label">✓ Finalizadas</p>
        </div>

        <div className="stat-card">
          <h3>Sessões Canceladas</h3>
          <p className="stat-value">{stats.cancelledSessions}</p>
          <p className="stat-label">✗ Canceladas</p>
        </div>

        {/* Linha 4: Usuários */}
        <div className="stat-card">
          <h3>Total de Usuários</h3>
          <p className="stat-value">{stats.totalUsers}</p>
          <p className="stat-label">Plataforma</p>
        </div>

        <div className="stat-card">
          <h3>Terapeutas</h3>
          <p className="stat-value">{stats.totalTherapists}</p>
          <p className="stat-label">{stats.approvedTherapists} aprovados</p>
        </div>

        <div className="stat-card">
          <h3>Pacientes</h3>
          <p className="stat-value">{stats.totalPatients}</p>
          <p className="stat-label">{stats.approvedPatients} aprovados</p>
        </div>

        <div className="stat-card">
          <h3>Pendentes de Aprovação</h3>
          <p className="stat-value">{stats.pendingUsers}</p>
          <p className="stat-label">Aguardando revisão</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
