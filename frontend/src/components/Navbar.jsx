import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('todo');
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    React.useEffect(() => {
        const actualizar = () => {
            setUser(JSON.parse(localStorage.getItem('user') || 'null'));
            setCartCount(JSON.parse(localStorage.getItem('cart') || '[]').reduce((total, item) => total + (item.qty || 1), 0));
        };
        actualizar();
        window.addEventListener('storage', actualizar);
        return () => window.removeEventListener('storage', actualizar);
    }, []);

    const buscar = (event) => {
        event?.preventDefault();
        const params = new URLSearchParams();
        if (search.trim()) params.set('buscar', search.trim());
        if (category !== 'todo') params.set('categoria', category);
        navigate(`/?${params.toString()}#recursos`);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('storage'));
        setUserMenuOpen(false);
    };

    return (
        <header className="w-full bg-white border-b shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-2 transition-all">

                {/* Logo UPN institucional */}
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="https://www.upn.edu.co/wp-content/uploads/2025/08/Identidad-UPN-25-horizontal-azul-fondo-transparente.png"
                        alt="Logo UPN"
                        className="w-44 h-16 object-contain transition-transform duration-300 hover:scale-105"
                    />
                </Link>

                {/* Buscador */}
                <div className="flex-1 px-6 hidden md:flex">
                    <form onSubmit={buscar} className="flex w-full bg-gray-50 border rounded-full overflow-hidden shadow-inner">
                        <select value={category} onChange={(e) => setCategory(e.target.value)} id="category-select" aria-label="Categoría" className="bg-gray-100 px-4 text-sm outline-none border-r min-w-[160px]">
                            <option value="todo">Todas</option>
                            <option value="ia">IA</option>
                            <option value="gamificacion">Gamificación</option>
                            <option value="vr">VR</option>
                            <option value="apps">Apps</option>
                        </select>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} id="search-input" type="search" placeholder="Buscar recursos..."
                            className="w-full px-4 py-2 text-sm outline-none bg-gray-50" />
                        <button type="submit" id="search-btn"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition">
                            Buscar
                        </button>
                    </form>
                </div>

                {/* Panel derecho */}
                <div className="flex items-center gap-6">
                    <Link to="/guardados" className="hover:text-blue-600 transition" title="Mis favoritos">
                        <span className="material-symbols-outlined text-2xl text-gray-700">favorite</span>
                    </Link>
                    {/* Carrito de cursos */}
                    <Link to="/cart" className="relative hover:text-blue-600 transition" title="Carrito de cursos">
                        <span className="material-symbols-outlined text-2xl text-gray-700">shopping_cart</span>
                        <span id="cart-count"
                            className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    </Link>

                    {/* Usuario / Panel */}
                    <div className="relative" id="user-menu-wrapper">
                        <button
                            id="user-menu-btn"
                            className="focus:outline-none"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <img
                                src="https://i.ibb.co/4ZpGSnL0/user-9187528.png"
                                alt="Usuario"
                                className="w-11 h-11 rounded-full border-2 border-blue-600 object-cover shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-blue-200"
                            />
                        </button>

                        {/* Menú desplegable */}
                        <div id="user-menu"
                            className={`absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-lg transform transition-all duration-200 origin-top-right ${userMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            {user ? (
                                <>
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Sesión activa</p>
                                        <p className="text-sm font-bold text-blue-600 truncate">{user.name}</p>
                                    </div>
                                    {user.role === 'admin' && (
                                        <Link to="/admin"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                            onClick={() => setUserMenuOpen(false)}>
                                            Panel administrativo
                                        </Link>
                                    )}
                                    <Link to="/mis-cursos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setUserMenuOpen(false)}>
                                        Mis cursos
                                    </Link>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl font-bold transition-colors"
                                        onClick={handleLogout}>
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <Link to="/login"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl font-bold transition-colors"
                                    onClick={() => setUserMenuOpen(false)}>
                                    Iniciar sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
