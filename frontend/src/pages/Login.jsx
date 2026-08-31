import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../features/auth/presentacion/hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { iniciarSesion, iniciarSesionGoogle } = useAuth();
    const googleButtonRef = useRef(null);
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (!googleClientId || !googleButtonRef.current) return undefined;
        const cargarBoton = () => {
            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: async ({ credential }) => {
                    try {
                        const sesion = await iniciarSesionGoogle(credential);
                        Swal.fire({ icon: 'success', title: `¡Bienvenido ${sesion.nombre || sesion.username}!`, timer: 1200, showConfirmButton: false });
                        setTimeout(() => navigate(sesion.is_staff ? '/admin' : '/mis-cursos'), 1200);
                    } catch (error) {
                        Swal.fire({ icon: 'error', title: 'No fue posible ingresar con Google', text: error.response?.data?.error || 'Inténtalo de nuevo.', confirmButtonColor: '#2563eb' });
                    }
                },
            });
            window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large', text: 'continue_with', width: 390 });
        };
        if (window.google?.accounts?.id) cargarBoton();
        else {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.onload = cargarBoton;
            document.head.appendChild(script);
            return () => script.remove();
        }
        return undefined;
    }, [googleClientId, iniciarSesionGoogle, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userSession = await iniciarSesion(email, password);

            Swal.fire({
                icon: 'success',
                title: `¡Bienvenido ${userSession.nombre || userSession.username}!`,
                showConfirmButton: false,
                timer: 1500,
                position: 'center'
            });

            setTimeout(() => {
                if (userSession.rol === 'admin' || userSession.is_staff) navigate('/admin');
                else navigate('/mis-cursos');
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de acceso',
                text: error.response?.data?.detail || 'Credenciales inválidas. Verifica tu correo y contraseña.',
                confirmButtonColor: '#2563eb'
            });
        }
    };

    return (
        <div className="min-h-screen login-body flex items-center justify-center p-4">
            <style>{`
        .login-body {
          background-image: url('https://images.unsplash.com/photo-1554356391-8bbd5018add1?q=80&w=1287&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .illustration {
            background: linear-gradient(135deg, #0B5FFF 0%, #0A4DE0 100%);
            position: relative;
            overflow: hidden;
        }
        .illustration::before {
            content: "";
            position: absolute;
            width: 500px;
            height: 500px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            top: -150px;
            right: -150px;
        }
      `}</style>

            <div className="flex w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl">

                {/* Panel Izquierdo - Ilustración */}
                <div className="hidden lg:flex lg:w-5/12 illustration items-center justify-center p-12 relative">
                    <div className="relative z-10 text-center">
                        <div className="mb-12">
                            <img
                                src="https://www.upn.edu.co/wp-content/uploads/2025/08/Identidad-UPN-25-horizontal-blanco-fondo-transparente.png"
                                alt="UPN Logo"
                                className="w-56 brightness-0 invert"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Innovación Educativa</h2>
                            <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto">
                                Plataforma integral para la gestión y transformación del aprendizaje universitario.
                            </p>
                        </div>
                        <div className="flex gap-5 justify-center mt-12 text-white text-base" aria-label="Redes institucionales">
                            <span>●</span><span>●</span><span>●</span>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho */}
                <div className="w-full lg:w-7/12 flex items-center justify-center bg-[#6699ff] p-8 lg:p-16">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 transition-all duration-300 hover:shadow-lg">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar sesión</h1>
                            <p className="text-gray-500 text-sm">Desbloquea tu mundo.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario o correo institucional</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-600 transition-colors group-focus-within:text-blue-400">
                                        <span className="material-symbols-outlined text-2xl">mail</span>
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                                        placeholder="nombre@upn.edu.co o usuario"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-600 transition-colors group-focus-within:text-blue-400">
                                        <span className="material-symbols-outlined text-2xl">lock</span>
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="w-5 h-5 border-2 border-gray-200 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                                        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-xs font-bold leading-none">check</span>
                                    </div>
                                    <span className="text-gray-500 text-sm font-semibold group-hover:text-gray-700 transition-colors">Recordarme</span>
                                </label>
                                <a href="#recuperar" className="text-blue-600 hover:text-blue-700 text-sm font-medium">¿Olvidaste tu contraseña?</a>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 text-sm mt-8">
                                <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                Iniciar sesión
                            </button>
                        </form>

                        <div className="mt-10 text-center space-y-4">
                            {googleClientId ? (
                                <>
                                    <div className="relative"><div className="absolute inset-0 flex items-center items-center"><div className="w-full border-t border-gray-100" /></div><span className="relative bg-white px-3 text-xs text-gray-400">o continúa con</span></div>
                                    <div ref={googleButtonRef} className="flex justify-center" />
                                </>
                            ) : (
                                <p className="text-xs text-gray-400">El acceso con Google se habilitará al finalizar la configuración institucional.</p>
                            )}
                            <p className="text-gray-600 text-sm font-medium">
                                ¿No tienes cuenta? <span className="text-blue-600 font-medium">Regístrate aquí</span>
                            </p>
                            <div className="h-px bg-gray-100 w-full"></div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                © 2025 UPN EduTech. Plataforma de Innovación Educativa
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
