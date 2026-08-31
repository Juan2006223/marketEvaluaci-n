import React from 'react';
import { Edit3, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TablaProductos({ productos, cargando, onEditar, onEliminar }) {
  const confirmar = (id, titulo) => {
    Swal.fire({
      title: `¿Eliminar "${titulo}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (r.isConfirmed) onEliminar(id);
    });
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Cargando recursos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Recurso Institucional</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Sección / Destacado</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image_url || p.image}
                      alt={p.title}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-100 shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 truncate max-w-xs">{p.title}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">
                        {p.short_description || p.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                  {p.category_name || p.category}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {p.resource_type || 'Herramienta'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                      {p.section}
                    </span>
                    {p.is_featured && (
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                        <Sparkles size={10} /> Destacado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {p.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(p)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                      title="Editar recurso"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => confirmar(p.id, p.title)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Eliminar recurso"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {productos.length === 0 && (
        <div className="text-center py-16 text-slate-400 font-medium">
          No hay recursos registrados. Haz clic en "+ Nuevo Recurso" para crear uno.
        </div>
      )}
    </div>
  );
}
