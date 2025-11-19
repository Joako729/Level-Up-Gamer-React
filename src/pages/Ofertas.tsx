// src/pages/Ofertas.tsx
import React, { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { listOffers } from '../data/data';

export default function Ofertas(): JSX.Element {
  const offers = useMemo(() => listOffers(), []);

  return (
    <div className="container py-4">
      
      {/* 🔔 CAMBIO: Header con AZUL MÁS CLARO */}
      <div className="text-center mb-5 py-5 rounded-3 shadow-lg" 
           style={{ 
             background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', // Mismo azul claro
             border: '1px solid rgba(255,255,255,0.1)' 
           }}>
        <h1 className="display-4 fw-bold text-white mb-3">🔥 Ofertas Imperdibles</h1>
        <p className="lead text-white px-3">
          ¡Aprovecha nuestros descuentos especiales por tiempo limitado en productos seleccionados!
        </p>
      </div>

      {/* Grilla de Productos en Oferta */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {offers.map((product) => (
          <div key={product.id} className="col">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-5">
          <h3 className="text-white-50">No hay ofertas disponibles por el momento.</h3>
        </div>
      )}
    </div>
  );
}