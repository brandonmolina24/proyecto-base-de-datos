import api from './api';

export const solicitudService = {
  listar: async (params = {}) => {
    const response = await api.get('/solicitudes', { params });
    return response.data;
  },
  crear: async (data) => {
    const response = await api.post('/solicitudes', data);
    return response.data;
  },
  // --- NUEVAS FUNCIONES ---
  obtenerPorId: async (id) => {
    const response = await api.get(`/solicitudes/${id}`); // Necesitarás crear esta ruta en el backend
    return response.data;
  },
  actualizarEstado: async (id, data) => {
    const response = await api.patch(`/solicitudes/${id}/estado`, data);
    return response.data;
  },
};