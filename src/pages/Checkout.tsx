// src/pages/Checkout.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { api } from '../services/api'; // Importamos la API real

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
    // 1. Cargamos productos de la Base de Datos y los IDs del carrito correcto
    const loadData = async () => {
      try {
        const apiProds = await api.getProducts();
        const storedIds = JSON.parse(localStorage.getItem('lvlup_cart') || '[]');
        setProducts(apiProds);
        setCartIds(storedIds);
      } catch (e) {
        console.error("Error cargando datos de checkout", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  // 2. Calculamos el total cruzando los IDs del carrito con los precios de la BD
  const totals = useMemo(() => {
    let total = 0;
    let count = 0;

    cartIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        // Aplicamos descuento si tiene oferta (lógica simple)
        const price = product.offer ? Math.round(product.price * 0.85) : product.price;
        total += price;
        count++;
      }
    });

    return { total, count };
  }, [products, cartIds]);
  
  if (loading) return <div className="text-center py-5">Cargando...</div>;

  if (totals.count === 0) {
    return (
      <div className="container py-4 text-center">
        <h2>Tu carrito está vacío.</h2>
        <p>Añade productos para continuar.</p>
        <button className="btn btn-primary" onClick={() => navigate('/categorias')}>Ir al Catálogo</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          {/* Pasamos el total calculado real al formulario */}
          <CheckoutForm 
            total={totals.total} 
            itemsCount={totals.count} 
          />
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm p-3 mt-4 mt-lg-0">
            <h5 className="mb-3">Resumen del Pedido</h5>
            <div className="d-flex justify-content-between mb-2">
                <span>Productos:</span>
                <span>{totals.count}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                <span>Total a Pagar:</span>
                <span className="text-success">${totals.total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}