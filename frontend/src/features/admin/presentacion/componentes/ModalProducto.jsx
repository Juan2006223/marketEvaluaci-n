import React, { useState, useEffect } from 'react';
import { X, Save, Layers, Link as LinkIcon, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { clienteHttp } from '../../../../shared/api/clienteHttp';

const SECCIONES = [
  { valor: 'destacadas', etiqueta: 'Soluciones Destacadas' },
  { valor: 'mes', etiqueta: 'Innovaciones del Mes' },
  { valor: 'recomendadas', etiqueta: 'Colección Recomendada' },
  { valor: 'general', etiqueta: 'Catálogo General' },
];

const TIPOS_RECURSO = [
  { valor: 'herramienta_digital', etiqueta: 'Herramienta Digital' },
  { valor: 'recurso_educativo', etiqueta: 'Recurso Educativo' },
  { valor: 'servicio', etiqueta: 'Servicio Institucional' },
  { valor: 'capacitacion', etiqueta: 'Capacitación / Taller' },
  { valor: 'otro', etiqueta: 'Otro' },
];

export default function ModalProducto({ producto, onGuardar, onCerrar }) {
  const [form, setForm] = useState(() => ({
    title: producto?.title || '',
    description: producto?.description || '',
    short_description: producto?.short_description || '',
    category: producto?.category_slug || producto?.category || '',
    resource_type: producto?.resource_type || 'herramienta_digital',
    price: producto?.price || 0,
    image_url: producto?.image_url || '',
    external_url: producto?.external_url || '',
    section: producto?.section || 'destacadas',
    is_featured: Boolean(producto?.is_featured),
    is_active: producto ? Boolean(producto.is_active) : true,
  }));

  const [categorias, setCategorias] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let activo = true;
    clienteHttp.get('categorias/?all=true').then((r) => {
      if (activo) setCategorias(r.data);
    });
    return () => {
      activo = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor ingresa el título y selecciona una categoría.',
      });
      return;
    }

    try {
      setEnviando(true);
      await onGuardar(form);
      Swal.fire({
        icon: 'success',
        title: producto ? 'Recurso actualizado' : 'Recurso creado',
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {producto ? 'Editar Recurso / Solución' : 'Nuevo Recurso Institucional'}
            </h2>
            <p className="text-xs text-slate-500">Completa los metadatos institucionales del recurso CINNDET.</p>
          </div>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Título del Recurso *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Ej: Laboratorio Virtual de Química"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Categoría y Tipo de Recurso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Categoría *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tipo de Recurso *
              </label>
              <select
                name="resource_type"
                value={form.resource_type}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {TIPOS_RECURSO.map((t) => (
                  <option key={t.valor} value={t.valor}>
                    {t.etiqueta}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sección de Destacados */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Sección en el Catálogo
            </label>
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {SECCIONES.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.etiqueta}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción Corta */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Descripción Corta (Resumen para tarjetas)
            </label>
            <input
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              placeholder="Resumen de una línea del recurso"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Descripción Completa */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Descripción Pedagógica Completa
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detalle pedagógico, objetivos, compatibilidad y forma de uso..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL de Imagen
              </label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL Externa / Acceso Directo
              </label>
              <input
                name="external_url"
                value={form.external_url}
                onChange={handleChange}
                placeholder="https://cinndet.upn.edu.co/..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-xs font-bold text-slate-700">Recurso Activo (Visible)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span className="text-xs font-bold text-slate-700">Marcar como Destacado Especial</span>
            </label>
          </div>

          {/* Botones de acción */}
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
                  {producto ? 'Guardar Cambios' : 'Crear Recurso'}
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
