// src/pages/Carrito.jsx
import React, { useEffect, useMemo, useState } from 'react';

/* === utilidades de carrito dentro del archivo (sin archivos nuevos) === */
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
  window.dispatchEvent(new Event('cart:change'));
}
function getCart() {
  return readCart();
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
function removeFromCart(id) {
  const cart = readCart();
  const idx = cart.findIndex((p) => p.id === id);
  if (idx >= 0) {
    cart.splice(idx, 1);
    writeCart(cart);
  }
}
function removeAllFromCart(id) {
  const next = readCart().filter((p) => p.id !== id);
  writeCart(next);
}
function clearCart() {
  writeCart([]);
}
function formatCLP(v) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(v) || 0);
}
function groupCart(list) {
  const map = new Map();
  for (const p of list) {
    if (!map.has(p.id)) map.set(p.id, { product: p, qty: 0 });
    map.get(p.id).qty += 1;
  }
  return Array.from(map.values());
}
/* === fin utilidades === */

export default function Carrito() {
  const [items, setItems] = useState(() => getCart());
  const rows = useMemo(() => groupCart(items), [items]);
  const total = useMemo(() => rows.reduce((s, r) => s + (Number(r.product.price) || 0) * r.qty, 0), [rows]);

  // Escucha cambios del carrito (cuando agregas desde Home/ProductCard)
  useEffect(() => {
    const refresh = () => setItems(getCart());
    window.addEventListener('cart:change', refresh);
    window.addEventListener('storage', refresh);
    refresh();
    return () => {
      window.removeEventListener('cart:change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (!rows.length) {
    return (
      <div className="container py-4">
        <h2 className="mb-3">Carrito</h2>
        <p className="text-muted">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Carrito</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={() => { clearCart(); setItems(getCart()); }}>
          Vaciar carrito
        </button>
      </div>

      {/* tabla en negro como pediste */}
      <div className="table-responsive" style={{ backgroundColor: 'black', color: 'white', borderRadius: '10px', padding: '16px' }}>
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: 64 }}></th>
              <th>Producto</th>
              <th className="text-center" style={{ width: 160 }}>Cantidad</th>
              <th className="text-end" style={{ width: 140 }}>Precio</th>
              <th className="text-end" style={{ width: 160 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, qty }) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={
                      product.image?.startsWith('http')
                        ? product.image
                        : `/${String(product.image || '').replace(/^\/+/, '')}`
                    }
                    alt={product.name}
                    style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8 }}
                  />
                </td>
                <td>
                  <div className="fw-semibold">{product.name}</div>
                  <div className="text-muted small">{product.category}</div>
                </td>
                <td className="text-center">
                  <div className="btn-group" role="group" aria-label="Cambiar cantidad">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => { removeFromCart(product.id); setItems(getCart()); }}
                    >
                      –
                    </button>
                    <span className="btn btn-light btn-sm disabled">{qty}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => { addToCart(product); setItems(getCart()); }}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-link text-danger btn-sm mt-1"
                      onClick={() => { removeAllFromCart(product.id); setItems(getCart()); }}
                    >
                      Quitar todo
                    </button>
                  </div>
                </td>
                <td className="text-end">{formatCLP(product.price)}</td>
                <td className="text-end">{formatCLP((Number(product.price) || 0) * qty)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="text-end fw-bold">Total</td>
              <td className="text-end fw-bold">{formatCLP(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}








