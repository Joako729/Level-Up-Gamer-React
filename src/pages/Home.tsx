// src/pages/Home.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { Product } from '../data/data';

const mainCategoriesSource = [
  { name: 'Accesorios', image: 'Img/Producto_Img/accesorios.png' },
  { name: 'Consolas', image: 'Img/Producto_Img/consolas.png' },
  { name: 'PCs', image: 'Img/Producto_Img/pcs.png' },
  { name: 'Juegos de Mesa', image: 'Img/Producto_Img/Catan.png' },
];

const newsItems = [
  { id: 1, title: 'Tendencias RGB 2025', image: 'Img/Producto_Img/noticia1.png', summary: 'Descubre cómo la iluminación inmersiva está cambiando los setups gamers.', link: 'https://www.xataka.com/tag/rgb' },
  { id: 2, title: 'E-Sports en Chile', image: 'Img/Producto_Img/fakerlol.png', summary: 'El equipo nacional se prepara para las clasificatorias mundiales.', link: 'https://www.tarreo.com/esports' },
  { id: 3, title: 'Rumores de PlayStation 6', image: 'Img/Producto_Img/playstation6.png', summary: 'Filtraciones sugieren que la próxima consola de Sony podría llegar antes de lo esperado.', link: 'https://vandal.elespanol.com/noticias/ps6' },
];

export default function Home(): JSX.Element {
  // Estado para las ofertas exclusivas (Catan, PS5, etc.)
  const [exclusiveOffers, setExclusiveOffers] = useState<Product[]>([]);
  // Estado para ofertas generales de la BD (si existen marcadas en el backend)
  const [dbOffers, setDbOffers] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await api.getProducts();

        // 1. Filtrar ofertas generales (las que vienen con offer=true desde la BD)
        setDbOffers(products.filter((p: any) => p.offer === true));

        // 2. Configurar manualmente las "Ofertas Exclusivas" solicitadas
        const targetNames = ['Catan', 'Carcassonne', 'PlayStation 5', 'Polera'];
        const manualOffers: Product[] = [];

        targetNames.forEach(name => {
          const found = products.find((p: any) => p.name.toLowerCase().includes(name.toLowerCase()));
          if (found) {
            manualOffers.push({ ...found, offer: true, offerLabel: 'Exclusivo' });
          }
        });
        
        setExclusiveOffers(manualOffers);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const mainCategories = useMemo(() => mainCategoriesSource.filter(cat => cat.name !== 'Juegos de Mesa'), []);

  return (
    <div className="home-page" style={{ color: '#E0E0E0', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* Banner Principal */}
      <div className="jumbotron jumbotron-fluid text-white text-center py-5 mb-5 rounded-3 shadow-lg" 
           style={{ backgroundImage: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)' }}>
        <div className="container">
          <h1 className="display-4 fw-bold">¡Bienvenido a LEVEL-UP!</h1>
          <p className="lead">Tu portal conectado a Base de Datos Real.</p>
          <NavLink to="/categorias" className="btn btn-warning btn-lg fw-bold mt-3">
            Ver Catálogo Completo
          </NavLink>
        </div>
      </div>

      {/* Noticias */}
      <section className="mb-5 container">
        <h2 className="text-center mb-4 text-light">📰 Noticias Gamer</h2>
        <div id="newsCarousel" className="carousel slide shadow-lg rounded-3 overflow-hidden" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {newsItems.map((_, index) => (
                    <button key={index} type="button" data-bs-target="#newsCarousel" data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-current={index === 0 ? "true" : "false"} aria-label={`Slide ${index + 1}`}></button>
                ))}
            </div>
            <div className="carousel-inner">
                {newsItems.map((news, index) => (
                    <div key={news.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                         <div style={{ backgroundImage: `url(${news.image})`, height: '500px', backgroundSize: 'cover', backgroundPosition: 'center' }} className="d-flex align-items-end">
                            <div className="w-100 p-5 text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))' }}>
                                <h3 className="fw-bold">{news.title}</h3>
                                <p className="fs-5">{news.summary}</p>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
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

      {/* 🌟 Ofertas Exclusivas (Catan, PS5, etc.) */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">🌟 Ofertas Exclusivas</h2>
        {exclusiveOffers.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 px-4">
            {exclusiveOffers.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
           <p className="text-center text-muted">Cargando ofertas exclusivas...</p>
        )}
      </section>

      {/* Ofertas Generales de BD (Opcional) */}
      {dbOffers.length > 0 && (
        <section className="mb-5">
            <h2 className="text-center mb-4 text-light">⚡ Más Ofertas</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 px-4">
                {dbOffers.map((product) => (
                <div key={product.id} className="col">
                    <ProductCard product={product} />
                </div>
                ))}
            </div>
        </section>
      )}

      {/* Categorías */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">🎮 Explora por Categoría</h2>
        <div className="row g-3 justify-content-center px-4"> 
          {mainCategories.map((cat, index) => (
            <div key={index} className="col-6 col-md-4">
              <NavLink to={`/categorias?cat=${cat.name}`} className="card text-center text-decoration-none shadow-sm bg-dark text-light border-secondary">
                <img src={cat.image} className="card-img-top mx-auto mt-3" alt={cat.name} style={{ height: 100, objectFit: 'contain' }} />
                <div className="card-body"><h5>{cat.name}</h5></div>
              </NavLink>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}