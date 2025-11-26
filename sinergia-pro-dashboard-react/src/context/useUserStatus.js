import { useState, useEffect } from "react";

export const useUserStatus = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recarrega o user do localStorage
  const refreshUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  // Carrega na primeira vez
  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, []);

  // Monitora mudancas no localStorage a cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { user, loading, refreshUser };
};
