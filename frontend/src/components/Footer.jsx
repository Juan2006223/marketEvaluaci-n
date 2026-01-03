import React from 'react';
import { Mail, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-gray-300 pt-20 pb-10 relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-white p-2 rounded-2xl shadow-xl transition-transform group-hover:rotate-6">
                                <img
                                    src="https://www.upn.edu.co/wp-content/uploads/2025/08/Identidad-UPN-25-horizontal-azul-fondo-transparente.png"
                                    alt="UPN Logo"
                                    className="h-12 object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 font-medium">
                            Liderando la transformación digital en la educación pedagógica. Recursos de alta calidad diseñados para el aula del futuro.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1 border border-white/5">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-extrabold mb-8 uppercase tracking-widest text-xs">Explorar Mercado</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'IA & Analítica', link: '#' },
                                { name: 'Gamificación', link: '#' },
                                { name: 'Realidad Virtual', link: '#' },
                                { name: 'Apps Educativas', link: '#' },
                                { name: 'Panel Admin', link: '/admin' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.link} className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-extrabold mb-8 uppercase tracking-widest text-xs">Soporte & Ayuda</h4>
                        <ul className="space-y-4">
                            {['Guía de Compra', 'Tokens EduTech', 'Términos Legales', 'Privacidad', 'Contacto'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm hover:text-blue-400 transition-colors block">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Institucional */}
                    <div>
                        <h4 className="text-white font-extrabold mb-8 uppercase tracking-widest text-xs">Sede Principal</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
                                    <MapPin size={20} />
                                </div>
                                <span className="text-gray-400">Calle 72 No. 11 - 86<br />Bogotá D.C., Colombia</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-green-600/10 text-green-500">
                                    <Phone size={20} />
                                </div>
                                <span className="text-gray-400">+57 (601) 594 1894</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-purple-600/10 text-purple-500">
                                    <Mail size={20} />
                                </div>
                                <span className="text-gray-400">edutech@upn.edu.co</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-sm text-gray-500">
                        <span className="font-bold text-gray-400">© 2025 Universidad Pedagógica Nacional</span>
                        <span className="mx-2 text-gray-700">|</span>
                        <span>Desarrollado para Innovación Educativa</span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                        <Globe size={16} className="text-blue-500 group-hover:animate-spin-slow" />
                        <span className="text-xs font-bold text-gray-400">ESPAÑOL (CO)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
