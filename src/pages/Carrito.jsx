// src/pages/Carrito.jsx
import React, { useEffect, useMemo, useState } from 'react';

/* === utilidades de carrito locales (sin archivos nuevos) === */
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
function getCart() { return readCart(); }
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
function clearCart() { writeCart([]); }
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
function isUserLogged() {
  try { return localStorage.getItem('user_logged') === '1'; } catch { return false; }
}
/* === fin utilidades === */

export default function Carrito() {
  const [items, setItems] = useState(() => getCart());
  const [showPayForm, setShowPayForm] = useState(false);
  const [payMethod, setPayMethod] = useState('');
  const [payError, setPayError] = useState('');

  // estados de resultado de compra
  const [purchaseStatus, setPurchaseStatus] = useState('idle'); // 'idle' | 'success' | 'failure'
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const [isLogged, setIsLogged] = useState(isUserLogged());

  const rows = useMemo(() => groupCart(items), [items]);
  const total = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.product.price) || 0) * r.qty, 0),
    [rows]
  );

  // actualizar carrito y login en cambios
  useEffect(() => {
    const refreshCart = () => setItems(getCart());
    const refreshLogin = () => setIsLogged(isUserLogged());

    window.addEventListener('cart:change', refreshCart);
    window.addEventListener('storage', () => { refreshCart(); refreshLogin(); });

    refreshCart();
    refreshLogin();

    return () => {
      window.removeEventListener('cart:change', refreshCart);
      window.removeEventListener('storage', () => { refreshCart(); refreshLogin(); });
    };
  }, []);

  if (!rows.length) {
    return (
      <div className="container py-4">
        <h2 className="mb-3">Carrito</h2>
        {/* Mensajes si los hubiese */}
        {purchaseStatus === 'success' && (
          <div className="alert alert-success">Compra realizada exitosamente.</div>
        )}
        {purchaseStatus === 'failure' && (
          <div className="alert alert-danger">{purchaseMessage || 'Compra fallida.'}</div>
        )}
        <p className="text-muted">Tu carrito está vacío.</p>
      </div>
    );
  }

  const openPayForm = () => {
    setShowPayForm(true);
    setPayError('');
    // limpiar mensajes anteriores al abrir el pago
    setPurchaseStatus('idle');
    setPurchaseMessage('');
  };

  const cancelPay = () => {
    setShowPayForm(false);
    setPayMethod('');
    setPayError('');
  };

  const handleConfirm = () => {
    // validaciones -> si falla, mostramos MENSAJE DE COMPRA FALLIDA
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

    // Éxito -> MENSAJE DE COMPRA EXITOSA
    const detalle = rows.map(r => `• ${r.product.name} x${r.qty}`).join('  |  ');
    setPurchaseStatus('success');
    setPurchaseMessage(`Compra realizada exitosamente. ${detalle}  •  Total: ${formatCLP(total)}  •  Método: ${payMethod}`);

    // limpiar carrito y formulario
    clearCart();
    setItems(getCart());
    setShowPayForm(false);
    setPayMethod('');
    setPayError('');
  };

  const confirmDisabled = !isLogged || !payMethod;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Carrito</h2>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => { clearCart(); setItems(getCart()); }}
        >
          Vaciar carrito
        </button>
      </div>

      {/* Mensajes globales de éxito / fallo de compra */}
      {purchaseStatus === 'success' && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>{purchaseMessage || 'Compra realizada exitosamente.'}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => { setPurchaseStatus('idle'); setPurchaseMessage(''); }}
          />
        </div>
      )}
      {purchaseStatus === 'failure' && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{purchaseMessage || 'Compra fallida.'}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => { setPurchaseStatus('idle'); setPurchaseMessage(''); }}
          />
        </div>
      )}

      {/* tabla con fondo negro */}
      <div
        className="table-responsive"
        style={{ backgroundColor: 'black', color: 'white', borderRadius: '10px', padding: '16px' }}
      >
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
              <td colSpan={3}></td>
              <td className="text-end fw-bold">Total</td>
              <td className="text-end fw-bold">{formatCLP(total)}</td>
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
                <div
                  className="border rounded p-2"
                  style={{ background: '#0d0d0d', borderColor: '#2a2a2a', maxHeight: 180, overflow: 'auto' }}
                >
                  {rows.map(({ product, qty }) => (
                    <div key={product.id} className="d-flex justify-content-between align-items-center py-1">
                      <span>{product.name}</span>
                      <span className="badge bg-secondary">x{qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="col-12 col-md-3">
                <label className="form-label text-muted mb-1">Total a pagar</label>
                <div className="fs-5 fw-bold">{formatCLP(total)}</div>
              </div>

              {/* Método de pago */}
              <div className="col-12 col-md-3">
                <label className="form-label">Método de pago</label>
                <select
                  className="form-select"
                  value={payMethod}
                  onChange={(e) => { setPayMethod(e.target.value); setPayError(''); }}
                >
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




