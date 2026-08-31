import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, ArrowRight } from 'lucide-react';

export default function MisCursos() {
  const [cursos] = useState(() => JSON.parse(localStorage.getItem('my_courses') || '[]'));

  return (
    <main className="min-h-[65vh] bg-slate-50 py-10 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Panel del estudiante</p>
          <h1 className="text-3xl font-black text-slate-900">Mis cursos y recursos</h1>
          <p className="text-slate-500 mt-1">Continúa tu proceso de aprendizaje y consulta los recursos adquiridos.</p>
        </div>
        {cursos.length === 0 ? (
          <section className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
            <BookOpen size={56} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-900">Aún no tienes cursos inscritos</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">Explora el catálogo, añade un curso al carrito y finaliza la inscripción.</p>
            <Link to="/#recursos" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition">
              Explorar catálogo <ArrowRight size={17} />
            </Link>
          </section>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso) => (
              <article key={curso.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition">
                <img src={curso.image || curso.image_url} alt={curso.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{curso.category_name || 'Curso'}</p>
                  <h2 className="font-extrabold text-slate-900 text-lg leading-snug">{curso.title}</h2>
                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>Progreso</span><span>{curso.progreso || 0}%</span></div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${curso.progreso || 0}%` }} /></div>
                  </div>
                  <Link to={`/product/${curso.id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800">
                    <PlayCircle size={18} /> Continuar curso
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
