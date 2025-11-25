// src/pages/Checkout.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { api } from '../services/api';

interface Product {
  id: number;
  price: number;
  offer: boolean;
  name: string;
}

export default function Checkout(): JSX.Element {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiProds = await api.getProducts();
        const storedIds = JSON.parse(localStorage.getItem('lvlup_cart') || '[]');
        setProducts(apiProds);
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

    cartIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        const price = product.offer ? Math.round(product.price * 0.85) : product.price;
        total += price;
        count++;
      }
    });

    return { total, count };
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
          {/* El formulario ya tiene el estilo oscuro en su propio componente */}
          <CheckoutForm 
            total={totals.total} 
            itemsCount={totals.count} 
          />
        </div>
        
        {/* RESUMEN LATERAL - AHORA OSCURO */}
        <div className="col-lg-4">
          <div className="card shadow-sm p-3 mt-4 mt-lg-0 border-secondary" style={{ backgroundColor: '#212529', color: '#fff' }}>
            <h5 className="mb-3 border-bottom border-secondary pb-2">Resumen del Pedido</h5>
            <div className="d-flex justify-content-between mb-2">
                <span className="text-white-50">Productos:</span>
                <span>{totals.count}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold pt-2 border-top border-secondary">
                <span>Total a Pagar:</span>
                <span className="text-success">${totals.total.toLocaleString('es-CL')}</span>
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