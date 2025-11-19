// src/components/ProductCard.tsx
import React from 'react';
import { Product } from '../data/data'; // Importar la interfaz Product

// Estructura del objeto de carrito que guarda este componente (debe ser coherente con el tipo Product)
interface ProductCardCartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  offer: boolean;
  offerLabel: string | null;
  description: string | null;
}

/* === utilidades de carrito dentro del componente (sin archivos nuevos) === */
const STORAGE_KEY = 'cart_v1';

function readCart(): ProductCardCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProductCardCartItem[]) : [];
  } catch {
    return [];
  }
}
function writeCart(list: ProductCardCartItem[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  // notificar a otras vistas (Carrito, Navbar, etc.)
  window.dispatchEvent(new Event('cart:change'));
}
// La función espera un objeto Product, que es el que se muestra
function addToCart(product: Product): void {
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

function formatCLP(v: number | string | null | undefined): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(v) || 0);
}
/* === fin utilidades === */

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps): JSX.Element | null {
  if (!product) return null;

  const imgSrc: string =
    typeof product.image === 'string'
      ? (product.image.startsWith('http') ? product.image : `/${product.image.replace(/^\/+/, '')}`)
      : '';

  // Oferta visual (-15% si viene marcado en data.js)
  const isOffer: boolean = !!product.offer;
  const DISCOUNT: number = 0.15;
  const basePrice: number = Number(product.price) || 0;
  // El precio descontado puede ser nulo o un número
  const discountedPrice: number | null = isOffer ? Math.round(basePrice * (1 - DISCOUNT)) : null;
  const offerLabel: string = product.offerLabel || `-${Math.round(DISCOUNT * 100)}%`;
  const saving: number = isOffer ? (basePrice - (discountedPrice || 0)) : 0;

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
          {isOffer && discountedPrice !== null ? (
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