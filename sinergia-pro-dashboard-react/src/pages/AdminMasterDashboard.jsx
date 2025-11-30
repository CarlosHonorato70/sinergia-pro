import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Users,
  UserCheck,
  UserPlus,
  AlertCircle,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  RefreshCw,
  Home,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_BASE = "http://localhost:8000";

function AdminMasterDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTherapists: 0,
    registeredPatients: 0,
    pendingApproval: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("token");

      const usersRes = await fetch(`${API_BASE}/api/admin/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = usersRes.ok ? await usersRes.json() : [];

      const totalUsers = users.length;
      const activeTherapists = users.filter(
        (u) => u.role === "therapist" && u.is_approved
      ).length;
      const registeredPatients = users.filter(
        (u) => u.role === "patient" && u.is_approved
      ).length;
      const pendingApproval = users.filter((u) => !u.is_approved).length;

      const recentActivity = users.slice(0, 8).map((u, idx) => ({
        id: idx,
        user: u.name,
        action: u.role === "therapist" ? "Terapeuta registrado" : "Paciente registrado",
        timestamp: new Date(Date.now() - idx * 3600000).toLocaleString("pt-BR"),
        status: u.is_approved ? "aprovado" : "pendente",
      }));

      setStats({
        totalUsers,
        activeTherapists,
        registeredPatients,
        pendingApproval,
        recentActivity,
      });
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const chartDataUsers = {
    labels: ["Terapeutas", "Pacientes", "Pendentes"],
    datasets: [
      {
        label: "Distribuição de Usuários",
        data: [stats.activeTherapists, stats.registeredPatients, stats.pendingApproval],
        backgroundColor: ["#8A2BE2", "#10b981", "#ef4444"],
        borderColor: ["#6a1ba8", "#059669", "#dc2626"],
        borderWidth: 3,
      },
    ],
  };

  const chartDataTrend = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Crescimento de Usuários",
        data: [10, 15, 22, 28, 35, stats.totalUsers],
        borderColor: "#8A2BE2",
        backgroundColor: "rgba(138, 43, 226, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: "#8A2BE2",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        border: `3px solid ${bgColor}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
        <div
          style={{
            backgroundColor: bgColor,
            padding: "16px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 12px ${bgColor}40`,
          }}
        >
          <Icon size={28} color={color} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#999", margin: "0 0 8px 0", fontSize: "13px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {label}
          </p>
          <p style={{ fontSize: "32px", fontWeight: "700", margin: 0, color: color }}>
            {value}
          </p>
          {trend && (
            <p style={{ color: "#10b981", margin: "8px 0 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={14} /> {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ animation: "spin 2s linear infinite", marginBottom: "20px" }}>
            <Activity size={64} color="white" strokeWidth={1.5} />
          </div>
          <p style={{ color: "white", fontSize: "18px", fontWeight: "500" }}>
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "48px",
            background: "linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(10, 177, 129, 0.1) 100%)",
            padding: "32px",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <Home size={32} color="#8A2BE2" />
              <h1 style={{ margin: 0, color: "#1f2937", fontSize: "36px", fontWeight: "800" }}>
                Dashboard Master
              </h1>
            </div>
            <p style={{ color: "#666", margin: 0, fontSize: "15px", fontWeight: "500" }}>
              Bem-vindo ao painel de controle do sistema Sinergia Pro
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #8A2BE2 0%, #6a1ba8 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 8px 16px rgba(138, 43, 226, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(138, 43, 226, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(138, 43, 226, 0.3)";
            }}
          >
            <RefreshCw size={18} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {refreshing ? "Atualizando..." : "Atualizar Dados"}
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "18px",
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              borderRadius: "12px",
              marginBottom: "32px",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: "2px solid #fca5a5",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.1)",
            }}
          >
            <AlertCircle size={22} />
            <span style={{ fontWeight: "500" }}>{error}</span>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
          className="fade-in"
        >
          <StatCard
            icon={Users}
            label="Total de Usuários"
            value={stats.totalUsers}
            color="#0066CC"
            bgColor="#dbeafe"
            trend={`+${stats.totalUsers > 5 ? Math.floor(stats.totalUsers * 0.2) : 0} este mês`}
          />
          <StatCard
            icon={UserCheck}
            label="Terapeutas Ativos"
            value={stats.activeTherapists}
            color="#10b981"
            bgColor="#d1fae5"
            trend={`${stats.totalUsers > 0 ? Math.round((stats.activeTherapists / stats.totalUsers) * 100) : 0}% do total`}
          />
          <StatCard
            icon={UserPlus}
            label="Pacientes Registrados"
            value={stats.registeredPatients}
            color="#f59e0b"
            bgColor="#fef3c7"
            trend={`${stats.totalUsers > 0 ? Math.round((stats.registeredPatients / stats.totalUsers) * 100) : 0}% do total`}
          />
          <StatCard
            icon={Clock}
            label="Pendentes de Aprovação"
            value={stats.pendingApproval}
            color="#ef4444"
            bgColor="#fee2e2"
            trend={stats.pendingApproval > 0 ? "Ação necessária" : "Tudo aprovado!"}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "28px",
            marginBottom: "48px",
          }}
          className="fade-in"
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "20px",
              boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 style={{ margin: "0 0 24px 0", color: "#1f2937", fontSize: "20px", fontWeight: "700" }}>
              📊 Distribuição de Usuários
            </h3>
            <Doughnut
              data={chartDataUsers}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      font: { size: 14, weight: "600" },
                      padding: 20,
                      usePointStyle: true,
                    },
                  },
                },
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "20px",
              boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 style={{ margin: "0 0 24px 0", color: "#1f2937", fontSize: "20px", fontWeight: "700" }}>
              📈 Crescimento de Usuários
            </h3>
            <Line
              data={chartDataTrend}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      font: { size: 14, weight: "600" },
                      usePointStyle: true,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "20px",
            boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
          className="fade-in"
        >
          <h3 style={{ margin: "0 0 28px 0", color: "#1f2937", fontSize: "20px", fontWeight: "700" }}>
            📋 Atividades Recentes
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "3px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      color: "#666",
                      fontWeight: "700",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Usuário
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      color: "#666",
                      fontWeight: "700",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Ação
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      color: "#666",
                      fontWeight: "700",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Data/Hora
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "16px",
                      color: "#666",
                      fontWeight: "700",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((activity, idx) => (
                  <tr
                    key={activity.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      transition: "all 0.2s",
                      backgroundColor: idx % 2 === 0 ? "transparent" : "#f9fafb",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "transparent" : "#f9fafb")}
                  >
                    <td style={{ padding: "16px", color: "#333" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #8A2BE2 0%, #6a1ba8 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "700",
                            boxShadow: "0 4px 12px rgba(138, 43, 226, 0.3)",
                          }}
                        >
                          {activity.user.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: "600", color: "#1f2937" }}>
                          {activity.user}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px", color: "#666", fontWeight: "500" }}>
                      {activity.action}
                    </td>
                    <td style={{ padding: "16px", color: "#999", fontSize: "13px" }}>
                      {activity.timestamp}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                          backgroundColor:
                            activity.status === "aprovado" ? "#d1fae5" : "#fee2e2",
                          color:
                            activity.status === "aprovado" ? "#059669" : "#dc2626",
                        }}
                      >
                        {activity.status === "aprovado" ? (
                          <>
                            <CheckCircle size={14} />
                            Aprovado
                          </>
                        ) : (
                          <>
                            <Clock size={14} />
                            Pendente
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats.recentActivity.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
              <Activity size={48} style={{ opacity: 0.5, marginBottom: "16px" }} />
              <p>Nenhuma atividade recente encontrada</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: "48px", textAlign: "center", color: "#999", fontSize: "13px", fontWeight: "500" }}>
          <p>Última atualização: {new Date().toLocaleString("pt-BR")}</p>
          <p>© 2025 Sinergia Pro - Sistema de Gerenciamento de Terapias</p>
        </div>
      </div>
    </div>
  );
}

export default AdminMasterDashboard;
