import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { apiCall } from '../config/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      handleLogin(response.user, response.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('❌ Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '40px', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066CC', textAlign: 'center', marginBottom: '8px' }}>
          Sinergia Pro
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '32px' }}>
          Saúde Mental com IA
        </p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginBottom: '12px' }}
          >
            {loading ? '⏳ Entrando...' : '✓ Entrar'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={() => {
              setEmail('terapeuta@test.com');
              setPassword('senha123');
            }}
            style={{ width: '100%' }}
          >
            👨‍⚕️ Demo Terapeuta
          </Button>
        </form>

        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginTop: '16px' }}>
          Não tem conta? <Link to="/register" style={{ color: '#0066CC', textDecoration: 'none', fontWeight: 'bold' }}>Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
