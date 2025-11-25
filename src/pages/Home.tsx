// src/pages/Home.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api'; // API Real

// Datos estáticos para noticias y categorías visuales (esto está bien dejarlo fijo)
const mainCategoriesSource = [
  { name: 'Accesorios', image: 'Img/Producto_Img/accesorios.png' },
  { name: 'Consolas', image: 'Img/Producto_Img/consolas.png' },
  { name: 'PCs', image: 'Img/Producto_Img/pcs.png' },
  { name: 'Juegos de Mesa', image: 'Img/Producto_Img/Catan.png' },
];

const newsItems = [
  { id: 1, title: 'Tendencias RGB', image: 'Img/Producto_Img/noticia1.png', summary: 'Lo último en luces.', link: '#' },
  { id: 2, title: 'E-Sports Chile', image: 'Img/Producto_Img/fakerlol.png', summary: 'Rumbo al mundial.', link: '#' },
  { id: 3, title: 'PS6 Rumores', image: 'Img/Producto_Img/playstation6.png', summary: '¿Qué se viene?', link: '#' },
];

export default function Home(): JSX.Element {
  const [offers, setOffers] = useState<any[]>([]);

  // Cargar ofertas desde BD
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const products = await api.getProducts();
        // Filtramos los que tengan offer == true
        // (Asegúrate de marcar el checkbox "Oferta" al crear el producto en el Panel)
        setOffers(products.filter((p: any) => p.offer === true));
      } catch (e) {
        console.error(e);
      }
    };
    fetchOffers();
  }, []);

  const mainCategories = useMemo(() => mainCategoriesSource.filter(cat => cat.name !== 'Juegos de Mesa'), []);

  return (
    <div className="home-page" style={{ color: '#E0E0E0', minHeight: '100vh', paddingBottom: '50px' }}>
      
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

      {/* Noticias (Estáticas) */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">📰 Noticias Gamer</h2>
        <div id="newsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner rounded-3 shadow-lg">
                {newsItems.map((news, index) => (
                    <div key={news.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                         <div style={{ backgroundImage: `url(${news.image})`, height: 400, backgroundSize: 'cover' }} className="d-flex align-items-end">
                            <div className="w-100 p-4 bg-dark bg-opacity-75 text-white">
                                <h5>{news.title}</h5>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Ofertas Reales de BD */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">⚡ Ofertas de la Base de Datos</h2>
        {offers.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {offers.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No hay ofertas activas en la BD. ¡Agrega una desde el Panel Admin!</p>
        )}
      </section>

      {/* Categorías Visuales */}
      <section className="mb-5">
        <h2 className="text-center mb-4 text-light">🎮 Explora por Categoría</h2>
        <div className="row g-3 justify-content-center"> 
          {mainCategories.map((cat, index) => (
            <div key={index} className="col-6 col-md-4">
              <NavLink to={`/categorias?cat=${cat.name}`} className="card text-center text-decoration-none shadow-sm bg-dark text-light">
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