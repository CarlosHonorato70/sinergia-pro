import api from './api';

export const predictiveService = {
  analyzePredictive: async (data) => {
    try {
      const response = await api.post('/v1/predictive/analyze', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao analisar padrões:', error);
      throw error;
    }
  },

  getRiskAssessment: async (patientId) => {
    try {
      const response = await api.get(`/v1/predictive/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter avaliação de risco:', error);
      throw error;
    }
  },
};
