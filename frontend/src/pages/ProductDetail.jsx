import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useInteresContext } from '../shared/estado/useInteresContext';
import { BookOpen, GraduationCap, Lightbulb, Monitor } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeThumb, setActiveThumb] = useState(0);
    const { toggleInteres, estaGuardado } = useInteresContext();

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

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!product) return <div className="text-center py-20">Producto no encontrado</div>;

    // Cada recurso actualmente tiene una imagen institucional. No repetimos miniaturas
    // artificiales: cuando se incorporen más imágenes, se pueden añadir a este arreglo.
    const images = [product.image || product.image_url].filter(Boolean);
    const estaEnLista = estaGuardado(product.id);
    const agregarAlCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
        const existe = carrito.find((item) => item.id === product.id);
        const nuevo = existe
            ? carrito.map((item) => item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item)
            : [...carrito, { ...product, qty: 1 }];
        localStorage.setItem('cart', JSON.stringify(nuevo));
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <main className="container mx-auto px-6 lg:px-12 py-10">
            <Link to="/#recursos" className="inline-flex items-center gap-2 mb-6 text-sm font-bold text-blue-700 hover:text-blue-900 transition">
                <span className="material-symbols-outlined text-base">arrow_back</span> Volver al catálogo
            </Link>
            <div className="grid lg:grid-cols-3 gap-12">

                {/* Galería */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">{product.title}</h1>
                    <p className="text-gray-600 mb-6">{product.short_description || product.description}</p>
                    <div className="flex gap-6">
                    {images.length > 1 && <div className="flex flex-col gap-3">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                className={`thumb w-20 h-20 object-cover rounded-lg ${activeThumb === idx ? 'active-thumb' : ''}`}
                                onClick={() => setActiveThumb(idx)}
                                alt={`Miniatura ${idx + 1}`}
                            />
                        ))}
                    </div>}
                    <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-md p-4">
                        <img
                            src={images[activeThumb]}
                            className="w-full h-[480px] object-contain rounded-xl"
                            alt={product.title}
                        />
                    </div></div>
                </div>

                {/* Panel lateral derecho */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">{product.category_name || 'Recurso educativo'}</p>

                    <div className="flex items-center justify-between mb-3">
                        <p className="text-lg font-bold text-blue-700">Acceso institucional</p>
                        <button onClick={() => toggleInteres(product)} className="text-gray-400 hover:text-blue-600 transition" title={estaEnLista ? 'Quitar de recursos guardados' : 'Guardar recurso'}>
                            <span className="material-symbols-outlined text-3xl">{estaEnLista ? 'bookmark' : 'bookmark_add'}</span>
                        </button>
                    </div>

                    <div className="text-green-600 font-semibold text-sm mb-1">✓ Recurso disponible para consulta</div>
                    <p className="text-gray-500 text-xs mb-4">Consulta la información, condiciones y canales de acceso institucional.</p>

                    <div className="text-green-600 font-semibold text-sm mb-1">↗ Acompañamiento CINNDET</div>
                    <p className="text-gray-500 text-xs mb-4">Orientación para su incorporación en procesos educativos.</p>

                    <div className="border-t border-gray-200 my-4"></div>

                    <p className="text-gray-800 text-sm font-medium mb-2">Estado:</p>
                    <p className="text-sm text-green-600 font-semibold mb-6">✓ Disponible</p>

                    <div className="flex flex-col gap-3 mb-8">
                        <button onClick={agregarAlCarrito} className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition shadow-md text-center">
                            Añadir al carrito
                        </button>
                        {product.external_url && <a href={product.external_url} target="_blank" rel="noopener noreferrer" className="text-center text-sm font-bold text-blue-700 hover:underline py-1">
                            Ver información en la UPN
                        </a>}
                        <button
                            onClick={() => toggleInteres(product)}
                            className="bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">bookmark_add</span> {estaEnLista ? 'Quitar de recursos guardados' : 'Guardar recurso'}
                        </button>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4 text-sm">
                        <p className="font-semibold text-gray-700 mb-2">Gestionado por:</p>
                        <div className="flex items-center gap-3 mb-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/Logo_UPN_Colombia.svg" className="w-10 h-10 rounded-full border" alt="Tienda UPN" />
                            <div>
                                <p className="font-semibold text-gray-800">CINNDET · UPN</p>
                                <p className="text-xs text-gray-500">Innovación y desarrollo educativo</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-5">
                            Este recurso hace parte de la oferta institucional de innovación educativa y tecnológica de la UPN.
                        </p>
                    </div>
                </div>
            </div>

            {/* Características y detalles */}
            <div className="mt-12 border-t border-gray-200 pt-8 max-w-4xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Descripción y posibilidades de uso</h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex gap-3"><BookOpen size={19} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={1.8} /><span>{product.description || 'Recurso orientado al fortalecimiento de procesos educativos.'}</span></li>
                    <li className="flex gap-3"><Lightbulb size={19} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={1.8} /><span>Puede incorporarse a iniciativas de innovación pedagógica y tecnológica.</span></li>
                    <li className="flex gap-3"><Monitor size={19} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={1.8} /><span>Consulte sus condiciones de acceso y compatibilidad antes de su implementación.</span></li>
                    <li className="flex gap-3"><GraduationCap size={19} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={1.8} /><span>El CINNDET acompaña la apropiación institucional cuando corresponda.</span></li>
                </ul>
            </div>
        </main>
    );
};

export default ProductDetail;
