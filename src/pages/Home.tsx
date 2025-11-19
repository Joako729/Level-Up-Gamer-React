// src/pages/Home.tsx
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product, listProducts, listOffers } from '../data/data'; // Importar Product

// Listado de categorías principales para el carousel de categorías
const mainCategories: { name: string; image: string }[] = [
  { name: 'Accesorios', image: 'Img/Producto_Img/accesorios.png' },
  { name: 'Consolas', image: 'Img/Producto_Img/consolas.png' },
  { name: 'PCs', image: 'Img/Producto_Img/pcs.png' },
  { name: 'Juegos de Mesa', image: 'Img/Producto_Img/Catan.png' },
];

// Listado de noticias (solo datos de ejemplo)
const newsItems: { id: number; title: string; image: string; summary: string }[] = [
  { id: 1, title: 'Lanzamiento PS6: Rumores y Especificaciones', image: 'Img/Producto_Img/noticia1.png', summary: 'Se filtran posibles detalles de la próxima consola de Sony, incluyendo el chip gráfico y el SSD mejorado.' },
  { id: 2, title: 'Tendencias en periféricos RGB', image: 'Img/Producto_Img/noticia2.png', summary: 'Un vistazo a los teclados, mouses y audífonos que están dominando el mercado con la mejor iluminación personalizable.' },
  { id: 3, title: 'E-Sports: Chile se prepara para el mundial', image: 'Img/Producto_Img/noticia3.png', summary: 'La selección chilena de LoL se clasifica para las finales globales en Asia, un hito histórico para la región.' },
];

export default function Home(): JSX.Element {
  // Obtener y tipar los productos destacados y ofertas
  const featuredProducts: Product[] = useMemo(() => listProducts().slice(0, 4), []);
  const offers: Product[] = useMemo(() => listOffers(), []);

  return (
    <div className="home-page">
      {/* Carrusel Principal */}
      <div id="mainCarousel" className="carousel slide mb-5" data-bs-ride="carousel" data-bs-interval="4000">
        <div className="carousel-inner rounded-3 shadow">
          <div className="carousel-item active" style={{ backgroundColor: '#00d1ff20', minHeight: 300, display: 'flex', alignItems: 'center' }}>
            <div className="container py-5 text-center">
              <h1 className="display-4 fw-bold text-dark">¡Bienvenido a LEVEL-UP!</h1>
              <p className="lead text-dark">Tu portal definitivo de tecnología y juegos.</p>
              <NavLink to="/categorias" className="btn btn-primary btn-lg mt-3">
                Ver Catálogo Completo
              </NavLink>
            </div>
          </div>
          {offers.slice(0, 2).map((offer, index) => (
            <div key={offer.id} className="carousel-item" style={{ backgroundColor: '#dc354520', minHeight: 300, display: 'flex', alignItems: 'center' }}>
              <div className="container py-5 text-center">
                <h2 className="display-5 fw-bold text-danger">{offer.name} ¡EN OFERTA!</h2>
                <p className="lead text-danger">Precio increíble: ¡No te lo pierdas!</p>
                <img src={offer.image} alt={offer.name} style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover' }} className="rounded-circle my-3" />
                <NavLink to="/ofertas" className="btn btn-danger btn-lg mt-3">
                  Ver todas las Ofertas
                </NavLink>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Productos Destacados */}
      <section className="mb-5">
        <h2 className="text-center mb-4">✨ Productos Destacados</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Carrusel de Categorías */}
      <section className="mb-5">
        <h2 className="text-center mb-4">🎮 Explora por Categoría</h2>
        <div className="row g-3">
          {mainCategories.map((cat, index) => (
            <div key={index} className="col-6 col-md-3">
              <NavLink to={`/categorias?cat=${cat.name}`} className="card text-center text-decoration-none shadow-sm hover-grow" style={{ overflow: 'hidden' }}>
                <img src={cat.image} className="card-img-top mx-auto mt-3" alt={cat.name} style={{ height: 120, width: 120, objectFit: 'contain' }} />
                <div className="card-body">
                  <h5 className="card-title text-dark">{cat.name}</h5>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </section>

      {/* Noticias Gamer */}
      <section className="mb-5">
        <h2 className="text-center mb-4">📰 Noticias Gamer</h2>
        <div className="row g-4">
          {newsItems.map((news) => (
            <div key={news.id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img src={news.image} className="card-img-top" alt={news.title} style={{ height: 200, objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{news.title}</h5>
                  <p className="card-text text-muted">{news.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}