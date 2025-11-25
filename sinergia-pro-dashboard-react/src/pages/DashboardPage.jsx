import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    if (parsedUser.role === 'admin') navigate('/admin');
    else if (parsedUser.role === 'therapist') navigate('/therapist');
    else if (parsedUser.role === 'patient') navigate('/patient');
  }, [navigate]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        Carregando...
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo(a) ao Dashboard</h1>

      {user.role === 'master' && (
        <div style={{ marginTop: 20 }}>
          <Link
            to='/admin/master'
            style={{
              padding: 10,
              background: '#333',
              color: 'white',
              borderRadius: 6,
              textDecoration: 'none'
            }}
          >
            Administração Master
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
