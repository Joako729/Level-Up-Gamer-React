// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCart } from '../data/data';

export default function Navbar(): JSX.Element {
  const navigate = useNavigate();
  
  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [cartCount, setCartCount] = useState<number>(0);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const refreshStatus = () => {
      const items = getCart();
      setCartCount(items.length);
      
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('user_role');
      const name = localStorage.getItem('user_name');

      setIsLogged(!!token);
      setIsAdmin(role === 'ADMIN');
      setUserName(name || '');
    };

    refreshStatus();
    window.addEventListener('cart:change', refreshStatus);
    window.addEventListener('storage', refreshStatus);

    return () => {
      window.removeEventListener('cart:change', refreshStatus);
      window.removeEventListener('storage', refreshStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  // Función para manejar el envío del formulario de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (searchTerm.trim()) {
      // Redirige a Categorías con el parámetro de consulta 'q'
      navigate(`/categorias?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(''); // Opcional: limpiar el input después de buscar
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-uppercase" to="/">
          <span className="text-primary">Level</span><span className="text-light">-Up</span>
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Menú Izquierdo */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
            {isAdmin && (
               <li className="nav-item"><NavLink className="nav-link text-warning" to="/admin">Panel Admin</NavLink></li>
            )}
          </ul>

          {/* Sección Derecha: Buscador + Carrito + Login/User */}
          <div className="d-flex align-items-center gap-2">
            
            {/* --- NUEVO: Formulario de Búsqueda --- */}
            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <input
                className="form-control form-control-sm me-2"
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-sm btn-outline-light" type="submit">
                🔍
              </button>
            </form>
            {/* -------------------------------------- */}

            <NavLink to="/carrito" className="btn btn-outline-light position-relative">
              🛒 {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
            </NavLink>

            {isLogged ? (
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  👤 {userName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                  {isAdmin && <li><NavLink className="dropdown-item" to="/admin">Administrar</NavLink></li>}
                  <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <div className="btn-group">
                <NavLink to="/login" className="btn btn-dark border-secondary">Login</NavLink>
                <NavLink to="/registro" className="btn btn-primary">Registro</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}