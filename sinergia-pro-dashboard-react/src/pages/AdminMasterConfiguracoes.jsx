import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

function AdminMasterConfiguracoes() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    appName: "Sinergia Pro",
    maintenanceMode: false,
    emailNotifications: true,
    backupDaily: true,
    maxUploadSize: 50,
  });

  const [deleteOptions, setDeleteOptions] = useState({
    users: false,
    sessions: false,
    reports: false,
    financial: false,
    logs: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [actionType, setActionType] = useState("delete");

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleDeleteOptionChange = (option) => {
    setDeleteOptions({ ...deleteOptions, [option]: !deleteOptions[option] });
  };

  const handleSave = () => {
    alert("Configuracoes salvas com sucesso!");
  };

  const handleDeleteClick = () => {
    const selectedOptions = Object.entries(deleteOptions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selectedOptions.length === 0) {
      alert("Selecione pelo menos um modulo para apagar!");
      return;
    }

    const confirmation = window.confirm(
      `ATENCAO!\n\nVoce esta prestes a apagar:\n${selectedOptions
        .map((opt) => {
          const labels = {
            users: "Usuarios",
            sessions: "Sessoes",
            reports: "Relatorios",
            financial: "Dados Financeiros",
            logs: "Logs",
          };
          return `• ${labels[opt]}`;
        })
        .join("\n")}\n\nEsta acao e IRREVERSIVEL!\n\nTem certeza?`
    );

    if (confirmation) {
      setActionType("delete");
      setShowPasswordModal(true);
    }
  };

  const handleCompleteReset = () => {
    const confirmation = window.confirm(
      "ATENCAO MAXIMA!\n\nVoce esta prestes a ZERAR TODO O BANCO DE DADOS!\n\nTodos os usuarios, sessoes, relatorios e dados serao APAGADOS PERMANENTEMENTE!\n\nEsta acao e IRREVERSIVEL!\n\nTem certeza?"
    );

    if (confirmation) {
      setActionType("complete");
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError("Digite a senha!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (actionType === "delete") {
        const selectedOptions = Object.entries(deleteOptions)
          .filter(([_, value]) => value)
          .map(([key]) => key);

        for (const option of selectedOptions) {
          const endpoints = {
            users: "users",
            sessions: "sessions",
            reports: "reports",
            financial: "financial",
            logs: "logs",
          };

          const response = await fetch(
            `${API_BASE}/api/admin/database/${endpoints[option]}`,
            {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ password: password }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Senha incorreta!");
          }
        }

        alert("Dados apagados com sucesso!");
        setDeleteOptions({
          users: false,
          sessions: false,
          reports: false,
          financial: false,
          logs: false,
        });
      } else if (actionType === "complete") {
        const response = await fetch(
          `${API_BASE}/api/database/reset-all`,
          {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: password }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Senha incorreta!");
        }

        alert("Banco de dados zerado com sucesso!");
        
        // Limpar token e redirecionar para login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirecionar com delay para garantir logout
        setTimeout(() => {
          navigate("/login", { replace: true });
          window.location.reload();
        }, 500);
        
        return;
      }

      setError("");
      setShowPasswordModal(false);
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "32px 16px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/admin/master")}
          style={{
            padding: "10px 20px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Voltar
        </button>

        <h1 style={{ marginTop: "20px", marginBottom: "30px" }}>
          Configuracoes do Sistema
        </h1>

        <div style={{ display: "grid", gap: "20px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Configuracoes Gerais</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Nome da Aplicacao
              </label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange("appName", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Tamanho maximo de upload (MB)
              </label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleChange("maxUploadSize", parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  style={{ marginRight: "10px" }}
                />
                Modo Manutencao
              </label>
              <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                  style={{ marginRight: "10px" }}
                />
                Notificacoes por Email
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={settings.backupDaily}
                  onChange={(e) => handleChange("backupDaily", e.target.checked)}
                  style={{ marginRight: "10px" }}
                />
                Backup Diario
              </label>
            </div>

            <button
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Salvar Configuracoes
            </button>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#dc3545" }}>Manutencao do Banco de Dados</h3>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              Selecione os modulos que deseja apagar. Esta acao e IRREVERSIVEL!
            </p>

            <div style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Opcoes de Delecao</h4>
              <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.users}
                  onChange={() => handleDeleteOptionChange("users")}
                  style={{ marginRight: "10px" }}
                />
                Usuarios
              </label>
              <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.sessions}
                  onChange={() => handleDeleteOptionChange("sessions")}
                  style={{ marginRight: "10px" }}
                />
                Sessoes
              </label>
              <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.reports}
                  onChange={() => handleDeleteOptionChange("reports")}
                  style={{ marginRight: "10px" }}
                />
                Relatorios
              </label>
              <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.financial}
                  onChange={() => handleDeleteOptionChange("financial")}
                  style={{ marginRight: "10px" }}
                />
                Dados Financeiros
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={deleteOptions.logs}
                  onChange={() => handleDeleteOptionChange("logs")}
                  style={{ marginRight: "10px" }}
                />
                Logs
              </label>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={handleDeleteClick}
                style={{
                  padding: "10px 20px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Apagar Dados Selecionados
              </button>

              <button
                onClick={handleCompleteReset}
                style={{
                  padding: "10px 20px",
                  background: "#8b0000",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Zerar Banco de Dados Completo
              </button>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#fff3cd",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #ffc107",
            }}
          >
            <p style={{ margin: 0, color: "#856404" }}>
              ATENCAO: As operacoes de delecao nao podem ser desfeitas. Certifique-se de ter backup dos dados antes de continuar.
            </p>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h2>Confirmacao de Seguranca</h2>
            <p>Digite a senha do administrador master:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handlePasswordSubmit}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMasterConfiguracoes;