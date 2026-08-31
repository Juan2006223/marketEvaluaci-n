import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../shared/estado/useAuthContext';

export function RutaProtegida({ children }) {
  const { esAdmin, cargandoSesion } = useAuthContext();

  if (cargandoSesion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!esAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
