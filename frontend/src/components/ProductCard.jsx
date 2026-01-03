import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductCard = ({ product, index, isDestacada, isRecomendada }) => {
    const addToCart = (e) => {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));

        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: 'Añadido al carrito',
            showConfirmButton: false,
            timer: 1500,
            background: '#1f57ff',
            color: '#fff',
            iconColor: '#fff'
        });
    };

    const delay = (index + 1) * 100;

    if (isDestacada) {
        // Bento Grid Layout Logic
        const isRowSpan = index === 0;
        const isColSpan = index === 1;

        return (
            <div
                className={`relative ${isRowSpan ? 'md:row-span-2' : ''} ${isColSpan ? 'md:col-span-2' : ''} rounded-3xl overflow-hidden shadow-2xl group scroll-reveal scale-in hover-reveal hover-scale transition-all duration-500`}
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
                        <button className={`${(product.category_slug === 'ia' || product.category_slug === 'vr') ? 'bg-yellow-400 text-black' : 'bg-[#1f57ff] text-white'} px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-transform hover:scale-105`}>
                            {Math.floor(product.price)} Tokens
                        </button>
                        <button
                            onClick={addToCart}
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
                className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${delay}ms` }}
            >
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image || product.image_url}
                        alt={product.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{product.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{product.short_description || product.description}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                        <span className="text-blue-600 font-black text-xl">{Math.floor(product.price)} <span className="text-[10px]">TKNS</span></span>
                        <button
                            onClick={addToCart}
                            className="bg-[#1f57ff] hover:bg-[#1745d0] text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-all shadow-md shadow-blue-100"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">add_shopping_cart</span>
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
            className="product-card bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl scroll-reveal scale-in group hover-reveal hover-scale transition-all duration-500"
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
                <button className="like-btn absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2.5 z-20 transition hover:scale-110 shadow-lg text-red-500">
                    <span className="material-symbols-outlined font-variation-settings-fill-1 text-[20px]">favorite</span>
                </button>
            </div>
            <div className="p-7">
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{product.title}</h3>
                <p className="text-xs text-gray-400 mb-6 line-clamp-2 leading-relaxed font-medium">{product.short_description || product.description}</p>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Inversión</span>
                        <span className="text-2xl font-black text-[#1f57ff]">{Math.floor(product.price)} <span className="text-xs font-bold text-blue-400">TOKENS</span></span>
                    </div>
                    <button
                        onClick={addToCart}
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
