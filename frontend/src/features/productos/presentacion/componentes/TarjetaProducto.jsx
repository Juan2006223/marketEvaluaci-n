import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { useInteresContext } from '../../../../shared/estado/useInteresContext';

export default function TarjetaProducto({ product, isDestacada = false }) {
  const { toggleInteres, estaGuardado } = useInteresContext();
  const guardado = estaGuardado(product.id);

  const tipoColores = {
    herramienta_digital: 'bg-blue-100 text-blue-800 border-blue-200',
    recurso_educativo:   'bg-emerald-100 text-emerald-800 border-emerald-200',
    servicio:            'bg-purple-100 text-purple-800 border-purple-200',
    capacitacion:        'bg-amber-100 text-amber-800 border-amber-200',
    otro:                'bg-gray-100 text-gray-800 border-gray-200',
  };

  const badgeColor = tipoColores[product.resource_type] || tipoColores.otro;

  return (
    <div
      className={`group relative bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${
        isDestacada ? 'hover:-translate-y-1' : ''
      }`}
    >
      {/* Contenedor de Imagen */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop';
          }}
        />

        {/* Botón de Guardar en Interés */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleInteres(product);
          }}
          title={guardado ? 'Quitar de recursos de interés' : 'Guardar en recursos de interés'}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            guardado
              ? 'bg-amber-500 text-white hover:bg-amber-600 scale-105'
              : 'bg-white/85 text-slate-600 hover:text-amber-500 hover:bg-white'
          }`}
        >
          <Bookmark size={18} fill={guardado ? 'currentColor' : 'none'} />
        </button>

        {/* Badge de Categoría y Sección */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {product.category_name && (
            <span className="bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
              {product.category_name}
            </span>
          )}
          {product.is_featured && (
            <span className="bg-indigo-600/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> Destacado
            </span>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tipo de recurso */}
          <div className="mb-2">
            <span className={`inline-block border text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${badgeColor}`}>
              {product.tipoEtiqueta ? product.tipoEtiqueta() : product.resource_type}
            </span>
          </div>

          {/* Título */}
          <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            <Link to={`/recurso/${product.id}`}>{product.title}</Link>
          </h3>

          {/* Descripción Corta */}
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Acciones */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/recurso/${product.id}`}
            className="text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1 uppercase tracking-wider group-hover:underline"
          >
            Ver Recurso &rarr;
          </Link>

          {product.url_externa && (
            <a
              href={product.url_externa}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-600 transition-colors p-1"
              title="Acceso directo institucional"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
