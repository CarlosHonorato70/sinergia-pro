import React, { useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminMasterLayout({ children }) {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/master', icon: '📊' },
    { name: 'Usuários', path: '/admin/master/usuarios', icon: '👥' },
    { name: 'Terapeutas', path: '/admin/master/terapeutas', icon: '👨‍⚕️' },
    { name: 'Pacientes', path: '/admin/master/pacientes', icon: '🧑‍🤝‍🧑' },
    { name: 'Aprovações', path: '/admin/master/aprovacoes', icon: '✅' },
    { name: 'Relatórios', path: '/admin/master/relatorios', icon: '📈' },
    { name: 'Configurações', path: '/admin/master/configuracoes', icon: '⚙️' },
    { name: 'Logs', path: '/admin/master/logs', icon: '📋' },
  ];

  return (
    <div style={layoutStyles.container}>
      {/* Sidebar */}
      <aside style={layoutStyles.sidebar}>
        <div style={layoutStyles.sidebarHeader}>
          <h2 style={layoutStyles.sidebarTitle}>Sinergia Pro</h2>
        </div>
        <nav>
          <ul style={layoutStyles.menuList}>
            {menuItems.map((item) => (
              <li key={item.name} style={layoutStyles.menuItem}>
                <Link
                  to={item.path}
                  style={{
                    ...layoutStyles.menuLink,
                    ...(location.pathname === item.path ? layoutStyles.menuLinkActive : {}),
                  }}
                >
                  <span style={layoutStyles.menuIcon}>{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={layoutStyles.mainContentArea}>
        {/* Header */}
        <header style={layoutStyles.header}>
          <h1 style={layoutStyles.headerTitle}>Painel do Administrador Master</h1>
          <button onClick={handleLogoutClick} style={layoutStyles.logoutButton}>
            Sair
          </button>
        </header>

        {/* Page Content */}
        <main style={layoutStyles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}

const layoutStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Light background for the whole app
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#1a1a1a', // Dark background
    color: '#ffffff',
    padding: '20px 0',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0, // Prevent sidebar from shrinking
  },
  sidebarHeader: {
    padding: '0 20px 30px 20px',
    borderBottom: '1px solid #333',
    marginBottom: '20px',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    color: '#00ccff', // Highlight color for title
  },
  menuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    marginBottom: '5px',
  },
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#cccccc',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  menuLinkActive: {
    backgroundColor: '#0056b3', // Darker blue for active
    color: '#ffffff',
    fontWeight: 'bold',
    borderLeft: '4px solid #00ccff', // Highlight bar
    paddingLeft: '16px', // Adjust padding for border
  },
  menuIcon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  mainContentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: '70px',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexShrink: 0, // Prevent header from shrinking
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: 0,
    color: '#333333',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545', // Red for logout
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  pageContent: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto', // Enable scrolling for content if it overflows
  },
};

// Add hover effects dynamically
Object.assign(layoutStyles.menuLink, {
  ':hover': {
    backgroundColor: '#333333', // Lighter dark for hover
    color: '#ffffff',
  },
});

Object.assign(layoutStyles.logoutButton, {
  ':hover': {
    backgroundColor: '#c82333', // Darker red for hover
  },
});

export default AdminMasterLayout;