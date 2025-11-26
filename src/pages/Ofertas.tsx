// src/pages/Ofertas.tsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { activarOfertasFrontend, Product } from '../data/data'; // 🟢 Usamos la función compartida

export default function Ofertas(): JSX.Element {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const raw = await api.getProducts();
        // Aplicamos la misma lógica que el carrito
        const allWithOffers = activarOfertasFrontend(raw);
        // Filtramos solo los que tienen oferta true
        setOffers(allWithOffers.filter(p => p.offer === true));
      } catch (error) {
        console.error("Error cargando ofertas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="container py-4">
      <div className="text-center mb-5 py-5 rounded-3 shadow-lg" 
           style={{ 
             background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)', 
             border: '1px solid rgba(255,255,255,0.1)' 
           }}>
        <h1 className="display-4 fw-bold text-white mb-3">🔥 Ofertas Imperdibles</h1>
        <p className="lead text-white px-3">
          ¡Aprovecha nuestros descuentos especiales por tiempo limitado!
        </p>
      </div>

      {loading ? (
        <div className="text-center text-white"><h3>Cargando ofertas...</h3></div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {offers.length > 0 ? (
            offers.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <h3 className="text-white-50">No hay ofertas disponibles.</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}