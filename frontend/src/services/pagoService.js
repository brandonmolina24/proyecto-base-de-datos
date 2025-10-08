import api from './api';

// La clave es "export const" para crear una exportación nombrada
export const pagoService = {
  crear: async (data) => {
    const response = await api.post('/pagos', data);
    return response.data;
  },
};