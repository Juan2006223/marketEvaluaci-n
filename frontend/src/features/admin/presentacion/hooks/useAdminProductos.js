import { useState, useEffect, useCallback } from 'react';
import { listarTodos, crearProducto, actualizarProducto, eliminarProducto } from '../../api/repositorio';

export function useAdminProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando]   = useState(true);
  const cargar = useCallback(async () => {
    try { setCargando(true); setProductos(await listarTodos()); }
    finally { setCargando(false); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);
  const guardar  = useCallback(async (datos, id=null) => {
    if (id) await actualizarProducto(id, datos);
    else    await crearProducto(datos);
    await cargar();
  }, [cargar]);
  const eliminar = useCallback(async (id) => {
    await eliminarProducto(id);
    setProductos(prev => prev.filter(p => p.id !== id));
  }, []);
  return { productos, cargando, guardar, eliminar };
}
