import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, ArrowRight, BookOpen, Share2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useInteresContext } from '../../../../shared/estado/useInteresContext';

export default function RecursosInteres() {
  const { items, quitarRecurso, vaciarLista } = useInteresContext();

  const handleVaciar = () => {
    Swal.fire({
      title: '¿Vaciar recursos guardados?',
      text: 'Se eliminarán todos los recursos de tu lista de interés local.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
    }).then((res) => {
      if (res.isConfirmed) {
        vaciarLista();
        Swal.fire({
          icon: 'success',
          title: 'Lista vaciada',
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSolicitarAccesoConsolidado = () => {
    const titulos = items.map((i) => `• ${i.title}`).join('\n');
    Swal.fire({
      icon: 'success',
      title: 'Selección Registrada',
      html: `<p class='mb-2 text-sm text-slate-600'>Has seleccionado ${items.length} recursos de interés para tu labor académica:</p><pre class='text-xs bg-slate-100 p-3 rounded-lg text-left max-h-40 overflow-y-auto mb-3 font-sans'>${titulos}</pre><p class='text-xs text-slate-500'>Puedes compartir o coordinar la adopción institucional escribiendo a <a href='mailto:cinndet@upn.edu.co' class='text-blue-600 font-bold'>cinndet@upn.edu.co</a>.</p>`,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#2563eb',
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-600 mb-1">
              <Bookmark size={14} className="text-amber-500" /> Mi Colección Personal
            </div>
            <h1 className="text-3xl font-black text-slate-900">Recursos de Interés</h1>
            <p className="text-slate-500 text-sm">
              Lista guardada de herramientas, servicios y recursos formativos para tu consulta docente.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleVaciar}
                className="text-xs font-bold text-slate-600 hover:text-red-600 border border-slate-200 bg-white hover:bg-red-50 px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Vaciar Lista
              </button>
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm">
            <BookOpen size={56} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No tienes recursos guardados</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Explora el catálogo del CINNDET UPN y marca las herramientas o materiales pedagógicos que desees consultar más tarde.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition"
            >
              Explorar Catálogo Institucional <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* LISTA DE ITEMS */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((recurso) => (
                <div
                  key={recurso.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                >
                  <img
                    src={recurso.image_url}
                    alt={recurso.title}
                    className="w-full sm:w-28 h-28 object-cover rounded-xl shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {recurso.resource_type || 'Recurso'}
                      </span>
                      {recurso.category_name && (
                        <span className="text-xs text-slate-400">· {recurso.category_name}</span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 hover:text-blue-600 transition truncate mb-1">
                      <Link to={`/recurso/${recurso.id}`}>{recurso.title}</Link>
                    </h3>

                    <p className="text-slate-600 text-xs line-clamp-2 mb-3">
                      {recurso.short_description || recurso.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-bold">
                      <Link
                        to={`/recurso/${recurso.id}`}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        Ver detalles &rarr;
                      </Link>

                      {recurso.url_externa && (
                        <a
                          href={recurso.url_externa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-blue-600 transition flex items-center gap-1"
                        >
                          <ExternalLink size={13} /> Acceso directo
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => quitarRecurso(recurso.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition self-end sm:self-center"
                    title="Quitar de la lista"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* PANEL RESUMEN */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm sticky top-24 space-y-6">
                <h3 className="text-lg font-black text-slate-900">Resumen de Selección</h3>
                
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Recursos seleccionados:</span>
                    <span className="font-bold text-slate-900">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipo de acceso:</span>
                    <span className="font-bold text-emerald-600">Institucional UPN</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <button
                    onClick={handleSolicitarAccesoConsolidado}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Share2 size={16} /> Solicitar / Registrar Interés
                  </button>

                  <Link
                    to="/"
                    className="block text-center text-xs font-bold text-slate-500 hover:text-blue-600 py-1 transition"
                  >
                    + Explorar más recursos en el catálogo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
