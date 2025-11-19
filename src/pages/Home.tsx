// src/pages/Home.tsx
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product, listProducts, listOffers } from '../data/data'; // Importar Product

// Listado de categorías principales para el carousel de categorías
const mainCategoriesSource: { name: string; image: string }[] = [
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
  const featuredProducts: Product[] = useMemo(() => listProducts().slice(0, 4), []);
  const offers: Product[] = useMemo(() => listOffers(), []);

  // FILTRO: Eliminar "Juegos de Mesa" del acceso rápido
  const mainCategories: { name: string; image: string }[] = useMemo(() => 
    mainCategoriesSource.filter(cat => cat.name !== 'Juegos de Mesa'), 
    []
  );

  return (
    // CORRECCIÓN: Se elimina el backgroundColor del div principal.
    <div className="home-page" style={{ color: '#E0E0E0', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* 1. Banner Principal NUEVO Y SIMPLIFICADO */}
      <div className="jumbotron jumbotron-fluid bg-primary text-white text-center py-5 mb-5 rounded-3 shadow-lg" 
           style={{ backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <h1 className="display-4 fw-bold">¡Bienvenido a LEVEL-UP!</h1>
          <p className="lead">Tu portal definitivo para lo último en tecnología y juegos.</p>
          <hr className="my-4 border-light w-50 mx-auto" />
          <p className="lead">
            Explora nuestras increíbles ofertas y los productos más novedosos.
          </p>
          <NavLink to="/ofertas" className="btn btn-warning btn-lg fw-bold mt-3">
            Ver Ofertas Exclusivas
          </NavLink>
        </div>
      </div>

      {/* 2. Noticias Gamer AHORA EN FORMATO CARRUSEL Y MÁS GRANDES */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">📰 Noticias Gamer</h2>
        <div id="newsCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
            {/* Indicadores */}
            <div className="carousel-indicators">
                {newsItems.map((_, index) => (
                    <button 
                        key={index}
                        type="button" 
                        data-bs-target="#newsCarousel" 
                        data-bs-slide-to={index} 
                        className={index === 0 ? 'active' : ''} 
                        aria-current={index === 0 ? 'true' : 'false'} 
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Contenedor de las noticias */}
            <div className="carousel-inner rounded-3 shadow-lg">
                {newsItems.map((news, index) => (
                    <div key={news.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <div style={{ backgroundImage: `url(${news.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 550, display: 'flex', alignItems: 'flex-end' }}>
                            <div className="container text-white p-5 bg-dark bg-opacity-75 rounded-bottom">
                                <h5 className="display-6 fw-bold">{news.title}</h5>
                                <p className="lead">{news.summary}</p>
                                <button className="btn btn-warning">Leer Noticia Completa</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Controles de navegación */}
            <button className="carousel-control-prev" type="button" data-bs-target="#newsCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#newsCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
            </button>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">✨ Productos Destacados</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} /> 
            </div>
          ))}
        </div>
      </section>

      {/* Carrusel de Categorías (Botón Juegos de Mesa ELIMINADO y Centrado) */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">🎮 Explora por Categoría</h2>
        <div className="row g-3 justify-content-center"> 
          {mainCategories.map((cat, index) => (
            <div key={index} className="col-6 col-md-4">
              <NavLink to={`/categorias?cat=${cat.name}`} 
                       className="card text-center text-decoration-none shadow-sm hover-grow" 
                       style={{ overflow: 'hidden', backgroundColor: '#3C3C3C', color: '#E0E0E0' }}>
                <img src={cat.image} className="card-img-top mx-auto mt-3" alt={cat.name} style={{ height: 120, width: 120, objectFit: 'contain' }} />
                <div className="card-body">
                  <h5 className="card-title text-light">{cat.name}</h5>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </section>

      {/* Ofertas de la Semana */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">⚡ Ofertas de la Semana</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {offers.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}