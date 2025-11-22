import React, { useState } from 'react';
import './TeletherapyCard.css';

// Dados Mock
const MOCK_THERAPIST_ID = 'T-456';
const MOCK_THERAPIST_NAME = 'Dr. Carlos Silva';

function TeletherapyCard({ patient }) {
  const [roomLink, setRoomLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    // Simulação de chamada à API de Teleterapia (POST /api/v1/teletherapy/create_room)
    const mockResponse = {
      room_id: `ROOM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      therapist_link: `https://teletherapy.sintropiapro.com/join/ROOM-MOCK-123?role=therapist&session=SESS-MOCK`,
      patient_link: `https://teletherapy.sintropiapro.com/join/ROOM-MOCK-123?role=patient&session=SESS-MOCK`,
    };

    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    setRoomLink(mockResponse.therapist_link);
    setIsLoading(false);
    alert(`Sala criada! Link do Paciente: ${mockResponse.patient_link}`);
  };

  return (
    <div className="teletherapy-card">
      <h3>Módulo de Teleterapia</h3>
      <p>Próxima Sessão: **{new Date(patient.nextSession).toLocaleString('pt-BR')}**</p>
      
      <button 
        onClick={handleCreateRoom} 
        disabled={isLoading}
        className="start-session-btn"
      >
        {isLoading ? 'Criando Sala...' : 'Iniciar Sessão Agora'}
      </button>

      {roomLink && (
        <div className="room-details">
          <p>Link da Sala (Terapeuta):</p>
          <a href={roomLink} target="_blank" rel="noopener noreferrer">{roomLink.substring(0, 40)}...</a>
          <p className="note">Clique para entrar na sala de teleterapia segura.</p>
        </div>
      )}
    </div>
  );
}

export default TeletherapyCard;
