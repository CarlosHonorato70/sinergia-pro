import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdminPage from "./pages/AdminPage";
import TherapistPage from "./pages/TherapistPage";
import PatientPage from "./pages/PatientPage";
import DashboardPage from "./pages/DashboardPage";
import AguardandoAprovacao from "./pages/AguardandoAprovacao";
import Rejeitado from "./pages/Rejeitado";
import NovoProntuarioPage from "./pages/NovoProntuarioPage";
import ProntuarioPage from "./pages/ProntuarioPage";
import AnalysisPage from "./pages/AnalysisPage";
import TeletherapyPage from "./pages/TeletherapyPage";
import AnalyticsPage from "./pages/AnalyticsPage";

// PÁGINAS MASTER
import AdminMasterDashboard from "./pages/AdminMasterDashboard";
import MasterUsuariosPage from "./pages/MasterUsuariosPage";
import MasterTerapeutasPage from "./pages/MasterTerapeutasPage";
import MasterPacientesPage from "./pages/MasterPacientesPage";
import MasterAprovacoesPage from "./pages/MasterAprovacoesPage";
import MasterRelatoriosPage from "./pages/MasterRelatoriosPage";
import MasterConfiguracoesPage from "./pages/MasterConfiguracoesPage";
import MasterLogsPage from "./pages/MasterLogsPage";

// PÁGINAS ADMIN
import UsersPage from "./pages/UsersPage";

// LAYOUTS
import AdminMasterLayout from "./components/AdminMasterLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, AuthContext } from "./context/AuthContext";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* PÚBLICAS */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />

      {/* PENDENTES / REJEITADOS */}
      <Route path="/aguardando-aprovacao" element={<AguardandoAprovacao />} />
      <Route path="/rejeitado" element={<Rejeitado />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute user={user}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN - USUÁRIOS */}
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute user={user}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN - TERAPEUTAS */}
      <Route
        path="/admin/terapeutas"
        element={
          <ProtectedRoute user={user}>
            <MasterTerapeutasPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN - PACIENTES */}
      <Route
        path="/admin/pacientes"
        element={
          <ProtectedRoute user={user}>
            <MasterPacientesPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN - RELATÓRIOS */}
      <Route
        path="/admin/relatorios"
        element={
          <ProtectedRoute user={user}>
            <MasterRelatoriosPage />
          </ProtectedRoute>
        }
      />

      {/* MASTER - COM LAYOUT */}
      <Route
        path="/admin/master/*"
        element={
          <ProtectedRoute user={user}>
            <AdminMasterLayout>
              <Routes>
                <Route path="/" element={<AdminMasterDashboard />} />
                <Route path="/usuarios" element={<MasterUsuariosPage />} />
                <Route path="/terapeutas" element={<MasterTerapeutasPage />} />
                <Route path="/pacientes" element={<MasterPacientesPage />} />
                <Route path="/aprovacoes" element={<MasterAprovacoesPage />} />
                <Route path="/relatorios" element={<MasterRelatoriosPage />} />
                <Route path="/configuracoes" element={<MasterConfiguracoesPage />} />
                <Route path="/logs" element={<MasterLogsPage />} />
              </Routes>
            </AdminMasterLayout>
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

      {/* TERAPEUTA - NOVO PRONTUÁRIO */}
      <Route
        path="/therapist/novo-prontuario"
        element={
          <ProtectedRoute user={user}>
            <NovoProntuarioPage />
          </ProtectedRoute>
        }
      />

      {/* TERAPEUTA - VISUALIZAR PRONTUÁRIO */}
      <Route
        path="/therapist/prontuario/:patientId"
        element={
          <ProtectedRoute user={user}>
            <ProntuarioPage />
          </ProtectedRoute>
        }
      />

      {/* TERAPEUTA - ANÁLISE PREDITIVA */}
      <Route
        path="/therapist/analise/:patientId"
        element={
          <ProtectedRoute user={user}>
            <AnalysisPage />
          </ProtectedRoute>
        }
      />

      {/* TERAPEUTA - TELETERAPIA */}
      <Route
        path="/therapist/teleterapia/:patientId"
        element={
          <ProtectedRoute user={user}>
            <TeletherapyPage />
          </ProtectedRoute>
        }
      />

      {/* TERAPEUTA - ANALYTICS */}
      <Route
        path="/therapist/analytics"
        element={
          <ProtectedRoute user={user}>
            <AnalyticsPage />
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

      {/* PADRÃO */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;