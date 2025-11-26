import React, { useState } from "react";

function MasterConfiguracoesPage() {
  const [settings, setSettings] = useState({
    appName: "Sinergia Pro",
    appVersion: "1.0.0",
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: false,
    backupDaily: true,
    logRetentionDays: 90
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    width: "100%",
    fontSize: "14px"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#333"
  };

  const groupStyle = {
    marginBottom: "25px",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "10px"
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>⚙️ Configurações do Sistema</h1>

      {saved && (
        <p style={{ color: "green", padding: "10px", background: "#d4edda", borderRadius: "5px", marginBottom: "20px" }}>
          ✅ Configurações salvas com sucesso!
        </p>
      )}

      <div style={groupStyle}>
        <h2>📱 Informações da Aplicação</h2>
        <label style={labelStyle}>Nome da Aplicação</label>
        <input
          type="text"
          value={settings.appName}
          onChange={(e) => handleChange("appName", e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Versão</label>
        <input
          type="text"
          value={settings.appVersion}
          onChange={(e) => handleChange("appVersion", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <h2>🔒 Segurança</h2>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          Modo de Manutenção
        </label>

        <label style={labelStyle}>Máximo de Tentativas de Login</label>
        <input
          type="number"
          value={settings.maxLoginAttempts}
          onChange={(e) => handleChange("maxLoginAttempts", parseInt(e.target.value))}
          style={inputStyle}
        />

        <label style={labelStyle}>Timeout de Sessão (minutos)</label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <h2>📧 Notificações</h2>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleChange("emailNotifications", e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          Ativar Notificações por Email
        </label>

        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => handleChange("smsNotifications", e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          Ativar Notificações por SMS
        </label>
      </div>

      <div style={groupStyle}>
        <h2>💾 Backup e Logs</h2>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={settings.backupDaily}
            onChange={(e) => handleChange("backupDaily", e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          Backup Diário Automático
        </label>

        <label style={labelStyle}>Retenção de Logs (dias)</label>
        <input
          type="number"
          value={settings.logRetentionDays}
          onChange={(e) => handleChange("logRetentionDays", parseInt(e.target.value))}
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: "15px 30px",
          background: "#8A2BE2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%"
        }}
      >
        💾 Salvar Configurações
      </button>
    </div>
  );
}

export default MasterConfiguracoesPage;
