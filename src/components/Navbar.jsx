import React from 'react';
import { Link, NavLink } from 'react-router-dom';
 export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          Level-Up Gamer
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
          aria-controls="navMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          {/* Buscador */}
          <form
            className="d-flex ms-lg-3 my-2 my-lg-0"
            role="search"
            style={{ maxWidth: 380 }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder='Buscar: "Juegos de mesa", "Consolas", "PCs"...'
            />
            <button className="btn btn-primary" type="button">
              Buscar
            </button>
          </form>

          {/* Links centro */}
          <ul className="navbar-nav ms-lg-3 me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="/categorias"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categorías
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/categorias">
                    Todos
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/categorias">
                    Juegos de mesa
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/categorias">
                    Accesorios
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/categorias">
                    Consolas
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/categorias">
                    PCs
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/categorias">
                    Ropa
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/ofertas">
                Ofertas
              </NavLink>
            </li>
          </ul>

          {/* Botones derecha */}
          <div className="d-flex gap-2">
            <Link to="/carrito" className="btn btn-success fw-bold">
              🛒 Carrito
            </Link>
            <Link to="/admin" className="btn btn-outline-light">
              Admin
            </Link>

            {/* Botón de inicio de sesión (icono de usuario) */}
            <Link to="/login" className="btn btn-outline-light">
              <i className="fas fa-user"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}