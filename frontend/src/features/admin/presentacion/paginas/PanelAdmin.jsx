import React, { useState } from 'react';
import { Plus, Package, Tags, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAdminProductos } from '../hooks/useAdminProductos';
import { useAdminCategorias } from '../hooks/useAdminCategorias';
import { useAuth } from '../../../auth/presentacion/hooks/useAuth';
import SidebarAdmin from '../componentes/SidebarAdmin';
import TablaProductos from '../componentes/TablaProductos';
import TablaCategorias from '../componentes/TablaCategorias';
import ModalProducto from '../componentes/ModalProducto';
import ModalCategoria from '../componentes/ModalCategoria';

export default function PanelAdmin() {
  const {
    productos,
    cargando: cargandoProd,
    guardar: guardarProd,
    eliminar: eliminarProd,
  } = useAdminProductos();

  const {
    categorias,
    cargando: cargandoCat,
    guardar: guardarCat,
    eliminar: eliminarCat,
  } = useAdminCategorias();

  const { cerrarSesion } = useAuth();

  const [pestana, setPestana] = useState('productos');
  const [productoEditando, setProductoEditando] = useState(null);
  const [modalProdAbierto, setModalProdAbierto] = useState(false);

  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [modalCatAbierto, setModalCatAbierto] = useState(false);

  // Modales Producto
  const abrirModalProducto = (p = null) => {
    setProductoEditando(p);
    setModalProdAbierto(true);
  };
  const cerrarModalProducto = () => {
    setProductoEditando(null);
    setModalProdAbierto(false);
  };
  const handleGuardarProducto = async (datos) => {
    await guardarProd(datos, productoEditando?.id || null);
    cerrarModalProducto();
  };

  // Modales Categoría
  const abrirModalCategoria = (c = null) => {
    setCategoriaEditando(c);
    setModalCatAbierto(true);
  };
  const cerrarModalCategoria = () => {
    setCategoriaEditando(null);
    setModalCatAbierto(false);
  };
  const handleGuardarCategoria = async (datos) => {
    await guardarCat(datos, categoriaEditando?.id || null);
    cerrarModalCategoria();
  };

  const totalActivos = productos.filter((p) => p.is_active).length;
  const totalDestacados = productos.filter((p) => p.is_featured).length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SidebarAdmin
        pestanaActiva={pestana}
        onCambiarPestana={setPestana}
        onCerrarSesion={cerrarSesion}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* ENCABEZADO Y MÉTRICAS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Panel de Administración</h1>
            <p className="text-slate-500 text-sm">
              Gestor institucional de contenidos y taxonomías del CINNDET UPN.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pestana === 'productos' ? (
              <button
                onClick={() => abrirModalProducto()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition flex items-center gap-2 text-sm"
              >
                <Plus size={18} /> Nuevo Recurso
              </button>
            ) : (
              <button
                onClick={() => abrirModalCategoria()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition flex items-center gap-2 text-sm"
              >
                <Plus size={18} /> Nueva Categoría
              </button>
            )}
          </div>
        </div>

        {/* TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{productos.length}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Recursos</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalActivos}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Recursos Activos</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalDestacados}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Destacados</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Tags size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{categorias.length}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Categorías</div>
            </div>
          </div>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        {pestana === 'productos' ? (
          <TablaProductos
            productos={productos}
            cargando={cargandoProd}
            onEditar={abrirModalProducto}
            onEliminar={eliminarProd}
          />
        ) : (
          <TablaCategorias
            categorias={categorias}
            cargando={cargandoCat}
            onEditar={abrirModalCategoria}
            onEliminar={eliminarCat}
          />
        )}
      </main>

      {/* MODALES */}
      {modalProdAbierto && (
        <ModalProducto
          producto={productoEditando}
          onGuardar={handleGuardarProducto}
          onCerrar={cerrarModalProducto}
        />
      )}

      {modalCatAbierto && (
        <ModalCategoria
          categoria={categoriaEditando}
          onGuardar={handleGuardarCategoria}
          onCerrar={cerrarModalCategoria}
        />
      )}
    </div>
  );
}
