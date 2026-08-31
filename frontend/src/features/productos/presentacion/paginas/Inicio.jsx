import React, { useRef, useState, useMemo } from 'react';
import { Search, Sparkles, ChevronLeft, ChevronRight, Filter, BookOpen, Layers, ExternalLink } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { filtrarPorSeccion, filtrarPorCategoria, filtrarPorTipo, filtrarPorBusqueda } from '../../dominio/reglas';
import TarjetaProducto from '../componentes/TarjetaProducto';

const CATEGORIAS = [
  { slug: 'all', label: 'Todas las Categorías' },
  { slug: 'ia', label: 'IA & Analítica' },
  { slug: 'gamificacion', label: 'Gamificación' },
  { slug: 'vr', label: 'Realidad Virtual' },
  { slug: 'apps', label: 'Software & Apps' },
];

const TIPOS = [
  { slug: 'all', label: 'Todos los Tipos' },
  { slug: 'herramienta_digital', label: 'Herramientas Digitales' },
  { slug: 'recurso_educativo', label: 'Recursos Educativos' },
  { slug: 'servicio', label: 'Servicios' },
  { slug: 'capacitacion', label: 'Capacitaciones' },
];

export default function Inicio() {
  const { productos, cargando, error, recargar } = useProductos();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('all');
  const [tipoActivo, setTipoActivo] = useState('all');
  const carouselRef = useRef(null);

  // Filtrado reactivo en cliente
  const productosFiltrados = useMemo(() => {
    let res = productos;
    if (categoriaActiva !== 'all') {
      res = filtrarPorCategoria(res, categoriaActiva);
    }
    if (tipoActivo !== 'all') {
      res = filtrarPorTipo(res, tipoActivo);
    }
    if (busqueda.trim()) {
      res = filtrarPorBusqueda(res, busqueda);
    }
    return res;
  }, [productos, categoriaActiva, tipoActivo, busqueda]);

  const destacadas = useMemo(
    () => filtrarPorSeccion(productosFiltrados, 'destacadas'),
    [productosFiltrados]
  );
  const innovacionesMes = useMemo(
    () => filtrarPorSeccion(productosFiltrados, 'mes'),
    [productosFiltrados]
  );
  const recomendadas = useMemo(
    () => filtrarPorSeccion(productosFiltrados, 'recomendadas'),
    [productosFiltrados]
  );

  const scrollCarrusel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
    }
  };

  const hayFiltroActivo = busqueda.trim() !== '' || categoriaActiva !== 'all' || tipoActivo !== 'all';

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Cargando catálogo institucional CINNDET...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white border border-red-100 rounded-3xl shadow-sm text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Error al cargar el catálogo</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={recargar}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO INSTITUCIONAL */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            Centro de Innovación y Desarrollo Tecnológico · CINNDET UPN
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Ecosistema de Recursos, Herramientas y Servicios Educativos
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Centralizamos y visibilizamos las soluciones pedagógicas y tecnológicas desarrolladas para fortalecer la labor docente y el aprendizaje universitario.
          </p>

          {/* BARRA DE BÚSQUEDA PRINCIPAL */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
            <Search className="text-slate-300 ml-3 shrink-0" size={20} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título, temática, palabras clave o categoría..."
              className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-400 outline-none text-sm md:text-base font-medium"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="text-xs text-slate-300 hover:text-white px-2 py-1 bg-white/10 rounded-lg mr-1 font-bold"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* BARRA DE FILTROS */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-4 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filtro por Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Categoría:
            </span>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategoriaActiva(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  categoriaActiva === cat.slug
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filtro por Tipo de Recurso */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Filter size={15} className="text-slate-400" />
            <select
              value={tipoActivo}
              onChange={(e) => setTipoActivo(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TIPOS.map((tipo) => (
                <option key={tipo.slug} value={tipo.slug}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* VISTA DE RESULTADOS O SECCIONES CURADAS */}
      <main className="container mx-auto max-w-6xl px-6 py-12 space-y-16">
        {hayFiltroActivo ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Resultados de la búsqueda</h2>
                <p className="text-slate-500 text-sm">
                  {productosFiltrados.length} recursos encontrados con los filtros aplicados.
                </p>
              </div>
              <button
                onClick={() => {
                  setBusqueda('');
                  setCategoriaActiva('all');
                  setTipoActivo('all');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Restablecer todos los filtros
              </button>
            </div>

            {productosFiltrados.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No se encontraron recursos</h3>
                <p className="text-slate-500 text-sm">
                  Prueba cambiando los términos de búsqueda o seleccionando otra categoría.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productosFiltrados.map((prod) => (
                  <TarjetaProducto key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* SECCIÓN: SOLUCIONES DESTACADAS */}
            {destacadas.length > 0 && (
              <section>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-600 mb-2">
                    <Sparkles size={14} /> Soluciones Institucionales
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Soluciones Destacadas</h2>
                  <p className="text-slate-500 text-sm">
                    Iniciativas pedagógicas y desarrollos de alto impacto disponibles para la comunidad UPN.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {destacadas.map((prod) => (
                    <TarjetaProducto key={prod.id} product={prod} isDestacada />
                  ))}
                </div>
              </section>
            )}

            {/* SECCIÓN: INNOVACIONES DEL MES (CARRUSEL) */}
            {innovacionesMes.length > 0 && (
              <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <span className="text-blue-300 text-xs font-black uppercase tracking-widest block mb-2">
                      Convocatoria & Novedades
                    </span>
                    <h2 className="text-3xl font-black">Innovaciones del Mes</h2>
                    <p className="text-blue-100/80 text-sm">
                      Nuevas herramientas y proyectos en fase de adopción y validación institucional.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollCarrusel(-1)}
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-md transition text-white"
                      title="Anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => scrollCarrusel(1)}
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-md transition text-white"
                      title="Siguiente"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                >
                  {innovacionesMes.map((prod) => (
                    <div key={prod.id} className="min-w-[300px] md:min-w-[340px] snap-start">
                      <TarjetaProducto product={prod} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECCIÓN: COLECCIÓN RECOMENDADA */}
            {recomendadas.length > 0 && (
              <section>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">
                    <Layers size={14} /> Curaduría CINNDET
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Colección Recomendada</h2>
                  <p className="text-slate-500 text-sm">
                    Recursos abiertos, simuladores formativos y talleres seleccionados para la práctica docente.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recomendadas.map((prod) => (
                    <TarjetaProducto key={prod.id} product={prod} isRecomendada />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
