import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      setLoading(false);

      // Se APROVADO, redireciona conforme role
      if (parsedUser.is_approved) {
        if (parsedUser.role === 'admin_master') {
          navigate('/admin/master');
        } else if (parsedUser.role === 'admin') {
          navigate('/admin');
        } else if (parsedUser.role === 'therapist') {
          navigate('/therapist');
        } else if (parsedUser.role === 'patient') {
          navigate('/patient');
        }
      }
      // Se NAO aprovado, fica nesta pagina (mostra aguardando)
    } catch (error) {
      console.error('Erro ao parsear user:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Carregando...</h1>
      </div>
    );
  }

  // SE NAO ESTA APROVADO, MOSTRA AGUARDANDO
  if (user && !user.is_approved) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '60px 40px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px' }}>
            Aguardando Aprovacao
          </h1>
          
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '12px' }}>
            Sua conta esta em processo de analise.
          </p>
          
          <p style={{ fontSize: '16px', color: '#999', marginBottom: '32px' }}>
            Um administrador analisara sua solicitacao em breve. Voce recebera um email quando estiver aprovado.
          </p>

          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px',
            color: '#92400e'
          }}>
            Status: Pendente de Aprovacao
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Carregando...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo(a) ao Dashboard</h1>

      {user.role === 'admin_master' && (
        <div style={{ marginTop: 20 }}>
          <Link
            to="/admin/master"
            style={{
              padding: 10,
              background: '#333',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 5
            }}
          >
            Administracao Master
          </Link>
        </div>
      )}

      {user.role === 'admin' && (
        <div style={{ marginTop: 20 }}>
          <Link
            to="/admin"
            style={{
              padding: 10,
              background: '#555',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 5
            }}
          >
            Administracao
          </Link>
        </div>
      )}

      {user.role === 'therapist' && (
        <div style={{ marginTop: 20 }}>
          <Link
            to="/therapist"
            style={{
              padding: 10,
              background: '#8A2BE2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 5
            }}
          >
            Area do Terapeuta
          </Link>
        </div>
      )}

      {user.role === 'patient' && (
        <div style={{ marginTop: 20 }}>
          <Link
            to="/patient"
            style={{
              padding: 10,
              background: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 5
            }}
          >
            Area do Paciente
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;