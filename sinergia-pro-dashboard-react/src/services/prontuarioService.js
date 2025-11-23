import api from './api';

export const prontuarioService = {
  generateProntuario: async (data) => {
    try {
      const response = await api.post('/v1/prontuario/generate', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar prontuário:', error);
      throw error;
    }
  },

  getProntuarios: async (patientId) => {
    try {
      const response = await api.get(`/v1/prontuario/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prontuários:', error);
      throw error;
    }
  },
};
