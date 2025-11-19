// src/pages/Carrito.tsx
import React, { useEffect, useMemo, useState } from 'react';

// Estructura del ítem guardado en el carrito (debe ser consistente con ProductCard)
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  offer: boolean;
  offerLabel: string | null;
  description: string | null;
}

// Estructura para el ítem agrupado en la tabla
interface GroupedCartItem {
  product: CartItem;
  qty: number;
}

// Estructura para los totales
interface CartTotals {
  original: number;
  discounted: number;
  savings: number;
}

/* === utilidades carrito locales (usa el mismo STORAGE_KEY que ProductCard) === */
const STORAGE_KEY = 'cart_v1';
const DISCOUNT = 0.15; // % de descuento para productos en oferta

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch { return []; }
}
function writeCart(list: CartItem[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  window.dispatchEvent(new Event('cart:change'));
}
function getCart(): CartItem[] { return readCart(); }
function addToCart(product: CartItem): void {
  if (!product?.id) return;
  const cart = readCart();
  cart.push(product);
  writeCart(cart);
}
function removeFromCart(id: number): void {
  const cart = readCart();
  const idx = cart.findIndex((p) => p.id === id);
  if (idx >= 0) {
    cart.splice(idx, 1);
    writeCart(cart);
  }
}
function removeAllFromCart(id: number): void {
  const next = readCart().filter((p) => p.id !== id);
  writeCart(next);
}
function clearCart(): void { writeCart([]); }

function formatCLP(v: number | string): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(v) || 0);
}

function groupCart(list: CartItem[]): GroupedCartItem[] {
  const map = new Map<number, GroupedCartItem>();
  for (const p of list) {
    const k = p.id;
    if (!map.has(k)) map.set(k, { product: p, qty: 0 });
    map.get(k)!.qty += 1;
  }
  return Array.from(map.values());
}

// precio unitario a cobrar (aplica descuento si corresponde)
function unitPrice(product: CartItem): number {
  const base = Number(product.price) || 0;
  return product.offer ? Math.round(base * (1 - DISCOUNT)) : base;
}
function unitSaving(product: CartItem): number {
  const base = Number(product.price) || 0;
  return product.offer ? (base - unitPrice(product)) : 0;
}
/* === fin utilidades === */

