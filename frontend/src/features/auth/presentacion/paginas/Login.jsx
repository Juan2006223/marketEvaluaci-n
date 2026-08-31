import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setCargando(true);
      const sesion = await iniciarSesion(email, password);

      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido(a), ${sesion.nombre}!`,
        text: sesion.rol === 'admin' ? 'Acceso concedido al panel administrativo.' : 'Sesión iniciada correctamente.',
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        if (sesion.rol === 'admin' || sesion.is_staff) {
          navigate('/admin');
        } else {
          navigate('/mis-cursos');
        }
      }, 1500);
    } catch (error) {
      console.error('Error de login:', error);
      const mensaje =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'Credenciales inválidas. Por favor verifica tu correo institucional y contraseña.';
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: mensaje,
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-100 flex items-center justify-center p-4 md:p-8">
      <div className="flex w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-slate-200">
        
        {/* PANEL IZQUIERDO INSTITUCIONAL */}
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-md">
              <Sparkles size={12} className="text-amber-400" />
              CINNDET · UPN
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-snug mb-4">
              Portal de Administración y Acceso Institucional
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Gestión centralizada de recursos pedagógicos, herramientas digitales e innovaciones educativas de la Universidad Pedagógica Nacional.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck size={18} className="text-blue-400 shrink-0" />
              <span>Autenticación institucional segura</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Universidad Pedagógica Nacional · Colombia
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: FORMULARIO */}
        <div className="w-full lg:w-7/12 p-8 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Iniciar Sesión</h1>
              <p className="text-slate-500 text-sm">
                Ingresa con tu correo institucional o usuario autorizado.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Usuario o Correo Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@upn.edu.co"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 mt-4"
              >
                {cargando ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} /> Acceder al Sistema
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <Link to="/" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition">
                &larr; Volver al catálogo público
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
