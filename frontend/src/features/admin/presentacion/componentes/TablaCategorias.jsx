import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TablaCategorias({ categorias, cargando, onEditar, onEliminar }) {
  const confirmar = (id, nombre) => {
    Swal.fire({
      title: `¿Eliminar categoría "${nombre}"?`,
      text: 'Los recursos vinculados a esta categoría podrían verse afectados.',
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
        <p className="text-slate-400 text-sm">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nombre de Categoría</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {categorias.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50/50 rounded">{c.slug}</td>
                <td className="px-6 py-4 text-slate-500 text-xs max-w-sm truncate">
                  {c.description || 'Sin descripción'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {c.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(c)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                      title="Editar categoría"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => confirmar(c.id, c.name)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Eliminar categoría"
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
      {categorias.length === 0 && (
        <div className="text-center py-16 text-slate-400 font-medium">
          No hay categorías registradas. Haz clic en "+ Nueva Categoría" para crear una.
        </div>
      )}
    </div>
  );
}
