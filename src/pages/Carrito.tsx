// src/pages/Carrito.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Product, getCart, addToCart, removeFromCart, removeAllFromCart, clearCart 
} from '../data/data';

interface GroupedCartItem { product: Product; qty: number; }
interface CartTotals { original: number; discounted: number; savings: number; }

const DISCOUNT = 0.15;

function formatCLP(v: number | string): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(v) || 0);
}
function groupCart(list: Product[]): GroupedCartItem[] {
  const map = new Map<number, GroupedCartItem>();
  for (const p of list) {
    const k = p.id;
    if (!map.has(k)) map.set(k, { product: p, qty: 0 });
    map.get(k)!.qty += 1;
  }
  return Array.from(map.values());
}
function unitPrice(product: Product): number {
  const base = Number(product.price) || 0;
  return product.offer ? Math.round(base * (1 - DISCOUNT)) : base;
}

export default function Carrito(): JSX.Element {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>(() => getCart());
  const rows: GroupedCartItem[] = useMemo(() => groupCart(items), [items]);

  const totals: CartTotals = useMemo(() => {
    let original = 0, discounted = 0, savings = 0;
    for (const { product, qty } of rows) {
      const base = Number(product.price) || 0;
      const unit = unitPrice(product);
      original += base * qty;
      discounted += unit * qty;
      savings += (base - unit) * qty;
    }
    return { original, discounted, savings };
  }, [rows]);

  useEffect(() => {
    const refresh = () => setItems(getCart());
    window.addEventListener('cart:change', refresh as EventListener);
    refresh();
    return () => window.removeEventListener('cart:change', refresh as EventListener);
  }, []);

  const handleRemoveOne = (id: number) => removeFromCart(id);
  const handleAddOne = (id: number) => addToCart(id);
  const handleRemoveAll = (id: number) => removeAllFromCart(id);
  const handleClear = () => clearCart();

  const handleGoToCheckout = () => { navigate('/checkout'); };

  // --- VISTA CARRITO VACÍO (Color corregido a #212529) ---
  if (!rows.length) {
    return (
      <div className="container py-5 text-center">
        {/* Usamos el mismo estilo y color de fondo que la tabla del carrito */}
        <div className="py-5 rounded-3 border border-secondary shadow text-white" style={{ backgroundColor: '#212529' }}>
            <div className="mb-3 text-white-50" style={{ fontSize: '4rem' }}>🛒</div>
            <h3 className="fw-bold text-white">Tu carrito está vacío</h3>
            <p className="mt-2 text-white-50">¡Añade productos para continuar!</p>
            <button className="btn btn-primary mt-3 fw-bold shadow" onClick={() => navigate('/categorias')}>
              Ir al Catálogo
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0 text-white fw-bold">Carrito de Compras</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={handleClear}>Vaciar carrito</button>
      </div>

      {/* Tabla con el mismo color oscuro #212529 */}
      <div className="table-responsive rounded-3 shadow-sm border border-secondary" style={{ backgroundColor: '#212529' }}>
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: 80 }}></th>
              <th>Producto</th>
              <th className="text-center">Cantidad</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, qty }) => {
              const base = Number(product.price) || 0;
              const unit = unitPrice(product);
              const subTotal = unit * qty;
              return (
                <tr key={product.id}>
                  <td className="p-2">
                    <img src={product.image?.startsWith('http') ? product.image : `/${String(product.image || '').replace(/^\/+/, '')}`}
                      alt={product.name}
                      style={{ width: 64, height: 64, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4 }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold text-white">{product.name}</div>
                    <div className="text-white-50 small">{product.category}</div>
                  </td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <button className="btn btn-outline-secondary btn-sm text-white" onClick={() => handleRemoveOne(product.id)}>–</button>
                      <span className="btn btn-dark btn-sm border-secondary disabled text-white" style={{minWidth: '30px'}}>{qty}</span>
                      <button className="btn btn-outline-secondary btn-sm text-white" onClick={() => handleAddOne(product.id)}>+</button>
                    </div>
                  </td>
                  <td className="text-end">
                    {product.offer ? (
                      <>
                        <div className="text-muted text-decoration-line-through small">{formatCLP(base)}</div>
                        <div className="fw-bold text-white">{formatCLP(unit)}</div>
                      </>
                    ) : (<div className="fw-bold text-white">{formatCLP(base)}</div>)}
                  </td>
                  <td className="text-end fw-bold text-white">{formatCLP(subTotal)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}></td>
              <td className="text-end fw-bold text-white fs-5">Total:</td>
              <td className="text-end fw-bold text-success fs-5">{formatCLP(totals.discounted)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-success btn-lg px-5 fw-bold" onClick={handleGoToCheckout}>Ir a Pagar</button>
      </div>
    </div>
  );
}