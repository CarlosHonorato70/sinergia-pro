import React, { useState } from 'react';
import DiaryViewer from './DiaryViewer';
import TeletherapyCard from './TeletherapyCard';
import './PatientDashboard.css';

// Dados Mock do Paciente
const MOCK_PATIENT = {
  id: 'P-001',
  name: 'Ana Souza',
  age: 32,
  lastSession: '2025-11-19',
  nextSession: '2025-11-21T10:00:00',
};

function PatientDashboard() {
  const [patient, setPatient] = useState(MOCK_PATIENT);

  return (
    <div className="patient-dashboard">
      <div className="patient-header">
        <h2>{patient.name}</h2>
        <p>ID: {patient.id} | Idade: {patient.age}</p>
        <p>Última Sessão: {patient.lastSession}</p>
      </div>

      <div className="dashboard-grid">
        {/* Módulo de Teleterapia */}
        <div className="grid-item teletherapy-module">
          <TeletherapyCard patient={patient} />
        </div>

        {/* Visualizador de Diário Terapêutico */}
        <div className="grid-item diary-module">
          <DiaryViewer patientId={patient.id} />
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
