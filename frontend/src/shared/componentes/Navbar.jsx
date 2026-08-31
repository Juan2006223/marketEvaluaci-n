import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, User, LogOut, ShieldCheck, LogIn, Menu, X, Sparkles } from 'lucide-react';
import { useAuthContext } from '../estado/useAuthContext';
import { useInteresContext } from '../estado/useInteresContext';

export default function Navbar() {
  const { usuario, cerrarSesion, esAdmin } = useAuthContext();
  const { cantidad } = useInteresContext();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    setPerfilAbierto(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="container mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between">
        
        {/* LOGO INSTITUCIONAL UPN & CINNDET */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://www.upn.edu.co/wp-content/uploads/2025/08/Identidad-UPN-25-horizontal-azul-fondo-transparente.png"
            alt="Logo Universidad Pedagógica Nacional"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="border-l border-slate-300 pl-3">
            <span className="text-sm font-black tracking-tight text-slate-900 block leading-tight">
              MARKETPLACE
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 block">
              CINNDET · UPN
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN DE ESCRITORIO */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition">
            Catálogo
          </Link>

          <Link
            to="/guardados"
            className="relative flex items-center gap-1.5 hover:text-blue-600 transition"
          >
            <Bookmark size={17} className={cantidad > 0 ? 'text-amber-500 fill-amber-500' : ''} />
            <span>Recursos de Interés</span>
            {cantidad > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {cantidad}
              </span>
            )}
          </Link>

          {esAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl transition"
            >
              <ShieldCheck size={16} /> Panel Admin
            </Link>
          )}
        </nav>

        {/* PERFIL / LOGIN */}
        <div className="hidden md:flex items-center gap-4">
          {usuario ? (
            <div className="relative">
              <button
                onClick={() => setPerfilAbierto(!perfilAbierto)}
                className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 transition border border-slate-200"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left pr-2">
                  <div className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">
                    {usuario.nombre}
                  </div>
                  <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                    {usuario.rol === 'admin' ? 'Administrador' : 'Usuario UPN'}
                  </div>
                </div>
              </button>

              {/* MENÚ DESPLEGABLE */}
              {perfilAbierto && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 text-xs">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Cuenta activa</p>
                    <p className="text-slate-800 font-extrabold truncate">{usuario.email}</p>
                  </div>

                  {esAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setPerfilAbierto(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      <ShieldCheck size={15} /> Panel Administrativo
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={15} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-slate-900 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              <LogIn size={15} /> Acceso Institucional
            </Link>
          )}
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
        >
          {menuAbierto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuAbierto(false)}
            className="block text-sm font-bold text-slate-700 py-2"
          >
            Catálogo
          </Link>
          <Link
            to="/guardados"
            onClick={() => setMenuAbierto(false)}
            className="flex items-center justify-between text-sm font-bold text-slate-700 py-2"
          >
            <span>Recursos de Interés</span>
            {cantidad > 0 && (
              <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {cantidad}
              </span>
            )}
          </Link>
          {esAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuAbierto(false)}
              className="block text-sm font-bold text-blue-600 py-2"
            >
              Panel Administrativo
            </Link>
          )}
          <div className="pt-3 border-t border-slate-100">
            {usuario ? (
              <button
                onClick={() => {
                  setMenuAbierto(false);
                  handleLogout();
                }}
                className="w-full text-left text-sm font-bold text-red-600 py-2"
              >
                Cerrar Sesión ({usuario.nombre})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuAbierto(false)}
                className="block text-center bg-blue-600 text-white font-bold text-sm py-2.5 rounded-xl"
              >
                Acceso Institucional
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
