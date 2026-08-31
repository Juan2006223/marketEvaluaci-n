import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Tags, Home, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

export default function SidebarAdmin({ pestanaActiva, onCambiarPestana, onCerrarSesion }) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 shadow-xl shrink-0">
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
          <ShieldCheck size={12} /> Administración
        </div>
        <h2 className="text-xl font-black tracking-tight">CINNDET UPN</h2>
        <p className="text-xs text-slate-400">Panel de Control</p>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onCambiarPestana('productos')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition ${
            pestanaActiva === 'productos'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Package size={18} /> Recursos / Productos
        </button>

        <button
          onClick={() => onCambiarPestana('categorias')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition ${
            pestanaActiva === 'categorias'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Tags size={18} /> Categorías
        </button>

        <div className="pt-6 mt-6 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm transition"
          >
            <Home size={18} /> Ver Catálogo Público
          </Link>
        </div>
      </nav>

      <button
        onClick={onCerrarSesion}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold text-sm transition mt-auto"
      >
        <LogOut size={18} /> Cerrar Sesión
      </button>
    </aside>
  );
}
