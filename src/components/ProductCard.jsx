// src/components/ProductCard.jsx
import React from 'react';

/* === utilidades de carrito dentro del componente (sin archivos nuevos) === */
const STORAGE_KEY = 'cart_v1';

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeCart(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  // notificar a otras vistas (Carrito, Navbar, etc.)
  window.dispatchEvent(new Event('cart:change'));
}
function addToCart(product) {
  if (!product?.id) return;
  const cart = readCart();
  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
  });
  writeCart(cart);
}

function formatCLP(v) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(v) || 0);
}
/* === fin utilidades === */

export default function ProductCard({ product }) {
  if (!product) return null;

  const imgSrc =
    typeof product.image === 'string'
      ? (product.image.startsWith('http') ? product.image : `/${product.image.replace(/^\/+/, '')}`)
      : '';

  return (
    <div className="card h-100 p-2">
      <div className="position-relative">
        {product.offer && (
          <span className="badge-oferta badge rounded-pill">
            {product.offerLabel || 'Oferta'}
          </span>
        )}
        <img
          src={imgSrc}
          alt={product.name}
          className="card-img-top"
          style={{ height: 260, objectFit: 'cover', borderRadius: 10 }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <h5 className="card-title mb-0">{product.name}</h5>
          {product.category && <span className="badge bg-secondary">{product.category}</span>}
        </div>

        <div className="precio mb-2">{formatCLP(product.price)}</div>

        <button
          className="btn btn-primary mt-auto"
          onClick={() => addToCart(product)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}



