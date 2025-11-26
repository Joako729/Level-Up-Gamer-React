// src/pages/Checkout.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { api } from '../services/api';
import { activarOfertasFrontend, Product } from '../data/data'; // 🟢 IMPORTAMOS Product



export default function Checkout(): JSX.Element {
  const navigate = useNavigate();
  // Ahora TypeScript sabe que "Product" es el mismo tipo que devuelve activarOfertasFrontend
  const [products, setProducts] = useState<Product[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiProds = await api.getProducts();
        const storedIds = JSON.parse(localStorage.getItem('lvlup_cart') || '[]');
        
        // Ahora sí coinciden los tipos
        const productsWithOffers = activarOfertasFrontend(apiProds);
        
        setProducts(productsWithOffers);
        setCartIds(storedIds);
      } catch (e) {
        console.error("Error cargando checkout", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  const totals = useMemo(() => {
    let total = 0;
    let count = 0;
    const details: { id: number; name: string; finalPrice: number }[] = [];

    cartIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        let price = product.price;

        // Misma lógica de precios que el carrito
        if (product.offer) {
          const nameLower = product.name.toLowerCase();
          
          if (nameLower.includes('catan')) {
            price = Math.round(product.price * 0.80);
          } else if (nameLower.includes('carcassonne')) {
            price = Math.round(product.price * 0.85);
          } else if (nameLower.includes('polera')) {
            price = Math.round(product.price * 0.50);
          } else if (nameLower.includes('playstation 5')) {
            price = Math.round(product.price * 0.90);
          } else {
            price = Math.round(product.price * 0.85);
          }
        }

        total += price;
        count++;
        
        details.push({
            id: product.id,
            name: product.name,
            finalPrice: price
        });
      }
    });

    return { total, count, details };
  }, [products, cartIds]);
  
  if (loading) return <div className="text-center py-5 text-white">Cargando...</div>;

  if (totals.count === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5 rounded-3 border border-secondary shadow text-white" style={{ backgroundColor: '#212529' }}>
            <h3 className="fw-bold">No hay nada que pagar</h3>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/categorias')}>Ir al Catálogo</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          <CheckoutForm 
            total={totals.total} 
            itemsCount={totals.count}
            cartDetails={totals.details} 
          />
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm p-3 mt-4 mt-lg-0 border-secondary" style={{ backgroundColor: '#212529', color: '#fff' }}>
            <h5 className="mb-3 border-bottom border-secondary pb-2">Resumen del Pedido</h5>
            
            <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {totals.details.map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between small mb-1 border-bottom border-secondary pb-1">
                        <span className="text-white-50 text-truncate" style={{maxWidth: '65%'}}>{item.name}</span>
                        <span className="text-warning fw-bold">${item.finalPrice.toLocaleString('es-CL')}</span>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between mb-2 border-top border-secondary pt-2">
                <span className="text-white-50">Productos:</span>
                <span>{totals.count}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold pt-2">
                <span>Total a Pagar:</span>
                <span className="text-success fs-4">${totals.total.toLocaleString('es-CL')}</span>
            </div>
            <div className="mt-3 text-center">
                <small className="text-white-50">Todos los impuestos incluidos</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}