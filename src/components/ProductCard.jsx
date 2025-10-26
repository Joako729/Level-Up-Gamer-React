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
  // Guardamos también estos campos para que el carrito pueda calcular descuentos
  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    offer: !!product.offer,
    offerLabel: product.offerLabel || null,
    description: product.description || null,
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

  // Oferta visual (-15% si viene marcado en data.js)
  const isOffer = !!product.offer;           // Tus 4 ofertas ya están marcadas en data.js (1,3,7,10)
  const DISCOUNT = 0.15;
  const basePrice = Number(product.price) || 0;
  const discountedPrice = isOffer ? Math.round(basePrice * (1 - DISCOUNT)) : null;
  const offerLabel = product.offerLabel || `-${Math.round(DISCOUNT * 100)}%`;
  const saving = isOffer ? (basePrice - discountedPrice) : 0;

  return (
    <div className="card h-100 p-2">
      <div className="position-relative">
        {isOffer && (
          <span
            className="badge rounded-pill"
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: '#dc3545'
            }}
          >
            {offerLabel}
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

        {/* ✅ Muestra la descripción si existe en data.js */}
        {product.description && (
          <p className="text-muted small mb-2" style={{ minHeight: 40 }}>
            {product.description}
          </p>
        )}

        {/* Precio (si hay oferta, muestra original tachado + rebajado + ahorro) */}
        <div className="mb-2">
          {isOffer ? (
            <>
              <div className="text-muted" style={{ textDecoration: 'line-through' }}>
                {formatCLP(basePrice)}
              </div>
              <div className="fw-bold">
                {formatCLP(discountedPrice)}
              </div>
              <div className="small text-success">
                Ahorras {formatCLP(saving)}
              </div>
            </>
          ) : (
            <div className="fw-bold">
              {formatCLP(basePrice)}
            </div>
          )}
        </div>

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








