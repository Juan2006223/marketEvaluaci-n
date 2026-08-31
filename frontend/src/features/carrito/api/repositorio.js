import { carritoStorage } from '../../shared/api/almacenamiento';
export const getCarrito     = () => carritoStorage.obtenerCarrito();
export const setCarrito     = (items) => carritoStorage.guardarCarrito(items);
export const limpiarCarrito = () => carritoStorage.limpiarCarrito();
