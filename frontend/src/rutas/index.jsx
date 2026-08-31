import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RutaProtegida } from './RutaProtegida';
import Inicio from '../pages/Home';
import DetalleRecurso from '../pages/ProductDetail';
import Login from '../pages/Login';
import RecursosInteres from '../features/interes/presentacion/paginas/RecursosInteres';
import PanelAdmin from '../features/admin/presentacion/paginas/PanelAdmin';
import Cart from '../pages/Cart';
import MisCursos from '../pages/MisCursos';
import CursoPendiente from '../pages/CursoPendiente';

export default function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/recurso/:id" element={<DetalleRecurso />} />
      {/* Retrocompatibilidad con enlaces antiguos */}
      <Route path="/product/:id" element={<DetalleRecurso />} />
      
      <Route path="/guardados" element={<RecursosInteres />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/mis-cursos" element={<MisCursos />} />
      <Route path="/curso/:id" element={<CursoPendiente />} />
      
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
