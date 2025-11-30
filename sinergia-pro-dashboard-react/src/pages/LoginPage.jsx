import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "http://localhost:8000";

function LoginPage() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/auth/status`);
        setSystemStatus(response.data.status);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao verificar status:", err);
        setSystemStatus("ready");
        setIsLoading(false);
      }
    };

    checkSystemStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (systemStatus === "empty") {
      if (!email || !password || !fullName) {
        setError("Por favor, preencha todos os campos.");
        return;
      }

      if (password.length < 6) {
        setError("Senha deve ter no mínimo 6 caracteres.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE}/api/auth/register-first-admin`,
          {
            email,
            password,
            full_name: fullName,
          }
        );

        console.log("REGISTRO RAW RESPONSE:", response.data);

        const userData = response.data.user;
        const token = response.data.access_token;

        handleLogin(userData, token);
        navigate("/admin/master");
      } catch (err) {
        console.log("REGISTRO ERROR:", err);
        setError(
          err.response?.data?.detail || "Erro ao registrar admin master."
        );
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setError("Por favor, preencha todos os campos.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE}/api/auth/login`, {
          email,
          password,
        });

        console.log("LOGIN RAW RESPONSE:", response.data);

        const userData = response.data.user;
        const token = response.data.access_token;

        handleLogin(userData, token);

        if (userData.role === "admin_master") {
          navigate("/admin/master");
        } else if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "therapist") {
          navigate("/therapist");
        } else if (userData.role === "patient") {
          navigate("/patient");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.log("LOGIN ERROR:", err);
        setError(err.response?.data?.detail || "Erro ao fazer login.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {systemStatus === "empty" ? (
          <>
            <h2 style={styles.headerText}>🎯 Bem-vindo ao Sinergia Pro!</h2>
            <p style={styles.subtitleText}>
              Crie a conta do administrador master
            </p>

            {error && <p style={styles.errorMessage}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Criando..." : "Criar Admin Master"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 style={styles.headerText}>🔐 Login - Sinergia Pro</h2>
            <p style={styles.subtitleText}>
              Acesse sua conta
            </p>

            {error && <p style={styles.errorMessage}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Entrando..." : "Fazer Login"}
              </button>
            </form>

            <p style={styles.footerText}>
              Não tem uma conta? <Link to="/register" style={styles.link}>Registre-se aqui</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
  },
  headerText: {
    textAlign: "center",
    color: "#333",
    marginBottom: "10px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  subtitleText: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
  },
  footerText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default LoginPage;
