import { apiCall } from '../config/api';

export const authService = {
  register: async (email, password, name, role) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  login: async (email, password) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

export default authService;
