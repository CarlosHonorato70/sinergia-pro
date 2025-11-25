import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AdminPage from './pages/AdminPage';
import TherapistPage from './pages/TherapistPage';
import PatientPage from './pages/PatientPage';
import DashboardPage from './pages/DashboardPage';
import AdminMaster from './pages/AdminMaster';
import AguardandoAprovacao from './pages/AguardandoAprovacao';
import Rejeitado from './pages/Rejeitado';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext) || {};

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PÚBLICAS */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />

          {/* PENDENTES / REJEITADOS */}
          <Route path="/aguardando-aprovacao" element={<AguardandoAprovacao />} />
          <Route path="/rejeitado" element={<Rejeitado />} />

          {/* DASHBOARD GENÉRICO */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN COMUM */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* MASTER ADMIN */}
          <Route
            path="/admin/master"
            element={
              <ProtectedRoute user={user}>
                <AdminMaster />
              </ProtectedRoute>
            }
          />

          {/* TERAPEUTA */}
          <Route
            path="/therapist"
            element={
              <ProtectedRoute user={user}>
                <TherapistPage />
              </ProtectedRoute>
            }
          />

          {/* PACIENTE */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute user={user}>
                <PatientPage />
              </ProtectedRoute>
            }
          />

          {/* ROTA PADRÃO */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
