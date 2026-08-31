import { clienteHttp } from '../../../shared/api/clienteHttp';

const BASE_PROD = 'productos/';
const BASE_CAT = 'categorias/';

// CRUD Productos / Recursos con soporte para paginación y lista completa
export const listarTodos = (params = {}) =>
  clienteHttp
    .get(BASE_PROD, { params: { all: 'true', page_size: 100, ...params } })
    .then((r) => (Array.isArray(r.data) ? r.data : r.data.results || []));

export const crearProducto = (dto) =>
  clienteHttp.post(BASE_PROD, dto).then((r) => r.data);

export const actualizarProducto = (id, dto) =>
  clienteHttp.put(`${BASE_PROD}${id}/`, dto).then((r) => r.data);

export const eliminarProducto = (id) =>
  clienteHttp.delete(`${BASE_PROD}${id}/`);

// CRUD Categorías
export const listarCategorias = (params = {}) =>
  clienteHttp
    .get(BASE_CAT, { params: { all: 'true', ...params } })
    .then((r) => (Array.isArray(r.data) ? r.data : r.data.results || []));

export const crearCategoria = (dto) =>
  clienteHttp.post(BASE_CAT, dto).then((r) => r.data);

export const actualizarCategoria = (id, dto) =>
  clienteHttp.put(`${BASE_CAT}${id}/`, dto).then((r) => r.data);

export const eliminarCategoria = (id) =>
  clienteHttp.delete(`${BASE_CAT}${id}/`);
