import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    console.log('User role:', user.role);

    if (user.role === 'therapist') {
      navigate('/therapist');
    } else if (user.role === 'patient') {
      navigate('/patient');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      ⏳ Redirecionando...
    </div>
  );
}

export default DashboardPage;
