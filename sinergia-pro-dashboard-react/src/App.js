import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import './styles/global.css';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TherapistPage from './pages/TherapistPage';
import PatientPage from './pages/PatientPage';
import ProntuarioPage from './pages/ProntuarioPage';
import PredictiveAnalysisPage from './pages/PredictiveAnalysisPage';
import TeletherapyPage from './pages/TeletherapyPage';
import TherapyDiaryPage from './pages/TherapyDiaryPage';
import AppointmentPage from './pages/AppointmentPage';
import ChatPage from './pages/ChatPage';
import AssessmentsPage from './pages/AssessmentsPage';
import TherapistAnalyticsPage from './pages/TherapistAnalyticsPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ fontSize: '24px' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/therapist" element={user?.role === 'therapist' ? <TherapistPage /> : <Navigate to="/login" />} />
          <Route path="/patient" element={user?.role === 'patient' ? <PatientPage /> : <Navigate to="/login" />} />
          <Route path="/prontuario/:patientId" element={user?.role === 'therapist' ? <ProntuarioPage /> : <Navigate to="/login" />} />
          <Route path="/analise-preditiva/:patientId" element={user?.role === 'therapist' ? <PredictiveAnalysisPage /> : <Navigate to="/login" />} />
          <Route path="/teleterapia/:patientId" element={user?.role === 'therapist' ? <TeletherapyPage /> : <Navigate to="/login" />} />
          <Route path="/diary" element={user?.role === 'patient' ? <TherapyDiaryPage /> : <Navigate to="/login" />} />
          <Route path="/appointments" element={user?.role === 'patient' ? <AppointmentPage /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user?.role === 'patient' ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/assessments" element={user?.role === 'patient' ? <AssessmentsPage /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={user?.role === 'therapist' ? <TherapistAnalyticsPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
