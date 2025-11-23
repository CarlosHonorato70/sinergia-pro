import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { apiCall } from '../config/api';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, role }),
      });

      setSuccess('✅ Cadastro realizado com sucesso! Redirecionando...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('❌ Erro ao cadastrar. Email pode já estar registrado.');
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
          Crie sua conta
        </p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
          />

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
            placeholder="Mínimo 6 caracteres"
            required
          />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
              Tipo de Conta
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="patient">👤 Paciente</option>
              <option value="therapist">👨‍⚕️ Terapeuta</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginBottom: '12px' }}
          >
            {loading ? '⏳ Cadastrando...' : '✓ Cadastrar'}
          </Button>
        </form>

        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginTop: '16px' }}>
          Já tem conta? <Link to="/login" style={{ color: '#0066CC', textDecoration: 'none', fontWeight: 'bold' }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
