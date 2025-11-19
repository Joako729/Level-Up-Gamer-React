// src/pages/Ofertas.tsx
import React, { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { Product, listOffers } from '../data/data'; // Importar Product

export default function Ofertas(): JSX.Element {
  // Obtener y tipar las ofertas
  const offers: Product[] = useMemo(() => listOffers(), []);

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-danger">🔥 Ofertas Imperdibles</h1>
      <p className="lead text-muted">¡Aprovecha nuestros descuentos especiales por tiempo limitado en productos seleccionados!</p>

      {offers.length === 0 ? (
        <div className="alert alert-info">
          Por el momento, no hay ofertas disponibles. Vuelve pronto.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {offers.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}