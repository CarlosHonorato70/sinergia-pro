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
      left: 0
    }}>
      <h2 style={{ marginBottom: '30px', fontSize: '22px' }}>Menu</h2>

      {/* MASTER */}
      {user.role === 'master' && (
        <>
          <Link to="/admin/master" style={linkStyle}>Administração Master</Link>
        </>
      )}

      {/* ADMIN */}
      {user.role === 'admin' && (
        <>
          <Link to="/admin" style={linkStyle}>Painel Administrativo</Link>
        </>
      )}

      {/* THERAPIST */}
      {user.role === 'therapist' && (
        <>
          <Link to="/therapist" style={linkStyle}>Dashboard do Terapeuta</Link>
          <Link to="/appointments" style={linkStyle}>Agenda</Link>
          <Link to="/patients" style={linkStyle}>Pacientes</Link>
          <Link to="/prontuario" style={linkStyle}>Prontuários</Link>
        </>
      )}

      {/* PATIENT */}
      {user.role === 'patient' && (
        <>
          <Link to="/diary" style={linkStyle}>Diário Terapêutico</Link>
          <Link to="/teletherapy" style={linkStyle}>Teleterapia</Link>
          <Link to="/assessments" style={linkStyle}>Avaliações</Link>
        </>
      )}
    </div>
  );
}

const linkStyle = {
  display: 'block',
  color: 'white',
  padding: '10px 0',
  fontSize: '16px',
  textDecoration: 'none'
};

export default Sidebar;
