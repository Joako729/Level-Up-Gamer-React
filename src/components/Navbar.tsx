// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Product } from '../data/data'; // Importamos el tipo Product

// Helper para calcular la cantidad de items
function getCartCount(): number {
  try {
    const raw = localStorage.getItem('cart_v1'); // Usa la clave real del carrito
    const cart: Product[] = raw ? (JSON.parse(raw) as Product[]) : [];
    return cart.length;
  } catch { return 0; }
}

// Helper para el perfil
function getLoggedStatus(): boolean {
  try { return localStorage.getItem('user_logged') === '1'; } catch { return false; }
}

function getUserName(): string {
    return localStorage.getItem('user_name') || 'Invitado';
}

export default function Navbar(): JSX.Element {
  const [cartCount, setCartCount] = useState<number>(getCartCount());
  const [isLogged, setIsLogged] = useState<boolean>(getLoggedStatus());
  const [userName, setUserName] = useState<string>(getUserName());
  const navigate = useNavigate();

  // Escucha cambios en el carrito y el estado de login
  useEffect(() => {
    // Handler para eventos de 'cart:change' y 'storage'
    const updateStatus = () => {
      setCartCount(getCartCount());
      setIsLogged(getLoggedStatus());
      setUserName(getUserName());
    };

    // Cast necesario para que TypeScript acepte la función como EventListener
    window.addEventListener('cart:change', updateStatus as EventListener);
    window.addEventListener('storage', updateStatus);
    
    // Cleanup
    return () => {
      window.removeEventListener('cart:change', updateStatus as EventListener);
      window.removeEventListener('storage', updateStatus);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem('user_logged');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setIsLogged(false);
    setUserName('Invitado');
    // Forzamos el evento para notificar a otros componentes (App.tsx)
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
    if (query) {
      navigate(`/categorias?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top" style={{ borderBottom: '3px solid #00D1FF' }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-info" to="/">
          <i className="bi bi-controller me-2"></i> LEVEL-UP
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/categorias">
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ofertas">
                Ofertas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin">
                Admin
              </NavLink>
            </li>
          </ul>

          <form className="d-flex me-4" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar producto..."
              aria-label="Search"
              name="search"
            />
            <button className="btn btn-outline-info" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <ul className="navbar-nav d-flex flex-row gap-2 align-items-center">
            <li className="nav-item">
              <Link className="btn btn-outline-light me-2 position-relative" to="/carrito">
                <i className="bi bi-cart4"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                  <span className="visually-hidden">Productos en el carrito</span>
                </span>
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle me-1"></i>
                {isLogged ? userName : 'Cuenta'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdown">
                {isLogged ? (
                  <>
                    <li><span className="dropdown-item text-muted small">Logueado como {userName}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Cerrar Sesión</a></li>
                  </>
                ) : (
                  <>
                    <li><Link className="dropdown-item" to="/login">Iniciar Sesión</Link></li>
                    <li><Link className="dropdown-item" to="/registro">Registrarse</Link></li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}