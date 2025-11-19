// src/pages/Carrito.tsx
import React, { useEffect, useMemo, useState } from 'react';
// Importamos las funciones centrales del carrito
import { 
  Product, 
  getCart, 
  addToCart, 
  removeFromCart, 
  removeAllFromCart, 
  clearCart 
} from '../data/data';

// Estructura para el ítem agrupado en la tabla
interface GroupedCartItem {
  product: Product;
  qty: number;
}

// Estructura para los totales
interface CartTotals {
  original: number;
  discounted: number;
  savings: number;
}

const DISCOUNT = 0.15; // % de descuento para productos en oferta

function formatCLP(v: number | string): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(v) || 0);
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

// precio unitario a cobrar (aplica descuento si corresponde)
function unitPrice(product: Product): number {
  const base = Number(product.price) || 0;
  return product.offer ? Math.round(base * (1 - DISCOUNT)) : base;
}
function unitSaving(product: Product): number {
  const base = Number(product.price) || 0;
  return product.offer ? (base - unitPrice(product)) : 0;
}

export default function Carrito(): JSX.Element {
  const [items, setItems] = useState<Product[]>(() => getCart());
  
  const [showPayForm, setShowPayForm] = useState<boolean>(false);
  const [payMethod, setPayMethod] = useState<string>('');
  const [payError, setPayError] = useState<string>('');
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'success' | 'failure'>('idle');
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

    window.addEventListener('cart:change', refresh as EventListener);
    window.addEventListener('storage', onStorage);
    
    refresh();

    return () => {
      window.removeEventListener('cart:change', refresh as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleRemoveOne = (id: number) => { removeFromCart(id); }; 
  const handleAddOne = (id: number) => { addToCart(id); };
  const handleRemoveAll = (id: number) => { removeAllFromCart(id); };
  const handleClear = () => { clearCart(); };

  // ------------------------------------------
  // ESTADO: CARRITO VACÍO (Estilo Dark Mode)
  // ------------------------------------------
  if (!rows.length) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 text-white fw-bold">Carrito</h2>
        
        {purchaseStatus === 'success' && <div className="alert alert-success">Compra realizada exitosamente.</div>}
        {purchaseStatus === 'failure' && <div className="alert alert-danger">{purchaseMessage || 'Compra fallida.'}</div>}
        
        <div className="text-center py-5 bg-dark rounded-3 border border-secondary shadow">
            <div className="mb-3 text-white-50" style={{ fontSize: '4rem' }}>🛒</div>
            <h3 className="text-white">Tu carrito está vacío</h3>
            <p className="text-white-50 mt-2">¡Explora nuestras categorías y encuentra tu próximo equipo!</p>
        </div>
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

    handleClear(); 
    setShowPayForm(false);
    setPayMethod('');
    setPayError('');
  };

  const confirmDisabled: boolean = !isLogged || !payMethod;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        {/* Título en Blanco */}
        <h2 className="mb-0 text-white fw-bold">Carrito</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={handleClear}>
          Vaciar carrito
        </button>
      </div>

      {purchaseStatus === 'success' && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>{purchaseMessage || 'Compra realizada exitosamente.'}</span>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => { setPurchaseStatus('idle'); setPurchaseMessage(''); }} />
        </div>
      )}
      {purchaseStatus === 'failure' && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{purchaseMessage || 'Compra fallida.'}</span>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => { setPurchaseStatus('idle'); setPurchaseMessage(''); }} />
        </div>
      )}

      {/* Tabla Oscura */}
      <div className="table-responsive rounded-3 shadow-sm border border-secondary" style={{ backgroundColor: '#212529' }}>
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: 80 }}></th>
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
                  <td className="p-2">
                    <img
                      src={product.image?.startsWith('http') ? product.image : `/${String(product.image || '').replace(/^\/+/, '')}`}
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
                    <div>
                      <button className="btn btn-link text-danger btn-sm mt-1 text-decoration-none" onClick={() => handleRemoveAll(product.id)}>
                        <small>Quitar todo</small>
                      </button>
                    </div>
                  </td>
                  <td className="text-end">
                    {product.offer ? (
                      <>
                        <div className="text-muted text-decoration-line-through small">{formatCLP(base)}</div>
                        <div className="fw-bold text-white">{formatCLP(unit)}</div>
                        <div className="small text-success">Ahorro: {formatCLP(base - unit)}</div>
                      </>
                    ) : (
                      <div className="fw-bold text-white">{formatCLP(base)}</div>
                    )}
                  </td>
                  <td className="text-end">
                    {product.offer ? (
                      <>
                        <div className="text-muted text-decoration-line-through small">{formatCLP(subBase)}</div>
                        <div className="fw-bold text-white">{formatCLP(subUnit)}</div>
                        <div className="small text-success">Ahorro total: {formatCLP(saved)}</div>
                      </>
                    ) : (
                      <div className="fw-bold text-white">{formatCLP(subBase)}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-top border-secondary">
              <td colSpan={3}></td>
              <td className="text-end text-success fw-semibold">Ahorro total</td>
              <td className="text-end text-success fw-semibold">{formatCLP(totals.savings)}</td>
            </tr>
            <tr>
              <td colSpan={3}></td>
              <td className="text-end fw-bold text-white fs-5">Total a pagar</td>
              <td className="text-end fw-bold text-white fs-5">{formatCLP(totals.discounted)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Formulario de Pago (Oscuro) */}
      {!showPayForm ? (
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-success btn-lg px-5 fw-bold" onClick={openPayForm}>
            Pagar
          </button>
        </div>
      ) : (
        <div className="card mt-4 bg-dark border-secondary text-white shadow-lg">
          <div className="card-body p-4">
            <h4 className="card-title mb-4 border-bottom border-secondary pb-2">Confirmar pago</h4>

            {!isLogged && (
              <div className="alert alert-warning py-2 d-flex align-items-center">
                <span className="me-2">⚠️</span>
                <div>
                  Debes <strong>iniciar sesión</strong> para completar la compra.
                </div>
              </div>
            )}

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label text-white-50 mb-2">Resumen de Productos</label>
                <div className="border border-secondary rounded p-3 bg-black bg-opacity-25"
                     style={{ maxHeight: 200, overflow: 'auto' }}>
                  {rows.map(({ product, qty }) => (
                    <div key={product.id} className="d-flex justify-content-between align-items-center py-1 border-bottom border-secondary border-opacity-25">
                      <span className="text-light">{product.name}</span>
                      <span className="badge bg-secondary">x{qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label text-white-50">Ahorro total</label>
                <div className="text-success fw-bold fs-5">{formatCLP(totals.savings)}</div>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label text-white-50">Total final</label>
                <div className="fs-4 fw-bold text-white">{formatCLP(totals.discounted)}</div>
              </div>

              <div className="col-12">
                <label className="form-label text-white">Método de pago</label>
                <select 
                  className="form-select bg-secondary text-white border-0" 
                  value={payMethod} 
                  onChange={(e) => { setPayMethod(e.target.value); setPayError(''); }}
                >
                  <option value="" className="text-white">Selecciona una opción...</option>
                  <option value="Tarjeta de Crédito/Débito">Tarjeta de Crédito/Débito</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
                {payError && <div className="text-danger small mt-2">{payError}</div>}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button className="btn btn-outline-light" onClick={cancelPay}>Cancelar</button>
              <button
                className="btn btn-success px-4 fw-bold"
                onClick={handleConfirm}
                disabled={confirmDisabled}
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