import { useState, useEffect, useCallback } from 'react';
import { listarProductos } from '../../api/repositorio';

export function useProductos(filtros = {}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const filtrosClave = JSON.stringify(filtros);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const params = JSON.parse(filtrosClave);
      const data = await listarProductos(params);
      setProductos(data);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setCargando(false);
    }
  }, [filtrosClave]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { productos, cargando, error, recargar: cargar };
}
