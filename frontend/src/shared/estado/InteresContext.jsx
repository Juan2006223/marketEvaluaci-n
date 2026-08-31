import React, { useState, useEffect, useCallback } from 'react';
import { interesStorage } from '../api/almacenamiento';
import { InteresContext } from './interesContextDef';

export function InteresProvider({ children }) {
  const [items, setItems] = useState(() => interesStorage.obtenerItems());

  useEffect(() => {
    const handleStorageChange = () => {
      setItems(interesStorage.obtenerItems());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const guardarRecurso = useCallback((producto) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === producto.id)) return prev;
      const nuevo = [...prev, producto];
      interesStorage.guardarItems(nuevo);
      window.dispatchEvent(new Event('storage'));
      return nuevo;
    });
  }, []);

  const quitarRecurso = useCallback((productoId) => {
    setItems((prev) => {
      const nuevo = prev.filter((item) => item.id !== productoId);
      interesStorage.guardarItems(nuevo);
      window.dispatchEvent(new Event('storage'));
      return nuevo;
    });
  }, []);

  const toggleInteres = useCallback((producto) => {
    setItems((prev) => {
      const existe = prev.some((item) => item.id === producto.id);
      const nuevo = existe
        ? prev.filter((item) => item.id !== producto.id)
        : [...prev, producto];
      interesStorage.guardarItems(nuevo);
      window.dispatchEvent(new Event('storage'));
      return nuevo;
    });
  }, []);

  const estaGuardado = useCallback((productoId) => {
    return items.some((item) => item.id === productoId);
  }, [items]);

  const vaciarLista = useCallback(() => {
    interesStorage.limpiarItems();
    setItems([]);
    window.dispatchEvent(new Event('storage'));
  }, []);

  return (
    <InteresContext.Provider
      value={{
        items,
        cantidad: items.length,
        guardarRecurso,
        quitarRecurso,
        toggleInteres,
        estaGuardado,
        vaciarLista,
      }}
    >
      {children}
    </InteresContext.Provider>
  );
}

export { InteresContext };
