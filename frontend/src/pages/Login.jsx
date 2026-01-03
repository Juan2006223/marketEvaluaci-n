import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // DRF Simple JWT espera 'username' por defecto. 
            // Usaremos el email como username para simplificar.
            const response = await api.post('token/', {
                username: email,
                password: password
            });

            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Decodificar info básica del usuario (opcional si el backend devuelve más)
            const userSession = {
                name: email.split('@')[0],
                role: email === 'admin@upn.edu.co' ? 'admin' : 'user',
                email
            };
            localStorage.setItem("user", JSON.stringify(userSession));
            window.dispatchEvent(new Event('storage'));

            Swal.fire({
                icon: 'success',
                title: `¡Bienvenido ${userSession.name}!`,
                showConfirmButton: false,
                timer: 1500,
                position: 'center'
            });

            setTimeout(() => {
                if (userSession.role === 'admin') navigate('/admin');
                else navigate('/');
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

            <div className="flex w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">

                {/* Panel Izquierdo - Ilustración */}
                <div className="hidden lg:flex lg:w-5/12 illustration items-center justify-center p-16 relative">
                    <div className="relative z-10 text-center space-y-8">
                        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md inline-block">
                            <img
                                src="https://www.upn.edu.co/wp-content/uploads/2025/08/Identidad-UPN-25-horizontal-blanco-fondo-transparente.png"
                                alt="UPN Logo"
                                className="w-56 brightness-0 invert"
                            />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-none">Innovación Educativa</h2>
                            <div className="h-1 w-20 bg-yellow-400 mx-auto my-6 rounded-full"></div>
                            <p className="text-blue-50 text-base leading-relaxed max-w-xs mx-auto font-medium opacity-90">
                                Plataforma integral para la gestión y transformación del aprendizaje universitario con tecnología de vanguardia.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                            <div className="text-white"><div className="text-xl font-bold">15K+</div><div className="text-[10px] uppercase opacity-60">Alumnos</div></div>
                            <div className="text-white"><div className="text-xl font-bold">500+</div><div className="text-[10px] uppercase opacity-60">Recursos</div></div>
                            <div className="text-white"><div className="text-xl font-bold">100%</div><div className="text-[10px] uppercase opacity-60">Digital</div></div>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho */}
                <div className="w-full lg:w-7/12 flex items-center justify-center bg-[#6699ff] p-8 lg:p-20 relative">
                    <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-10 lg:p-12 transform hover:scale-[1.01] transition-transform duration-500">
                        <div className="mb-10 text-center">
                            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Iniciar sesión</h1>
                            <p className="text-gray-400 font-medium">Gestiona tus herramientas educativas.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Correo institucional</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-600 transition-colors group-focus-within:text-blue-400">
                                        <span className="material-symbols-outlined text-2xl">mail</span>
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all duration-300"
                                        placeholder="nombre@upn.edu.co"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Contraseña</label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-600 transition-colors group-focus-within:text-blue-400">
                                        <span className="material-symbols-outlined text-2xl">lock</span>
                                    </span>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all duration-300"
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
                                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-bold hover:underline transition-all">¿Olvidaste tu contraseña?</a>
                            </div>

                            <button className="w-full bg-[#1f57ff] hover:bg-[#1745d0] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transform transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg mt-8">
                                Canjear Acceso
                                <span className="material-symbols-outlined font-bold">arrow_forward</span>
                            </button>
                        </form>

                        <div className="mt-10 text-center space-y-4">
                            <p className="text-gray-400 text-sm font-medium">
                                ¿Aún no tienes cuenta institucional?
                                <a href="#" className="text-blue-600 font-bold ml-2 hover:underline">Regístrate</a>
                            </p>
                            <div className="h-px bg-gray-100 w-full"></div>
                            <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest px-8 leading-relaxed">
                                Sistema de información académica UPN <br /> 2025 ®
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
