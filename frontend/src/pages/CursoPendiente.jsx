import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock3, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function CursoPendiente() {
  const { id } = useParams();
  const curso = useMemo(() => JSON.parse(localStorage.getItem('my_courses') || '[]').find((item) => String(item.id) === String(id)), [id]);
  const titulo = curso?.title || 'Curso institucional';
  const modulos = ['Presentación y objetivos', 'Fundamentos conceptuales', 'Aplicación pedagógica', 'Actividad de cierre'];

  return (
    <main className="min-h-[68vh] bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/mis-cursos" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700 mb-7">
          <ArrowLeft size={17} /> Volver a mis cursos
        </Link>
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="p-8 md:p-10 border-b border-slate-100">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600 mb-3">Aula CINNDET · Comunidad UPN</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 max-w-3xl">{titulo}</h1>
            <p className="mt-3 text-slate-500 max-w-2xl">Espacio de aprendizaje exclusivo para la comunidad de la Universidad Pedagógica Nacional.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 p-8 md:p-12">
            <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 min-h-72 flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-blue-700 flex items-center justify-center mb-5"><BookOpen size={23} strokeWidth={1.8} /></div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-700 mb-2">Aula en preparación</p>
              <h2 className="text-2xl font-extrabold text-slate-900">Contenido próximamente</h2>
              <p className="max-w-md text-sm leading-relaxed text-slate-500 mt-3">Los materiales, actividades y orientaciones de este curso serán publicados por CINNDET. Tu inscripción permanece registrada.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-full"><Clock3 size={15} /> En construcción</span>
            </section>
            <aside className="rounded-2xl border border-slate-200 p-6">
              <h2 className="font-extrabold text-slate-900 flex items-center gap-2"><BookOpen size={18} className="text-blue-600" /> Ruta de aprendizaje</h2>
              <ol className="mt-5 space-y-4">
                {modulos.map((modulo, indice) => (
                  <li key={modulo} className="flex gap-3 items-start text-sm">
                    <span className="w-6 h-6 shrink-0 rounded-full border border-slate-300 text-slate-500 flex items-center justify-center text-xs font-bold">{indice + 1}</span>
                    <span className="flex-1 text-slate-500">{modulo}</span>
                    <LockKeyhole size={15} className="text-slate-300 mt-0.5" />
                  </li>
                ))}
              </ol>
              <div className="mt-7 pt-5 border-t border-slate-100 text-xs text-slate-500 flex gap-2"><ShieldCheck size={16} className="text-blue-600 shrink-0" /> Acceso exclusivo comunidad UPN · progreso disponible al habilitarse el contenido.</div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
