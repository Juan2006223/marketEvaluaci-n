import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RutaProtegida } from './RutaProtegida';
import Inicio from '../features/productos/presentacion/paginas/Inicio';
import DetalleRecurso from '../features/productos/presentacion/paginas/DetalleRecurso';
import Login from '../features/auth/presentacion/paginas/Login';
import RecursosInteres from '../features/interes/presentacion/paginas/RecursosInteres';
import PanelAdmin from '../features/admin/presentacion/paginas/PanelAdmin';

export default function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/recurso/:id" element={<DetalleRecurso />} />
      {/* Retrocompatibilidad con enlaces antiguos */}
      <Route path="/product/:id" element={<DetalleRecurso />} />
      
      <Route path="/guardados" element={<RecursosInteres />} />
      {/* Retrocompatibilidad con ruta anterior de carrito */}
      <Route path="/cart" element={<RecursosInteres />} />
      
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida>
            <PanelAdmin />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}
