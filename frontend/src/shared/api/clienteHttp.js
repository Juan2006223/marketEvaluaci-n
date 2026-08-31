// ADAPTADOR HTTP: instancia axios con interceptores JWT.
import axios from 'axios';
import { tokenStorage } from './almacenamiento';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

export const clienteHttp = axios.create({ baseURL: API_URL });

clienteHttp.interceptors.request.use((config) => {
  const token = tokenStorage.obtenerAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

clienteHttp.interceptors.response.use(
  (res) => res,
  async (error) => {
    const req = error.config;
    if (error.response?.status === 401 && !req._retry) {
      req._retry = true;
      const refresh = tokenStorage.obtenerRefreshToken();
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}auth/token/refresh/`, { refresh });
          tokenStorage.guardarAccessToken(data.access);
          clienteHttp.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
          return clienteHttp(req);
        } catch {
          tokenStorage.limpiar();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
