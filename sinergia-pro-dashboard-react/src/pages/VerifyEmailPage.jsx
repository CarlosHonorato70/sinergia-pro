import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verificando email...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setMessage('Token de verificação não encontrado');
          setIsError(true);
          return;
        }

        const response = await axios.post(
          'http://localhost:8001/api/auth/verify-email',
          { token }
        );

        setMessage(response.data.message);
        setIsSuccess(true);

        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setMessage(error.response?.data?.detail || 'Erro ao verificar email');
        setIsError(true);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h2 style={{
          marginBottom: '20px',
          color: isSuccess ? '#4CAF50' : isError ? '#f44336' : '#333'
        }}>
          {isSuccess ? '✅ Sucesso!' : isError ? '❌ Erro' : '⏳ Aguarde'}
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '20px'
        }}>
          {message}
        </p>
        {isSuccess && (
          <p style={{ fontSize: '14px', color: '#999' }}>
            Redirecionando para login em 2 segundos...
          </p>
        )}
        {isError && (
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Voltar para Login
          </button>
        )}
      </div>
    </div>
  );
}
