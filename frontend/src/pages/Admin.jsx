import React, { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, Search, Plus, Share, Edit, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category_id: 1,
        image_url: '',
        short_description: '',
        description: '',
        section: 'destacadas'
    });

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('access_token');
        if (!user || !(user.rol === 'admin' || user.is_staff || user.is_superuser) || !token) {
            navigate('/login');
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('productos/', { params: { all: 'true', page_size: 100 } });
            setProducts(Array.isArray(response.data) ? response.data : response.data.results || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#ffffff',
            borderRadius: '1.5rem'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`productos/${id}/`);
                setProducts(products.filter(p => p.id !== id));
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El producto ha sido borrado.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('Error delete:', error);
                Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
            }
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                price: Math.floor(product.price),
                category_id: product.category_id || 1,
                image_url: product.image_url || '',
                short_description: product.short_description || '',
                description: product.description || '',
                section: product.section || 'destacadas'
            });
        } else {
            setEditingProduct(null);
            setFormData({
                title: '',
                price: '',
                category_id: 1,
                image_url: '',
                short_description: '',
                description: '',
                section: 'destacadas'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`productos/${editingProduct.id}/`, formData);
            } else {
                await api.post('productos/', formData);
            }

            Swal.fire({
                icon: 'success',
                title: editingProduct ? 'Producto actualizado' : 'Producto creado',
                showConfirmButton: false,
                timer: 1500
            });

            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error submit:', error);
            const errorMsg = error.response?.data
                ? Object.values(error.response.data).flat().join(', ')
                : 'Verifica los campos del formulario.';

            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: errorMsg,
                confirmButtonColor: '#1f57ff'
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`layout flex min-h-screen bg-[#f6f7fb]`}>
            {/* SIDEBAR */}
            <aside
                id="sidebar"
                className={`glass bg-white border-r border-[#e5e7eb] flex flex-col items-center py-3 px-2 sticky top-0 h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-[240px] items-stretch' : 'w-[84px] items-center'}`}
                onMouseEnter={() => setSidebarOpen(true)}
                onMouseLeave={() => setSidebarOpen(false)}
            >
                <div className="flex items-center justify-center py-4 border-b border-gray-100 mb-3">
                    <img
                        src={sidebarOpen
                            ? "https://www.upn.edu.co/wp-content/uploads/2025/08/Identidad-UPN-25-horizontal-azul-fondo-transparente.png"
                            : "https://www.upn.edu.co/wp-content/uploads/2025/08/Identidad-UPN-25-vertical-azul-fondo-blanco.png"
                        }
                        alt="UPN"
                        className={`${sidebarOpen ? 'h-12' : 'h-16'} w-auto object-contain transition-all duration-300`}
                    />
                </div>

                <nav className="w-full space-y-1">
                    <button className="flex items-center gap-3 px-4 py-2 w-full rounded-xl bg-[#eef4ff] text-[#1f57ff] font-semibold text-sm">
                        <span className="material-symbols-outlined">dashboard</span>
                        {sidebarOpen && <span className="label">Panel</span>}
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 w-full rounded-xl hover:bg-[#eef4ff] hover:text-[#1f57ff] transition-all text-sm">
                        <span className="material-symbols-outlined">inventory_2</span>
                        {sidebarOpen && <span className="label">Productos</span>}
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-3 px-4 py-2 w-full rounded-xl hover:bg-[#eef4ff] hover:text-[#1f57ff] transition-all text-sm"
                    >
                        <span className="material-symbols-outlined">add_box</span>
                        {sidebarOpen && <span className="label font-semibold">Nuevo</span>}
                    </button>
                </nav>

                <div className="mt-auto w-full px-3 pb-4 pt-6 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-sm"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        {sidebarOpen && <span className="label">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main id="main" className="flex-1 p-[18px] min-w-0">
                {/* Topbar */}
                <section className="glass bg-white rounded-2xl border border-[#e5e7eb] px-4 py-3 mb-4 flex items-center gap-3 shadow-sm">
                    <div className="hidden md:flex items-center gap-2 border rounded-xl px-3 py-2 bg-transparent w-72">
                        <span className="material-symbols-outlined text-gray-500">search</span>
                        <input
                            placeholder="Buscar producto…"
                            className="bg-transparent outline-none text-sm w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-white border text-[#0f172a] font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#f1f5f9] transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined">ios_share</span>
                        <span className="hidden md:inline">Exportar</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#1f57ff] hover:bg-[#1745d0] text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span className="hidden sm:inline">Nuevo producto</span>
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="text-right mr-2 hidden lg:block">
                            <div className="text-sm font-bold text-gray-900">Admin UPN</div>
                            <div className="text-xs text-gray-500">Administrador de Plataforma</div>
                        </div>
                        <button className="rounded-full border p-0.5">
                            <img className="h-9 w-9 rounded-full object-cover" src="https://i.ibb.co/4ZpGSnL0/user-9187528.png" alt="user" />
                        </button>
                    </div>
                </section>

                {/* Métricas */}
                <section className="grid md:grid-cols-4 gap-4 mb-4">
                    {[
                        { label: 'Nuevos', val: '12', color: 'text-blue-600' },
                        { label: 'En proceso', val: '20', color: 'text-indigo-600' },
                        { label: 'En revisión', val: '57', color: 'text-purple-600' },
                        { label: 'Publicados', val: products.length, color: 'text-green-600' }
                    ].map((stat, i) => (
                        <div key={i} className="glass bg-white rounded-2xl p-6 text-center border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                            <div className={`mt-2 text-4xl font-black ${stat.color}`}>{stat.val}</div>
                        </div>
                    ))}
                </section>

                {/* Tabla */}
                <section className="glass bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-[#f8fafc] text-[#64748b] text-xs uppercase font-bold tracking-wider">
                                <tr className="text-left">
                                    <th className="py-4 pl-6 pr-2">#</th>
                                    <th className="py-4 px-2">Producto</th>
                                    <th className="py-4 px-2">Categoría</th>
                                    <th className="py-4 px-2">Precio</th>
                                    <th className="py-4 px-2">Sección</th>
                                    <th className="py-4 pr-6 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center text-gray-400 font-medium">Cargando productos del almacén...</td>
                                    </tr>
                                ) : filteredProducts.map((p, idx) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-6 text-gray-400 font-medium">{idx + 1}</td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3 text-left">
                                                <img src={p.image || p.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-gray-100 shadow-sm" />
                                                <div>
                                                    <div className="font-bold text-[#0f172a]">{p.title}</div>
                                                    <div className="text-[11px] text-gray-500 line-clamp-1">{p.short_description || p.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 uppercase">
                                                {p.category_name || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 font-black text-[#1f57ff]">{Math.floor(p.price || 0)} <span className="text-[10px]">TKNS</span></td>
                                        <td className="py-4 px-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.section === 'destacadas' ? 'bg-amber-100 text-amber-700' :
                                                p.section === 'mes' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {p.section}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            <div className="flex justify-end gap-2 text-gray-400">
                                                <button
                                                    onClick={() => handleOpenModal(p)}
                                                    className="w-10 h-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all flex items-center justify-center"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-slide-in">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-[#0f172a]">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700">Título</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 font-medium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Precio (Tokens)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 font-medium"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Categoría</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 font-medium"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                                >
                                    <option value="1">IA y Analítica</option>
                                    <option value="2">Gamificación</option>
                                    <option value="3">Realidad virtual</option>
                                    <option value="4">Aplicaciones educativas</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700">Imagen (URL)</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 font-medium"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Sección en Inicio</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 font-medium"
                                    value={formData.section}
                                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                >
                                    <option value="destacadas">Soluciones Destacadas</option>
                                    <option value="mes">Innovaciones del Mes</option>
                                    <option value="recomendadas">Colección Recomendada</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Descripción Corta</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 font-medium"
                                    value={formData.short_description}
                                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700">Descripción Larga</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 font-medium"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl font-bold bg-[#1f57ff] text-white hover:bg-[#1745d0] shadow-lg hover:shadow-xl transition-all"
                                >
                                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
