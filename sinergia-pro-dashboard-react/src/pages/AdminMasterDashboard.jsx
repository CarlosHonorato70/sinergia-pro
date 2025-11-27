import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function AdminMasterDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTherapists: 0,
    registeredPatients: 0,
    pendingApproval: 0,
  });
  const [recentStats, setRecentStats] = useState({
    newUsers: 0,
    sessionsCompleted: 0,
    satisfactionRate: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_BASE = 'http://localhost:8000/api/admin';

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Buscar estatísticas gerais
      const usersRes = await axios.get(`${API_BASE}/stats/users`, axiosConfig);
      setStats({
        totalUsers: usersRes.data.total || 0,
        activeTherapists: usersRes.data.therapists || 0,
        registeredPatients: usersRes.data.patients || 0,
        pendingApproval: usersRes.data.pending || 0,
      });

      // Buscar estatísticas recentes
      const recentRes = await axios.get(`${API_BASE}/stats/recent`, axiosConfig);
      setRecentStats({
        newUsers: recentRes.data.new_users || 0,
        sessionsCompleted: recentRes.data.sessions || 0,
        satisfactionRate: recentRes.data.satisfaction || 0,
      });

      // Buscar alertas
      const alertsRes = await axios.get(`${API_BASE}/alerts`, axiosConfig);
      setAlerts(alertsRes.data || []);

    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      // Fallback com dados padrão
      setStats({
        totalUsers: 0,
        activeTherapists: 0,
        registeredPatients: 0,
        pendingApproval: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#333' }}>📊 Dashboard do Sistema</h1>

        {/* Cards de Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Card 1 - Total de Usuários */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>Total de Usuários</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066CC', margin: 0 }}>{stats.totalUsers}</p>
          </div>

          {/* Card 2 - Terapeutas Ativos */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>Terapeutas Ativos</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{stats.activeTherapists}</p>
          </div>

          {/* Card 3 - Pacientes Registrados */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>Pacientes Registrados</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{stats.registeredPatients}</p>
          </div>

          {/* Card 4 - Pendentes de Aprovação */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>Pendentes de Aprovação</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>{stats.pendingApproval}</p>
          </div>
        </div>

        {/* Seção de Estatísticas Recentes e Alertas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Estatísticas Recentes */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Estatísticas Recentes</h3>
            <div style={{ backgroundColor: '#f0f4f8', padding: '16px', borderRadius: '4px' }}>
              <p style={{ margin: '8px 0', color: '#333' }}>✓ Novos usuários (últimos 30 dias): {recentStats.newUsers}</p>
              <p style={{ margin: '8px 0', color: '#333' }}>✓ Sessões realizadas: {recentStats.sessionsCompleted}</p>
              <p style={{ margin: '8px 0', color: '#333' }}>✓ Taxa de satisfação: {recentStats.satisfactionRate}%</p>
            </div>
          </div>

          {/* Alertas do Sistema */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Alertas do Sistema</h3>
            <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '4px', borderLeft: '4px solid #ef4444' }}>
              {alerts.length > 0 ? (
                alerts.map((alert, idx) => (
                  <p key={idx} style={{ margin: '8px 0', fontWeight: 'bold', color: '#d32f2f' }}>
                    ⚠️ {alert}
                  </p>
                ))
              ) : (
                <p style={{ margin: '8px 0', color: '#666' }}>✓ Nenhum alerta no momento</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMasterDashboard;