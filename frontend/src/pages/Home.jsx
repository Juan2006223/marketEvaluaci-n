import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductos } from '../features/productos/presentacion/hooks/useProductos';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const { productos: products, cargando: loading } = useProductos();
    const [searchParams] = useSearchParams();
    const [monthCategory, setMonthCategory] = useState('all');
    const carouselRef = useRef(null);

    useEffect(() => {
        if (!loading) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            }, observerOptions);

            const revealElements = document.querySelectorAll('.scroll-reveal');
            revealElements.forEach(el => observer.observe(el));

            return () => observer.disconnect();
        }
    }, [loading, products]);

    const scrollMonthProducts = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 360;
            carouselRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const searchText = (searchParams.get('buscar') || '').toLocaleLowerCase('es-CO');
    const selectedCategory = searchParams.get('categoria') || 'todo';
    const coincideBusqueda = (p) => {
        const texto = `${p.title} ${p.short_description} ${p.description} ${p.category_name}`.toLocaleLowerCase('es-CO');
        return (!searchText || texto.includes(searchText)) && (selectedCategory === 'todo' || p.category_slug === selectedCategory);
    };
    const catalogo = products.filter(coincideBusqueda);
    const destacadas = catalogo.filter(p => p.section === 'destacadas');
    const mesOriginal = catalogo.filter(p => p.section === 'mes');
    const mes = (mesOriginal.length ? mesOriginal : catalogo).filter(p => monthCategory === 'all' || p.category_slug === monthCategory);
    const recomendadas = catalogo.filter(p => p.section === 'recomendadas');

    return (
        <div className="bg-gray-50">
            {/* ================= HERO ================= */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="container mx-auto grid md:grid-cols-2 gap-16 px-6 relative z-10 items-center">
                    <div className="space-y-8">
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg scroll-reveal fade-up">
                            <span className="text-xl">✨</span>
                            Innovación Educativa 2025
                        </span>

                        <h1 className="text-6xl md:text-7xl font-black leading-tight scroll-reveal fade-up delay-100">
                            Una nueva forma de
                            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                aprender y obtener conocimiento
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-xl scroll-reveal fade-up delay-200">
                            EduTech te lleva por todo el mundo con cursos y conocimiento que mejoran tu vida y tu carrera.
                        </p>

                        <div className="flex flex-wrap gap-4 scroll-reveal fade-up delay-300">
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2">
                                Comenzar
                                <span className="material-symbols-outlined font-bold">arrow_forward</span>
                            </button>
                            <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                                Ver más
                            </button>
                        </div>

                        <div className="flex gap-8 pt-8 border-t border-gray-200 scroll-reveal fade-up delay-400">
                            <div>
                                <div className="text-3xl font-black text-gray-900">15.2K</div>
                                <div className="text-sm text-gray-500 font-medium">Estudiantes antiguos</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-900">4.5K</div>
                                <div className="text-sm text-gray-500 font-medium">Clases</div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} className="material-symbols-outlined text-yellow-400 text-2xl filled">star</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 scroll-reveal scale-in delay-200">
                                <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=500&fit=crop" className="w-full h-80 object-cover" alt="VR" />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur flex items-center justify-center font-bold text-[10px]">VR</div>
                                        <span className="text-sm font-semibold">Realidad Virtual</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 mt-12 scroll-reveal scale-in delay-300">
                                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop" className="w-full h-56 object-cover" alt="AI" />
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                                    <span className="material-symbols-outlined text-purple-600 text-xl font-bold">psychology</span>
                                </div>
                            </div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 -mt-6 scroll-reveal scale-in delay-400">
                                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop" className="w-full h-72 object-cover" alt="Apps" />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-lg rounded-2xl p-3 border border-white/30 text-white font-bold text-xs flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">devices</span> Apps Educativas
                                </div>
                            </div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 scroll-reveal scale-in delay-500">
                                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop" className="w-full h-56 object-cover" alt="Gamification" />
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= PRODUCTOS DESTACADAS ================= */}
            <section id="recursos" className="py-20 px-6 bg-white">
                <div className="container mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-black mb-4 scroll-reveal fade-up">Soluciones Destacadas</h2>
                        <p className="text-gray-500 scroll-reveal fade-up delay-100">Las herramientas más potentes para transformar tu metodología de enseñanza.</p>
                    </div>
                    <div id="products-grid" className="grid md:grid-cols-3 gap-8 auto-rows-[300px]">
                        {(destacadas.length ? destacadas : catalogo.slice(0, 3)).map((p, idx) => (
                            <ProductCard key={p.id} product={p} index={idx} isDestacada={true} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= PRODUCTOS DEL MES ================= */}
            <section className="py-20 px-6 bg-gray-50 overflow-hidden">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 scroll-reveal fade-up">
                        <div>
                            <h2 className="text-4xl font-black mb-2">Innovaciones del Mes</h2>
                            <p className="text-gray-500">Descubre lo último en tecnología educativa.</p>
                        </div>
                        <div className="flex gap-2 mt-6 md:mt-0">
                            <button onClick={() => scrollMonthProducts(-1)} className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg hover:bg-gray-50 transition-all active:scale-95 text-blue-600">
                                <span className="material-symbols-outlined font-bold">chevron_left</span>
                            </button>
                            <button onClick={() => scrollMonthProducts(1)} className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg hover:bg-gray-50 transition-all active:scale-95 text-blue-600">
                                <span className="material-symbols-outlined font-bold">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide scroll-reveal fade-up delay-100">
                        {['all', 'ia', 'gamificacion', 'vr', 'apps'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setMonthCategory(cat)}
                                className={`category-filter px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap uppercase tracking-wider ${monthCategory === cat ? 'active' : 'bg-white border border-gray-100 text-gray-500 hover:border-blue-200'}`}
                            >
                                {cat === 'all' ? 'Ver Todo' : cat.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div ref={carouselRef} id="month-products-carousel" className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-8 px-4 -mx-4">
                        {mes.length > 0 ? mes.map((p, idx) => (
                            <div key={p.id} className="min-w-[360px] snap-start scroll-reveal scale-in">
                                <ProductCard product={p} index={idx} />
                            </div>
                        )) : (
                            <div className="w-full py-20 text-center text-gray-400 italic">No hay productos en esta categoría este mes.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= COLECCIÓN RECOMENDADA ================= */}
            <section className="py-20 px-6 bg-white border-t border-gray-100">
                <div className="container mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-black mb-4 scroll-reveal fade-up">Colección Recomendada</h2>
                        <p className="text-gray-500 scroll-reveal fade-up delay-100">Selección curada por expertos investigadores para el éxito docente.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(recomendadas.length ? recomendadas : catalogo.slice(0, 4)).map((p, idx) => (
                            <div key={p.id} className="scroll-reveal fade-up">
                                <ProductCard product={p} index={idx} isRecomendada={true} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
