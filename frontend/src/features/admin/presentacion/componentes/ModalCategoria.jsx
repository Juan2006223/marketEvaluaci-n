import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ModalCategoria({ categoria, onGuardar, onCerrar }) {
  const [form, setForm] = useState(() => ({
    name: categoria?.name || '',
    slug: categoria?.slug || '',
    description: categoria?.description || '',
    is_active: categoria ? Boolean(categoria.is_active) : true,
  }));
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const actualizados = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      // Auto-generar slug si es nueva categoría
      if (!categoria && name === 'name') {
        actualizados.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return actualizados;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'El nombre y slug de la categoría son obligatorios.',
      });
      return;
    }

    try {
      setEnviando(true);
      await onGuardar(form);
      Swal.fire({
        icon: 'success',
        title: categoria ? 'Categoría actualizada' : 'Categoría creada',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: err.response?.data?.error || JSON.stringify(err.response?.data) || err.message,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-8 my-8">
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <p className="text-xs text-slate-500">Clasificación temática de recursos educativos.</p>
          </div>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nombre de la Categoría *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ej: Inteligencia Artificial"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Slug (Identificador URL) *
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              placeholder="ej: ia-analitica"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Breve descripción del alcance de esta categoría..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="text-xs font-bold text-slate-700">Categoría Activa</span>
          </label>

          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              {enviando ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  {categoria ? 'Guardar Cambios' : 'Crear Categoría'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCerrar}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
