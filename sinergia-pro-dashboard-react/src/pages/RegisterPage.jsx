import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        {
          full_name: name,
          email,
          password,
          user_type: userType,
        }
      );

      if (userType === "therapist") {
        setSuccess("✅ Cadastro realizado! Você é um Terapeuta aguardando aprovação do Admin.");
      } else {
        setSuccess("✅ Cadastro realizado! Você é um Paciente aguardando aprovação do Admin.");
      }

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;

      if (Array.isArray(errorData)) {
        const messages = errorData.map(e => e.msg || e.detail).join(", ");
        setError(messages || "Erro ao cadastrar. Tente novamente.");
      } else if (typeof errorData === "object" && errorData?.detail) {
        setError(errorData.detail);
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.headerText}>Criar uma conta</h2>
        <p style={styles.subtitle}>Registre-se como Paciente ou Terapeuta</p>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="E-mail"
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
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
          />

          {/* Seletor de tipo de usuário */}
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            <option value="patient">👤 Sou um Paciente</option>
            <option value="therapist">👨‍⚕️ Sou um Terapeuta</option>
          </select>

          <button type="submit" style={styles.registerButton} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p style={styles.loginText}>
          Já tem uma conta?{" "}
          <Link to="/login" style={styles.loginLink}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #D5C0EA, #8A2BE2, #FFDAB9)",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "20px",
    maxWidth: "450px",
    width: "100%",
    textAlign: "center",
  },
  headerText: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  errorMessage: {
    color: "#f44336",
    marginBottom: "15px",
    fontSize: "14px",
  },
  successMessage: {
    color: "#4CAF50",
    marginBottom: "15px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  select: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  registerButton: {
    padding: "15px",
    background: "#8A2BE2",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    marginTop: "10px",
  },
  loginText: {
    marginTop: "20px",
    fontSize: "14px",
  },
  loginLink: {
    color: "#8A2BE2",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default RegisterPage;