export default function Carrito(): JSX.Element {
  const [items, setItems] = useState<CartItem[]>(() => getCart());
  const [showPayForm, setShowPayForm] = useState<boolean>(false);
  const [payMethod, setPayMethod] = useState<string>('');
  const [payError, setPayError] = useState<string>('');
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'success' | 'failure'>('idle'); // Estado con unión de tipos
  const [purchaseMessage, setPurchaseMessage] = useState<string>('');
  const [isLogged, setIsLogged] = useState<boolean>(() => {
    try { return localStorage.getItem('user_logged') === '1'; } catch { return false; }
  });

  const rows: GroupedCartItem[] = useMemo(() => groupCart(items), [items]);

  const totals: CartTotals = useMemo(() => {
    let original: number = 0;
    let discounted: number = 0;
    let savings: number = 0;
    for (const { product, qty } of rows) {
      const base: number = Number(product.price) || 0;
      const unit: number = unitPrice(product);
      const save: number = unitSaving(product);
      original += base * qty;
      discounted += unit * qty;
      savings += save * qty;
    }
    return { original, discounted, savings };
  }, [rows]);

  useEffect(() => {
    const refresh = () => setItems(getCart());
    const onStorage = () => {
      refresh();
      try { setIsLogged(localStorage.getItem('user_logged') === '1'); } catch {}
    };
    // Se añade un cast para que TypeScript acepte la función como EventListener
    window.addEventListener('cart:change', refresh as EventListener);
    window.addEventListener('storage', onStorage);
    refresh();
    return () => {
      window.removeEventListener('cart:change', refresh as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  if (!rows.length) {
    return (
      <div className="container py-4">
        <h2 className="mb-3">Carrito</h2>
        {purchaseStatus === 'success' && <div className="alert alert-success">Compra realizada exitosamente.</div>}
        {purchaseStatus === 'failure' && <div className="alert alert-danger">{purchaseMessage || 'Compra fallida.'}</div>}
        <p className="text-muted">Tu carrito está vacío.</p>
      </div>
    );
  }

  const openPayForm = () => {
    setShowPayForm(true);
    setPayError('');
    setPurchaseStatus('idle');
    setPurchaseMessage('');
  };

  const cancelPay = () => {
    setShowPayForm(false);
    setPayMethod('');
    setPayError('');
  };

  const handleConfirm = () => {
    if (!isLogged) {
      setPayError('Debes iniciar sesión para confirmar la compra.');
      setPurchaseStatus('failure');
      setPurchaseMessage('Compra fallida: debes iniciar sesión para continuar.');
      return;
    }
    if (!payMethod) {
      setPayError('Selecciona un método de pago.');
      setPurchaseStatus('failure');
      setPurchaseMessage('Compra fallida: selecciona un método de pago.');
      return;
    }

    const detalle = rows.map(r => `• ${r.product.name} x${r.qty}`).join('  |  ');
    setPurchaseStatus('success');
    setPurchaseMessage(
      `Compra realizada exitosamente. ${detalle}  •  Total: ${formatCLP(totals.discounted)}  •  Método: ${payMethod}`
    );

    clearCart();
    setItems(getCart());
    setShowPayForm(false);
    setPayMethod('');
    setPayError('');
  };

  const confirmDisabled: boolean = !isLogged || !payMethod;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Carrito</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={() => { clearCart(); setItems(getCart()); }}>
          Vaciar carrito
        </button>
      </div>

      {/* Mensajes globales */}
      {purchaseStatus === 'success' && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>{purchaseMessage || 'Compra realizada exitosamente.'}</span>
          <button type="button" className="btn-close" aria-label="Cerrar"
            onClick={() => { setPurchaseStatus('idle'); setPurchaseMessage(''); }} />
        </div>
      )}
      {purchaseStatus === 'failure' && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{purchaseMessage || 'Compra fallida.'}</span>
          <button type="button" className="btn-close" aria-label="Cerrar"
            onClick={() => { setPurchaseStatus('idle'); setPurchaseMessage(''); }} />
        </div>
      )}

      {/* tabla con fondo negro */}
      <div className="table-responsive"
           style={{ backgroundColor: 'black', color: 'white', borderRadius: '10px', padding: '16px' }}>
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: 64 }}></th>
              <th>Producto</th>
              <th className="text-center" style={{ width: 160 }}>Cantidad</th>
              <th className="text-end" style={{ width: 180 }}>Precio</th>
              <th className="text-end" style={{ width: 200 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, qty }) => {
              const base: number = Number(product.price) || 0;
              const unit: number = unitPrice(product);
              const subBase: number = base * qty;
              const subUnit: number = unit * qty;
              const saved: number = (base - unit) * qty;

              return (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image?.startsWith('http') ? product.image : `/${String(product.image || '').replace(/^\/+/, '')}`}
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
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => { removeFromCart(product.id); setItems(getCart()); }}>–</button>
                      <span className="btn btn-light btn-sm disabled">{qty}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => { addToCart(product); setItems(getCart()); }}>+</button>
                    </div>
                    <div>
                      <button className="btn btn-link text-danger btn-sm mt-1"
                        onClick={() => { removeAllFromCart(product.id); setItems(getCart()); }}>
                        Quitar todo
                      </button>
                    </div>
                  </td>
                  {/* Precio unitario */}
                  <td className="text-end">
                    {product.offer ? (
                      <>
                        <div className="text-muted" style={{ textDecoration: 'line-through' }}>
                          {formatCLP(base)}
                        </div>
                        <div className="fw-bold">{formatCLP(unit)}</div>
                        <div className="small text-success">Ahorro: {formatCLP(base - unit)} c/u</div>
                      </>
                    ) : (
                      <div className="fw-bold">{formatCLP(base)}</div>
                    )}
                  </td>
                  {/* Subtotal */}
                  <td className="text-end">
                    {product.offer ? (
                      <>
                        <div className="text-muted" style={{ textDecoration: 'line-through' }}>
                          {formatCLP(subBase)}
                        </div>
                        <div className="fw-bold">{formatCLP(subUnit)}</div>
                        <div className="small text-success">Ahorro: {formatCLP(saved)}</div>
                      </>
                    ) : (
                      <div className="fw-bold">{formatCLP(subBase)}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}></td>
              <td className="text-end text-success fw-semibold">Ahorro total</td>
              <td className="text-end text-success fw-semibold">{formatCLP(totals.savings)}</td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td className="text-end fw-bold">Total a pagar</td>
              <td className="text-end fw-bold">{formatCLP(totals.discounted)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Botón Pagar o Formulario inline */}
      {!showPayForm ? (
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-success btn-lg" onClick={openPayForm}>
            Pagar
          </button>
        </div>
      ) : (
        <div className="card mt-3" style={{ background: '#101010', color: '#fff', borderColor: '#333' }}>
          <div className="card-body">
            <h5 className="card-title mb-3">Confirmar pago</h5>

            {!isLogged && (
              <div className="alert alert-warning py-2">
                Debes <strong>iniciar sesión</strong> para completar la compra.
                Usa el botón <em>“Iniciar sesión”</em> en la esquina superior derecha.
              </div>
            )}

            <div className="row g-3">
              {/* Lista de productos por nombre y cantidad */}
              <div className="col-12 col-md-6">
                <label className="form-label text-muted mb-1">Productos</label>
                <div className="border rounded p-2"
                     style={{ background: '#0d0d0d', borderColor: '#2a2a2a', maxHeight: 200, overflow: 'auto' }}>
                  {rows.map(({ product, qty }) => (
                    <div key={product.id} className="d-flex justify-content-between align-items-center py-1">
                      <span>{product.name}</span>
                      <span className="badge bg-secondary">x{qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="col-12 col-md-3">
                <label className="form-label text-muted mb-1">Ahorro total</label>
                <div className="text-success fw-semibold">{formatCLP(totals.savings)}</div>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label text-muted mb-1">Total a pagar</label>
                <div className="fs-5 fw-bold">{formatCLP(totals.discounted)}</div>
              </div>

              {/* Método de pago */}
              <div className="col-12">
                <label className="form-label">Método de pago</label>
                <select className="form-select" value={payMethod} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setPayMethod(e.target.value); setPayError(''); }}>
                  <option value="">Selecciona…</option>
                  <option value="Tarjeta de Crédito/Débito">Tarjeta de Crédito/Débito</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
                {payError && <div className="text-danger small mt-1">{payError}</div>}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-light" onClick={cancelPay}>Cancelar</button>
              <button
                className="btn btn-success"
                onClick={handleConfirm}
                disabled={confirmDisabled}
                title={!isLogged ? 'Inicia sesión para continuar' : (!payMethod ? 'Selecciona método de pago' : '')}
              >
                Confirmar compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}