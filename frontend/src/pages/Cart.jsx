import React, { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Cart = () => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setItems(cart);
    }, []);

    const updateQty = (id, delta) => {
        const newItems = items.map(item => {
            if (item.id === id) {
                return { ...item, qty: Math.max(1, item.qty + delta) };
            }
            return item;
        });
        setItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
        window.dispatchEvent(new Event('storage'));
    };

    const removeItem = (id) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        localStorage.setItem('cart', JSON.stringify(newItems));
        window.dispatchEvent(new Event('storage'));
    };

    const clearCart = () => {
        Swal.fire({
            title: '¿Vaciar carrito?',
            text: 'Se eliminarán todos los productos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setItems([]);
                localStorage.setItem('cart', '[]');
                window.dispatchEvent(new Event('storage'));
                Swal.fire('¡Vacío!', 'Tu carrito ahora está libre.', 'success');
            }
        });
    };

    const handleCheckout = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            Swal.fire({
                title: 'Inicia sesión',
                text: 'Debes estar autenticado para finalizar la compra.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Ir al Login',
                confirmButtonColor: '#2563eb'
            }).then((res) => {
                if (res.isConfirmed) navigate('/login');
            });
            return;
        }

        Swal.fire({
            title: '¡Compra exitosa!',
            text: 'Se han canjeado tus tokens por los recursos educativos.',
            icon: 'success',
            confirmButtonColor: '#10b981'
        }).then(() => {
            setItems([]);
            localStorage.setItem('cart', '[]');
            window.dispatchEvent(new Event('storage'));
            navigate('/');
        });
    };

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <main className="container mx-auto px-6 lg:px-12 py-10 min-h-[60vh]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <span className="material-symbols-outlined text-4xl text-gray-800">shopping_bag</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Carrito de Compras</h1>
                    <span className="text-sm text-gray-500 ml-auto font-medium">{items.length} productos</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-5">
                        {items.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-slide-in">
                                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">remove_shopping_cart</span>
                                <p className="text-gray-500 text-lg font-medium">No hay nada por aquí...</p>
                                <Link to="/" className="text-blue-600 font-bold hover:underline mt-4 inline-block">Explorar herramientas</Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.image || item.image_url}
                                                alt={item.title}
                                                className="w-48 h-48 object-contain rounded-xl cursor-pointer transition-transform duration-500 hover:scale-105"
                                                onClick={() => navigate(`/product/${item.id}`)}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                                                <p className="text-sm text-gray-400 mb-3">{item.category_name}</p>
                                                <p className="text-2xl font-black text-[#1f57ff] mb-4">{Math.floor(item.price)} <span className="text-sm font-bold">TOKENS</span></p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-lg">−</button>
                                                <span className="w-12 text-center font-black text-xl">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-lg">+</button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between min-w-[130px]">
                                            <span className="text-2xl font-black text-gray-900">{Math.floor(item.price * item.qty)} <span className="text-xs font-bold text-gray-400">TOKENS</span></span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-600 text-sm font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <Trash2 size={16} /> Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-8 sticky top-24">
                            <h2 className="text-xl font-black mb-6 text-gray-900 uppercase tracking-wider">Resumen de Canje</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">{Math.floor(subtotal)} TKNS</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Acceso Digital</span>
                                    <span className="text-green-600 font-bold uppercase text-[11px] bg-green-50 px-2 py-1 rounded-lg">Instantáneo</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-black text-[#1f57ff]">{Math.floor(subtotal)} <span className="text-sm">Tokens</span></span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={items.length === 0}
                                className="w-full bg-[#1f57ff] hover:bg-[#1745d0] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transform transition-all hover:-translate-y-1 active:scale-95 mb-4"
                            >
                                Finalizar Pedido
                            </button>
                            <button
                                onClick={clearCart}
                                disabled={items.length === 0}
                                className="w-full bg-white hover:bg-gray-50 disabled:hidden text-gray-400 font-bold py-3 rounded-2xl border border-gray-100 transition-all text-sm"
                            >
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;
