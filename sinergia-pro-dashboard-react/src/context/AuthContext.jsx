import React, { createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
