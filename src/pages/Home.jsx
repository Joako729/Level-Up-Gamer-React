import React from 'react';
import { listCategories } from '../data/data';
import { Link } from 'react-router-dom';

export default function Home() {
  const categorias = ['Juegos de mesa', 'Accesorios', 'Consolas', 'PCs', 'Ropa']
    .filter((c) => listCategories().includes(c))
    .slice(0, 3); // 3 categorías grandes como en el anexo

  return (
    <div className="container py-3">
      {/* HERO / CARRUSEL DE NOTICIAS */}

      {/* 🟩 CUADRO DE BIENVENIDA */}
      <section className="welcome-card card shadow-sm border-0 mb-4">
        <div className="card-body d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
          <div>
            <h3 className="mb-1 fw-bold">¡Bienvenido a Level-Up Gamer!</h3>
            <p className="mb-0 text-opacity">
              Somos tu tienda gamer favorita. Encuentra consolas, accesorios, PCs y juegos de mesa 
              con despacho rápido. ¡Arma tu setup y sube de nivel!
            </p>
          </div>
          <div className="ms-lg-3">
            <Link to="/ofertas" className="btn btn-primary">Ofertas</Link>
          </div>
        </div>
      </section>

      {/* 🟩 CARRUSEL DE NOTICIAS */}
      <section className="mb-4">
        <div id="carouselExampleAutoplaying" className="carousel slide">
          <div className="carousel-inner">
            {/* Noticia 1 */}
            <div className="carousel-item active">
              <img
                src="/Img/Producto_Img/noticia1.png" // Imagen noticia 1
                className="d-block w-100"
                alt="Noticia 1"
                style={{ height: '400px', objectFit: 'cover' }} // Ajustamos tamaño
              />
              <div className="carousel-caption d-none d-md-block">
                <h5 className="fw-bold">La revolución del Gaming en 2025</h5>
                <p>
                  El mundo del gaming está experimentando una revolución con nuevas
                  tecnologías. ¡Prepárate para lo que viene!
                </p>
              </div>
            </div>
            {/* Noticia 2 */}
            <div className="carousel-item">
              <img
                src="/Img/Producto_Img/noticia2.png" // Imagen noticia 2
                className="d-block w-100"
                alt="Noticia 2"
                style={{ height: '400px', objectFit: 'cover' }} // Ajustamos tamaño
              />
              <div className="carousel-caption d-none d-md-block">
                <h5 className="fw-bold">La consola PS6 será más potente que nunca</h5>
                <p>
                  Con nuevos avances en hardware, la PS6 promete ser la consola más
                  poderosa de la historia del gaming.
                </p>
              </div>
            </div>
            {/* Noticia 3 */}
            <div className="carousel-item">
              <img
                src="/Img/Producto_Img/noticia3.png" // Imagen noticia 3
                className="d-block w-100"
                alt="Noticia 3"
                style={{ height: '400px', objectFit: 'cover' }} // Ajustamos tamaño
              />
              <div className="carousel-caption d-none d-md-block">
                <h5 className="fw-bold">El futuro de la realidad virtual en los videojuegos</h5>
                <p>
                  Con avances en realidad virtual, los videojuegos se están
                  acercando a una experiencia completamente inmersiva.
                </p>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* 🟩 CATEGORÍAS */}
      <h2 className="titulo-seccion text-center mb-3">Categorías</h2>
      <section className="row g-3">
        {categorias.map((c) => (
          <div className="col-12 col-md-6 col-lg-4" key={c}>
            <div className="card cat-card shadow-sm h-100 d-flex">
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                {/* Aquí añades la imagen representativa */}
                <img
                  src={`/Img/Producto_Img/${c.toLowerCase().replace(' ', '')}.png`} // usa nombre de categoría para la imagen
                  alt={c}
                  className="img-fluid mb-2"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <h5 className="card-title mb-2">{c}</h5>
                <Link to={`/categorias?cat=${encodeURIComponent(c)}`} className="btn btn-primary">Ver más</Link>
              </div>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
