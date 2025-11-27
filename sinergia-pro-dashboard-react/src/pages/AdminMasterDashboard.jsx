import React, { useEffect, useState } from 'react';
import { graphqlClient, QUERY_DASHBOARD_STATS } from '../graphqlClient';

function AdminMasterDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTherapists: 0,
    registeredPatients: 0,
    pendingApproval: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await graphqlClient.request(QUERY_DASHBOARD_STATS);

      // Calcular estatísticas
      const users = data.users || [];
      const patients = data.approvedPatients || [];
      const therapists = data.approvedTherapists || [];

      const totalUsers = users.length;
      const activeTherapists = therapists.length;
      const registeredPatients = patients.length;
      const pendingApproval = users.filter(u => !u.isApproved).length;

      setStats({
        totalUsers,
        activeTherapists,
        registeredPatients,
        pendingApproval,
      });

      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Calcular alertas
  const alerts = [];
  if (stats.pendingApproval > 0) {
    alerts.push(`${stats.pendingApproval} usuário(s) aguardando aprovação`);
  }
  if (stats.totalUsers === 0) {
    alerts.push('Nenhum usuário no sistema');
  }
  if (stats.activeTherapists < 3 && stats.activeTherapists > 0) {
    alerts.push('Poucos terapeutas ativos no sistema');
  }

  if (loading) {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center' }}>
        <p>⏳ Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#333' }}>📊 Dashboard do Sistema</h1>
          <button
            onClick={loadDashboardData}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🔄 Atualizar
          </button>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            background: '#ffcccc',
            borderRadius: '5px',
            marginBottom: '20px',
            color: 'red',
          }}>
            {error}
          </div>
        )}

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
  );
}

export default AdminMasterDashboard;
