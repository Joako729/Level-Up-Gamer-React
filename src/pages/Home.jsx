import React from 'react';
import { listProducts, addToCart, listOffers } from '../data/data';
import ProductCard from '../components/ProductCard';

export default function Home(){
  const productos = listProducts();
  const ofertas = listOffers().slice(0, 4);
  return (
    <div className="py-2">
      <section className="hero mb-4">
        <div className="container">
          <h1 className="display-6 fw-bold mb-2">Todo para tu setup gamer</h1>
          <p className="mb-3">Periféricos, consolas y accesorios con despacho a todo Chile.</p>
          <a href="/ofertas" className="btn btn-light btn-sm me-2">Ver ofertas</a>
          <a href="/categorias" className="btn btn-outline-light btn-sm">Explorar categorías</a>
        </div>
      </section>

      <h2 className="titulo-seccion mb-3">Top Ofertas</h2>
      <div className="row g-3 mb-4">
        {ofertas.map(p => (
          <div className="col-12 col-md-6 col-lg-3" key={p.id}>
            <ProductCard product={p} onAdd={addToCart} />
          </div>
        ))}
      </div>

      <h2 className="titulo-seccion mb-3">Todos los productos</h2>
      <div className="row g-3">
        {productos.map(p => (
          <div className="col-12 col-md-6 col-lg-3" key={p.id}>
            <ProductCard product={p} onAdd={addToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}
