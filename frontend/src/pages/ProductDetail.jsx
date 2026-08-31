import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeThumb, setActiveThumb] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`productos/${id}/`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!product) return <div className="text-center py-20">Producto no encontrado</div>;

    const images = [product.image || product.image_url, product.image || product.image_url, product.image || product.image_url];

    return (
        <main className="container mx-auto px-6 lg:px-12 py-12">
            <div className="grid lg:grid-cols-3 gap-12">

                {/* Galería */}
                <div className="lg:col-span-2 flex gap-6">
                    <div className="flex flex-col gap-3">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={`thumb w-20 h-20 object-cover rounded-lg ${activeThumb === idx ? 'active-thumb' : ''}`}
                                onClick={() => setActiveThumb(idx)}
                                alt={`Miniatura ${idx + 1}`}
                            />
                        ))}
                    </div>
                    <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-md p-4">
                        <img
                            src={images[activeThumb]}
                            className="w-full h-[480px] object-contain"
                            alt={product.title}
                        />
                    </div>
                </div>

                {/* Panel lateral derecho */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{product.title}</h1>
                    <p className="text-gray-600 text-sm mb-4">{product.short_description || product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                        <p className="text-3xl font-bold text-blue-700">{Math.floor(product.price)} Tokens</p>
                        <button className="text-gray-400 hover:text-red-500 transition">
                            <span className="material-symbols-outlined text-3xl">favorite</span>
                        </button>
                    </div>

                    <div className="text-green-600 font-semibold text-sm mb-1">✔ Envío gratis a todo el país</div>
                    <p className="text-gray-500 text-xs mb-4">Entrega en 24 – 48 h según tu ubicación</p>

                    <div className="text-green-600 font-semibold text-sm mb-1">↩ Devolución garantizada</div>
                    <p className="text-gray-500 text-xs mb-4">Tienes 30 días para cambios o reembolsos</p>

                    <div className="border-t border-gray-200 my-4"></div>

                    <p className="text-gray-800 text-sm font-medium mb-2">Disponibilidad:</p>
                    <p className="text-sm text-green-600 font-semibold mb-6">✅ En stock (disponibles)</p>

                    <div className="flex flex-col gap-3 mb-8">
                        <button className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition shadow-md">
                            Comprar ahora
                        </button>
                        <button
                            onClick={addToCart}
                            className="bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">add_shopping_cart</span> Agregar al carrito
                        </button>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4 text-sm">
                        <p className="font-semibold text-gray-700 mb-2">Vendido por:</p>
                        <div className="flex items-center gap-3 mb-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/Logo_UPN_Colombia.svg" className="w-10 h-10 rounded-full border" alt="Tienda UPN" />
                            <div>
                                <p className="font-semibold text-gray-800">Tienda oficial UPN</p>
                                <p className="text-xs text-gray-500">+1 000 ventas · Garantía académica</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-5">
                            Todos los productos están respaldados por UPN EduTech y cuentan con garantía de calidad y soporte institucional.
                        </p>
                    </div>
                </div>
            </div>

            {/* Características y detalles */}
            <div className="mt-12 border-t border-gray-200 pt-8 max-w-4xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Características del producto</h2>
                <ul className="space-y-2 text-gray-700">
                    <li>📘 Acceso ilimitado a los módulos del curso.</li>
                    <li>🧠 Recursos descargables y evaluaciones interactivas.</li>
                    <li>💻 Compatible con plataformas LMS y móviles.</li>
                    <li>🎓 Soporte técnico permanente.</li>
                </ul>
            </div>
        </main>
    );
};

export default ProductDetail;
