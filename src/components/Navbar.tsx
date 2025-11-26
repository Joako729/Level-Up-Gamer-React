// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCartIds } from '../data/data'; // 🟢 Importamos la nueva función

export default function Navbar(): JSX.Element {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const refreshStatus = () => {
      // 🟢 CAMBIO CLAVE: Contamos los IDs directamente
      const ids = getCartIds();
      setCartCount(ids.length);

      const token = localStorage.getItem('token');
      const role = localStorage.getItem('user_role');
      const name = localStorage.getItem('user_name');
      setIsLogged(!!token);
      setIsAdmin(role === 'ADMIN');
      setUserName(name || '');
    };
    refreshStatus();
    
    // Escuchamos eventos de cambio en el carrito y storage
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/categorias?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-uppercase" to="/"><span className="text-primary">Level</span><span className="text-light">-Up</span></NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"><span className="navbar-toggler-icon"></span></button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <input className="form-control form-control-sm me-2 bg-secondary text-white border-0" type="search" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              <button className="btn btn-sm btn-outline-light" type="submit">🔍</button>
            </form>

            <NavLink to="/carrito" className="btn btn-outline-light position-relative">
              🛒 {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
            </NavLink>

            {isLogged ? (
              <>
                <NavLink to="/perfil" className="btn btn-dark border-secondary text-warning fw-bold">{isAdmin ? '⚙️ Panel' : '👤 Perfil'}</NavLink>
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">{userName}</button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                    <li><NavLink className="dropdown-item" to="/perfil">Mi Cuenta</NavLink></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
                  </ul>
                </div>
              </>
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