import { useState, useEffect, useCallback } from 'react';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../../api/repositorio';

export function useAdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      const data = await listarCategorias();
      setCategorias(data);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const guardar = useCallback(
    async (datos, id = null) => {
      if (id) await actualizarCategoria(id, datos);
      else await crearCategoria(datos);
      await cargar();
    },
    [cargar]
  );

  const eliminar = useCallback(
    async (id) => {
      await eliminarCategoria(id);
      await cargar();
    },
    [cargar]
  );

  return { categorias, cargando, guardar, eliminar, recargar: cargar };
}
