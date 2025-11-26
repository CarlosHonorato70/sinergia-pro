import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
      
      // Valida o token no backend
      axios.get('http://localhost:8000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        // Token válido, atualiza user
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        setLoading(false);

        // Se aprovado, redireciona
        if (response.data.is_approved) {
          if (response.data.role === 'master') navigate('/admin/master');
          else if (response.data.role === 'admin') navigate('/admin');
          else if (response.data.role === 'therapist') navigate('/therapist');
          else if (response.data.role === 'patient') navigate('/patient');
        }
      })
      .catch((error) => {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      });
    } catch (error) {
      console.error('Erro ao parsear user:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div style={{ padding: 40 }}><h1>Carregando...</h1></div>;
  }

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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' }}>
            Aguardando Aprovacao
          </h1>
          <p style={{ fontSize: '18px', color: '#666', margin: '16px 0' }}>
            Sua conta esta em analise.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
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

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo(a) ao Dashboard</h1>
    </div>
  );
}

export default DashboardPage;
