// src/components/Footer.tsx
import React from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-dark text-white pt-4 pb-2 mt-auto" style={{ borderTop: '3px solid #00D1FF' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>LEVEL-UP</h5>
            <p className="text-muted">La mejor tienda gamer de la región. Más de 10 años de experiencia.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Links Rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-info text-decoration-none">Inicio</a></li>
              <li><a href="/#/categorias" className="text-info text-decoration-none">Catálogo</a></li>
              <li><a href="/#/ofertas" className="text-info text-decoration-none">Ofertas</a></li>
              <li><a href="/#/carrito" className="text-info text-decoration-none">Carrito</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contacto</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt-fill me-2"></i> Av. Siempre Viva 742, Santiago</li>
              <li><i className="bi bi-telephone-fill me-2"></i> +56 9 1234 5678</li>
              <li><i className="bi bi-envelope-fill me-2"></i> contacto@levelup.cl</li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-3 border-top border-secondary">
          <p className="mb-0 text-muted">&copy; 2025 LEVEL-UP. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}