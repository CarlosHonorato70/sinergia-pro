import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function AdminMasterPacientes() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/admin/all-users`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erro ao carregar pacientes");
        const users = await response.json();

        // Filtrar apenas pacientes aprovados
        const approvedPatients = users.filter(
          (u) => u.role === "patient" && u.is_approved
        );
        setPatients(approvedPatients);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pacientes Aprovados</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Nome</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Papel</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {patient.id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {patient.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {patient.email}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {patient.role}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {patient.is_approved ? "? Aprovado" : "? Pendente"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total: {patients.length} pacientes aprovados</p>
    </div>
  );
}
