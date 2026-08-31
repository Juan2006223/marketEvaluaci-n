import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* IDENTIDAD INSTITUCIONAL */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-black text-base tracking-tight">
              <span className="text-blue-500 font-extrabold">CINNDET</span> · Universidad Pedagógica Nacional
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              El Centro de Innovación y Desarrollo Educativo y Tecnológico (CINNDET) impulsa la integración pedagógica de tecnologías avanzadas, recursos abiertos e investigación formativa para toda la comunidad académica.
            </p>
          </div>

          {/* ENLACES RÁPIDOS */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">Navegación</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/" className="hover:text-white transition">Catálogo de Recursos</Link>
              </li>
              <li>
                <Link to="/guardados" className="hover:text-white transition">Recursos de Interés</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Acceso Administrativo</Link>
              </li>
            </ul>
          </div>

          {/* CONTACTO INSTITUCIONAL */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">Contacto Institucional</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <a href="mailto:cinndet@upn.edu.co" className="hover:text-white transition">cinndet@upn.edu.co</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Bogotá D.C., Colombia · UPN</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Universidad Pedagógica Nacional · Todos los derechos reservados.
          </div>
          <div>
            Plataforma Institucional de Recursos Pedagógicos y Tecnológicos
          </div>
        </div>
      </div>
    </footer>
  );
}
