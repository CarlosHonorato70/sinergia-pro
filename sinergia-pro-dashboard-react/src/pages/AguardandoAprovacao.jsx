import React from "react";
import { useNavigate } from "react-router-dom";

function AguardandoAprovacao() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f3f4f6"
    }}>
      <div style={{
        textAlign: "center",
        backgroundColor: "white",
        padding: "60px 40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: "500px"
      }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#2c3e50", marginBottom: "16px" }}>
          Aguardando Aprovacao
        </h1>
        
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "12px" }}>
          Sua conta esta em processo de analise.
        </p>
        
        <p style={{ fontSize: "16px", color: "#999", marginBottom: "32px" }}>
          Um administrador analisara sua solicitacao em breve. Voce recebera um email quando estiver aprovado.
        </p>

        <div style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #fbbf24",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "32px",
          color: "#92400e"
        }}>
          Status: Pendente de Aprovacao
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  );
}

export default AguardandoAprovacao;
