import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, ExternalLink, ArrowLeft, CheckCircle2, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { obtenerProducto } from '../../api/repositorio';
import { useInteresContext } from '../../../../shared/estado/useInteresContext';

export default function DetalleRecurso() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { toggleInteres, estaGuardado } = useInteresContext();

  useEffect(() => {
    let activo = true;
    const fetchRecurso = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await obtenerProducto(id);
        if (activo) setProducto(data);
      } catch (err) {
        if (activo) setError(err.response?.data?.error || 'Recurso no encontrado.');
      } finally {
        if (activo) setCargando(false);
      }
    };
    fetchRecurso();
    return () => {
      activo = false;
    };
  }, [id]);

  const handleSolicitarInfo = () => {
    Swal.fire({
      icon: 'info',
      title: 'Acompañamiento Pedagógico CINNDET',
      html: `Para solicitar inducción, integración curricular o acceso avanzado a <b>${producto?.title}</b>, contacta a la coordinación de innovación educativa al correo institucional <a href="mailto:cinndet@upn.edu.co" class="text-blue-600 font-bold underline">cinndet@upn.edu.co</a>.`,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#2563eb',
    });
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Cargando información del recurso...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Recurso no encontrado</h2>
        <p className="text-slate-500 mb-6">{error || 'El recurso solicitado no existe o fue desactivado.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition"
        >
          <ArrowLeft size={16} /> Volver al Catálogo
        </Link>
      </div>
    );
  }

  const guardado = estaGuardado(producto.id);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition">Inicio</Link>
          <span>/</span>
          <span>{producto.category_name || 'Categoría'}</span>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-xs">{producto.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* COLUMNA IZQUIERDA: IMAGEN Y DETALLES PEDAGÓGICOS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm overflow-hidden">
              <img
                src={producto.image_url}
                alt={producto.title}
                className="w-full h-80 md:h-96 object-cover rounded-2xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop';
                }}
              />
            </div>

            {/* DESCRIPCIÓN COMPLETA */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4">Descripción Pedagógica y Técnica</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {producto.description || producto.short_description || 'Sin descripción detallada disponible.'}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 grid sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Validado por el comité de innovación pedagógica</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Compatible con entornos virtuales Moodle UPN</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Acceso disponible para docentes y estudiantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Licenciamiento institucional / uso académico</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: METADATOS Y ACCIONES */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm sticky top-24">
              {/* BADGES */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {producto.tipoEtiqueta ? producto.tipoEtiqueta() : producto.resource_type}
                </span>
                {producto.category_name && (
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                    {producto.category_name}
                  </span>
                )}
                {producto.is_featured && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} /> Destacado
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
                {producto.title}
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {producto.short_description || producto.description}
              </p>

              {/* BOTONES DE ACCIÓN */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {producto.url_externa && (
                  <a
                    href={producto.url_externa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition transform active:scale-98"
                  >
                    <ExternalLink size={18} />
                    Acceder al Recurso Institucional
                  </a>
                )}

                <button
                  onClick={() => toggleInteres(producto)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 border transition ${
                    guardado
                      ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark size={18} fill={guardado ? 'currentColor' : 'none'} className={guardado ? 'text-amber-600' : 'text-slate-400'} />
                  {guardado ? 'Guardado en Recursos de Interés' : 'Guardar en Recursos de Interés'}
                </button>

                <button
                  onClick={handleSolicitarInfo}
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 hover:text-blue-600 transition flex items-center justify-center gap-1.5"
                >
                  <HelpCircle size={14} />
                  Solicitar asesoría de adopción pedagógica
                </button>
              </div>

              {/* RESPALDO INSTITUCIONAL */}
              <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-3xl flex items-start gap-3">
                <ShieldCheck size={24} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-900 mb-0.5">Centro CINNDET · UPN</p>
                  Recurso validado para el apoyo a la docencia, investigación y proyección formativa universitaria.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
