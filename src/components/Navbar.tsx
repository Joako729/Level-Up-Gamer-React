// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCart } from '../data/data';

export default function Navbar(): JSX.Element {
  const navigate = useNavigate();
  
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const refreshStatus = () => {
      const items = getCart();
      setCartCount(items.length);
      try {
        const logged = localStorage.getItem('user_logged') === '1';
        setIsLogged(logged);
      } catch {
        setIsLogged(false);
      }
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
    localStorage.removeItem('user_logged');
    localStorage.removeItem('user_data');
    setIsLogged(false);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/categorias?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        {/* Logo Level-Up (Azul y Blanco) */}
        <NavLink className="navbar-brand fw-bold text-uppercase" to="/" style={{ letterSpacing: '1px' }}>
          <span className="text-primary">Level</span><span className="text-light">-Up</span>
        </NavLink>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
            </li>
            {isLogged && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">Admin</NavLink>
              </li>
            )}
          </ul>

          {/* Buscador con lupa dentro */}
          <form className="d-flex position-relative me-3 align-items-center" onSubmit={handleSearch}>
            <input 
              className="form-control pe-5 bg-dark text-light border-secondary" 
              type="search" 
              placeholder="Buscar..." 
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn position-absolute end-0 border-0 bg-transparent" 
              type="submit"
              style={{ zIndex: 5 }}
            >
              🔍
            </button>
          </form>

          {/* Acciones (Carrito y Login) */}
          <div className="d-flex align-items-center gap-2">
            <NavLink to="/carrito" className="btn btn-outline-light position-relative">
              🛒
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">ítems en carrito</span>
                </span>
              )}
            </NavLink>

            {isLogged ? (
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  👤 Mi Cuenta
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                  <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <div className="btn-group">
                {/* 🔔 CAMBIOS AQUÍ: 
                    - Iniciar sesión: text-white forzado.
                    - Registro: btn-outline-light para borde y texto blanco. 
                */}
                <NavLink to="/login" className="btn btn-primary text-white">
                  Iniciar sesión
                </NavLink>
                <NavLink to="/registro" className="btn btn-outline-light">
                  Registro
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}