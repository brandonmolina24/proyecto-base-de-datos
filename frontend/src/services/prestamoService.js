import api from './api';

export const prestamoService = {
  listar: async (params = {}) => {
    const response = await api.get('/prestamos', { params });
    return response.data;
  },
  
  desembolsar: async (id) => {
    const response = await api.patch(`/prestamos/${id}/desembolsar`);
    return response.data;
  },

  // --- FUNCIÓN QUE FALTABA ---
  obtenerPorId: async (id) => {
    const response = await api.get(`/prestamos/${id}`);
    return response.data;
  },
};