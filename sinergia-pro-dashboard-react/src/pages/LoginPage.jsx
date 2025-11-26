import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { handleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      console.log("LOGIN RAW RESPONSE:", response.data);

      handleLogin(response.data.user, response.data.access_token);

      navigate('/dashboard');

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError(err.response?.data?.detail || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.headerText}>Faça login na sua conta</h2>

        {error && <p style={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          <button type="submit" style={styles.loginButton} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.registerText}>
          Primeira vez?{' '}
          <Link to="/register" style={styles.registerLink}>Cadastre-se</Link>
        </p>

        <Link to="/forgot-password" style={styles.forgotPasswordLink}>
          Recuperar Senha
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #D5C0EA, #8A2BE2, #FFDAB9)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '20px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center',
  },
  headerText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  errorMessage: {
    color: '#f44336',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  loginButton: {
    padding: '15px',
    background: '#8A2BE2',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  registerText: {
    marginTop: '20px',
    fontSize: '14px',
  },
  registerLink: {
    color: '#8A2BE2',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  forgotPasswordLink: {
    marginTop: '10px',
    display: 'block',
    color: '#8A2BE2',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default LoginPage;