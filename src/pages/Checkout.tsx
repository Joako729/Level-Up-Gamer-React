// src/pages/Checkout.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm'; // Importar el componente tipado

// Este componente utiliza la misma lógica de carrito que Carrito.tsx,
// por lo que necesitamos replicar la obtención de datos para el total.
interface CartItem {
  id: number;
  price: number;
  offer: boolean;
}
const STORAGE_KEY = 'cart_v1';
const DISCOUNT = 0.15;

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Solo necesitamos id, price, y offer para calcular el total
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch { return []; }
}
function unitPrice(product: CartItem): number {
  const base = Number(product.price) || 0;
  return product.offer ? Math.round(base * (1 - DISCOUNT)) : base;
}

export default function Checkout(): JSX.Element {
  const cartItems: CartItem[] = useMemo(() => readCart(), []);
  
  // Cálculo de totales
  const totals = useMemo(() => {
    let discounted = 0;
    for (const item of cartItems) {
      discounted += unitPrice(item);
    }
    return { discounted, count: cartItems.length };
  }, [cartItems]);
  
  const navigate = useNavigate();

  if (totals.count === 0) {
    return (
      <div className="container py-4 text-center">
        <h2>Tu carrito está vacío.</h2>
        <p>Añade productos para continuar con la compra.</p>
        <button className="btn btn-primary" onClick={() => navigate('/categorias')}>Ir al Catálogo</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          <CheckoutForm 
            total={totals.discounted} 
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
                <span className="text-success">${totals.discounted.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}