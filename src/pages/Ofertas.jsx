import React from 'react';
import { listOffers, addToCart } from '../data/data';
import ProductCard from '../components/ProductCard';

export default function Ofertas(){
  const productos = listOffers();
  return (
    <div>
      <h2 className="titulo-seccion mb-3">Ofertas</h2>
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
