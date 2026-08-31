import { clienteHttp } from '../../shared/api/clienteHttp';
export const iniciarSesion = async (email, password) => {
  const { data } = await clienteHttp.post('auth/token/', { username: email, password });
  return data;
};
