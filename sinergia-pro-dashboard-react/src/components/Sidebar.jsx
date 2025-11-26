import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ user }) {
  if (!user) return null;

  return (
    <div style={{
      width: '250px',
      background: '#1f1f1f',
      color: 'white',
      padding: '20px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto'
    }}>
      <h2 style={{ marginBottom: '30px', fontSize: '22px' }}>Menu</h2>

      {/* MASTER */}
      {user.role === 'master' && (
        <>
          <Link to="/admin/master" style={linkStyle}>📊 Dashboard</Link>
          <Link to="/admin/master/usuarios" style={linkStyle}>👥 Usuários</Link>
          <Link to="/admin/master/terapeutas" style={linkStyle}>🏥 Terapeutas</Link>
          <Link to="/admin/master/pacientes" style={linkStyle}>👤 Pacientes</Link>
          <Link to="/admin/master/aprovacoes" style={linkStyle}>⏳ Aprovações Pendentes</Link>
          <Link to="/admin/master/relatorios" style={linkStyle}>📈 Relatórios</Link>
          <Link to="/admin/master/configuracoes" style={linkStyle}>⚙️ Configurações</Link>
          <Link to="/admin/master/logs" style={linkStyle}>📋 Logs do Sistema</Link>
          <Link to="/admin/master" style={{...linkStyle, marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444'}}>Administração Master</Link>
        </>
      )}

      {/* ADMIN */}
      {user.role === 'admin' && (
        <>
          <Link to="/admin" style={linkStyle}>📊 Dashboard</Link>
          <Link to="/admin/usuarios" style={linkStyle}>👥 Usuários</Link>
          <Link to="/admin/terapeutas" style={linkStyle}>🏥 Terapeutas</Link>
          <Link to="/admin/pacientes" style={linkStyle}>👤 Pacientes</Link>
          <Link to="/admin/relatorios" style={linkStyle}>📈 Relatórios</Link>
          <Link to="/admin" style={{...linkStyle, marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444'}}>Painel Administrativo</Link>
        </>
      )}

      {/* THERAPIST */}
      {user.role === 'therapist' && (
        <>
          <Link to="/therapist" style={linkStyle}>📊 Dashboard do Terapeuta</Link>
          <Link to="/appointments" style={linkStyle}>📅 Agenda</Link>
          <Link to="/patients" style={linkStyle}>👥 Pacientes</Link>
          <Link to="/prontuario" style={linkStyle}>📋 Prontuários</Link>
        </>
      )}

      {/* PATIENT */}
      {user.role === 'patient' && (
        <>
          <Link to="/diary" style={linkStyle}>📔 Diário Terapêutico</Link>
          <Link to="/teletherapy" style={linkStyle}>📹 Teleterapia</Link>
          <Link to="/assessments" style={linkStyle}>📝 Avaliações</Link>
        </>
      )}
    </div>
  );
}

const linkStyle = {
  display: 'block',
  color: 'white',
  padding: '12px 0',
  fontSize: '15px',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  ':hover': {
    opacity: 0.7
  }
};

export default Sidebar;