import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useInteresContext } from '../shared/estado/useInteresContext';

const ProductCard = ({ product, index, isDestacada, isRecomendada }) => {
    const { toggleInteres, estaGuardado } = useInteresContext();
    const guardarRecurso = (e) => {
        e.preventDefault();
        const estabaGuardado = estaGuardado(product.id);
        toggleInteres(product);

        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: estabaGuardado ? 'Recurso retirado de tu lista' : 'Recurso guardado',
            showConfirmButton: false,
            timer: 1500,
            background: '#1f57ff',
            color: '#fff',
            iconColor: '#fff'
        });
    };

    const agregarAlCarrito = (e) => {
        e.preventDefault();
        const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
        const existe = carrito.find((item) => item.id === product.id);
        const nuevo = existe
            ? carrito.map((item) => item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item)
            : [...carrito, { ...product, qty: 1 }];
        localStorage.setItem('cart', JSON.stringify(nuevo));
        window.dispatchEvent(new Event('storage'));
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Curso añadido al carrito', showConfirmButton: false, timer: 1500, background: '#1f57ff', color: '#fff', iconColor: '#fff' });
    };

    const delay = (index + 1) * 100;

    if (isDestacada) {
        // Bento Grid Layout Logic
        const isRowSpan = index === 0;
        const isColSpan = index === 1;

        return (
            <div
                className={`scroll-reveal scale-in relative ${isRowSpan ? 'md:row-span-2' : ''} ${isColSpan ? 'md:col-span-2' : ''} rounded-3xl overflow-hidden shadow-2xl group hover-reveal hover-scale transition-all duration-500`}
                style={{ animationDelay: `${delay}ms` }}
            >
                <Link to={`/product/${product.id}`} className="block h-full transition-transform duration-700 ease-in-out hover:scale-105">
                    <img
                        src={product.image || product.image_url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                        alt={product.title}
                    />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 p-8 text-white w-full">
                    <h3 className={`${isRowSpan ? 'text-3xl' : 'text-xl'} font-bold mb-2`}>{product.title}</h3>
                    <p className="text-sm mb-4 opacity-90 line-clamp-2">{product.short_description || product.description}</p>
                    <div className="flex gap-3">
                        <Link to={`/product/${product.id}`} className={`${(product.category_slug === 'ia' || product.category_slug === 'vr') ? 'bg-yellow-400 text-black' : 'bg-[#1f57ff] text-white'} px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-transform hover:scale-105`}>
                            Ver curso
                        </Link>
                        <button
                            onClick={agregarAlCarrito}
                            className="bg-white/20 backdrop-blur text-white px-5 py-2 rounded-xl transition duration-300 hover:bg-white/30 border border-white/20"
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isRecomendada) {
        return (
            <div
                className="scroll-reveal fade-up group relative h-full flex flex-col bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${delay}ms` }}
            >
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image || product.image_url}
                        alt={product.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 min-h-[56px]">{product.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[40px] leading-relaxed">{product.short_description || product.description}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                        <span className="text-blue-600 font-black text-sm">{product.category_name || 'Recurso educativo'}</span>
                        <button
                            onClick={agregarAlCarrito}
                            className="bg-[#1f57ff] hover:bg-[#1745d0] text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-all shadow-md shadow-blue-100"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">shopping_cart</span>
                            <span className="text-xs font-bold font-sans">AÑADIR</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Estilo normal (para el carrusel "mes")
    return (
        <div
            className="scroll-reveal fade-up product-card bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl group hover-reveal hover-scale transition-all duration-500"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="relative overflow-hidden h-64">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image || product.image_url}
                        alt={product.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
                <span className="badge-pulse absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full z-20 uppercase tracking-widest shadow-lg">
                    {product.category_name}
                </span>
                <button onClick={(e) => guardarRecurso(e)} aria-label="Guardar en favoritos" className="like-btn absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2.5 z-20 transition hover:scale-110 shadow-lg text-red-500">
                    <span className="material-symbols-outlined font-variation-settings-fill-1 text-[20px]">favorite</span>
                </button>
            </div>
            <div className="p-7">
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{product.title}</h3>
                <p className="text-xs text-gray-400 mb-6 line-clamp-2 leading-relaxed font-medium">{product.short_description || product.description}</p>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recurso</span>
                        <span className="text-sm font-black text-[#1f57ff]">Consulta institucional</span>
                    </div>
                    <button
                        onClick={agregarAlCarrito}
                        className="bg-[#1f57ff] hover:bg-[#1745d0] text-white p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-xl font-bold">shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
