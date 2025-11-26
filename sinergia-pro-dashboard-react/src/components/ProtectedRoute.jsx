import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: 30 }}>Carregando...</div>;
  }

  // Não logado → Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Usuário pendente → tela de aprovação
  if (user.role === 'pending' || user.is_approved === false) {
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  // Usuário rejeitado
  if (user.role === 'rejected') {
    return <Navigate to="/rejeitado" replace />;
  }

  // Mostrar Sidebar apenas para Admin e Master
  const showSidebar = user.role === 'admin' || user.role === 'master';

  // Layout com sidebar (apenas para admin/master)
  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar user={user} />}

      <div style={{ marginLeft: showSidebar ? '250px' : '0', width: '100%', padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}

export default ProtectedRoute;