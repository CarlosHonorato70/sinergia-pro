import api from './api';

export const teletherapyService = {
  createRoom: async (data) => {
    try {
      const response = await api.post('/v1/teletherapy/create_room', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sala de teleterapia:', error);
      throw error;
    }
  },

  transcribeSession: async (data) => {
    try {
      const response = await api.post('/v1/teletherapy/transcribe', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao transcrever sessão:', error);
      throw error;
    }
  },
};
