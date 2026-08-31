import { clienteHttp } from '../../../shared/api/clienteHttp';
import { Producto } from '../dominio/valorObjetos';

const BASE = 'productos/';

export const listarProductos = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const { data } = await clienteHttp.get(`${BASE}?${params}`);
  const items = Array.isArray(data) ? data : (data.results || []);
  return items.map((p) => new Producto(p));
};

export const obtenerProducto = async (id) => {
  const { data } = await clienteHttp.get(`${BASE}${id}/`);
  return new Producto(data);
};
