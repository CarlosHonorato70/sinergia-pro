import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminMasterLayout from "./components/AdminMasterLayout";
import AdminMasterDashboard from "./pages/AdminMasterDashboard";
import AdminMasterUsuarios from "./pages/AdminMasterUsuarios";
import AdminMasterTerapeutas from "./pages/AdminMasterTerapeutas";
import AdminMasterPacientes from "./pages/AdminMasterPacientes";
import AdminMasterAprovacoes from "./pages/AdminMasterAprovacoes";
import AdminMasterRelatorios from "./pages/AdminMasterRelatorios";
import AdminMasterConfiguracoes from "./pages/AdminMasterConfiguracoes";
import AdminMasterLogs from "./pages/AdminMasterLogs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPage from "./pages/AdminPage";
import TherapistPage from "./pages/TherapistPage";
import PatientPage from "./pages/PatientPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Dashboard - Nova Rota */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminMasterLayout>
                <AdminDashboard />
              </AdminMasterLayout>
            } 
          />
          
          {/* Admin Master Routes */}
          <Route 
            path="/admin/master" 
            element={
              <AdminMasterLayout>
                <AdminMasterDashboard />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/dashboard" 
            element={
              <AdminMasterLayout>
                <AdminMasterDashboard />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/usuarios" 
            element={
              <AdminMasterLayout>
                <AdminMasterUsuarios />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/terapeutas" 
            element={
              <AdminMasterLayout>
                <AdminMasterTerapeutas />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/pacientes" 
            element={
              <AdminMasterLayout>
                <AdminMasterPacientes />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/aprovacoes" 
            element={
              <AdminMasterLayout>
                <AdminMasterAprovacoes />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/relatorios" 
            element={
              <AdminMasterLayout>
                <AdminMasterRelatorios />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/configuracoes" 
            element={
              <AdminMasterLayout>
                <AdminMasterConfiguracoes />
              </AdminMasterLayout>
            } 
          />
          <Route 
            path="/admin/master/logs" 
            element={
              <AdminMasterLayout>
                <AdminMasterLogs />
              </AdminMasterLayout>
            } 
          />
          
          {/* Other Routes */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/therapist" element={<TherapistPage />} />
          <Route path="/patient" element={<PatientPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
