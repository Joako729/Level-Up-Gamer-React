import React from 'react';
import { listCategories } from '../data/data';
import { Link } from 'react-router-dom';

export default function Home(){

  const categorias = ['Juegos de mesa','Accesorios','Consolas','PCs','Ropa']
    .filter(c => listCategories().includes(c))
    .slice(0, 3); // mostramos 3 grandes como en el anexo

  return (
    <div className="container py-3">

      {/* HERO / BANNER 1200x300 (mock) */}
      <section className="hero-mock d-flex flex-column align-items-center justify-content-center text-center mb-4">
        <div className="display-4 fw-bold text-muted">1200 x 300</div>
        <h5 className="mt-3 mb-1 text-secondary">Nuevos Lanzamientos</h5>
        <p className="text-secondary small mb-3">Descubre los últimos juegos disponibles en nuestra tienda.</p>
        {/* puntitos mock del carrusel */}
        <div className="d-flex gap-2">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <h2 className="titulo-seccion text-center mb-3">Categorías</h2>
      <section className="row g-3">
        {categorias.map((c) => (
          <div className="col-12 col-md-6 col-lg-4" key={c}>
            <div className="card cat-card shadow-sm h-100 d-flex">
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <div className="text-muted fs-3 fw-bold mb-2">400 x 200</div>
                <h5 className="card-title mb-2">{c}</h5>
                <Link to="/categorias" className="btn btn-primary">Ver más</Link>
              </div>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
