import { apiCall } from '../config/api';

export const appointmentService = {
  getAll: async () => {
    return await apiCall('/appointments');
  },

  create: async (therapist_id, patient_id, date) => {
    return await apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify({ therapist_id, patient_id, date }),
    });
  },

  update: async (id, status, notes) => {
    return await apiCall(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  delete: async (id) => {
    return await apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

export default appointmentService;
