// src/pages/Carrito.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCartIds, addToCart, removeFromCart, clearCart, 
  activarOfertasFrontend, Product // 🟢 AHORA IMPORTAMOS "Product"
} from '../data/data';
import { api } from '../services/api';

// (Usamos la que viene de data.ts para evitar conflictos de tipos)

interface GroupedCartItem { product: Product; qty: number; }
interface CartTotals { original: number; discounted: number; savings: number; }

function formatCLP(v: number | string): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(v) || 0);
}

// Lógica de precio unitario
function unitPrice(product: Product): number {
  const base = Number(product.price) || 0;
  if (!product.offer) return base;

  const name = product.name.toLowerCase();
  if (name.includes('catan')) return Math.round(base * 0.80);
  if (name.includes('carcassonne')) return Math.round(base * 0.85);
  if (name.includes('polera')) return Math.round(base * 0.50);
  if (name.includes('playstation 5')) return Math.round(base * 0.90);
  
  return Math.round(base * 0.85); 
}

export default function Carrito(): JSX.Element {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos
  const refreshCart = async () => {
    const ids = getCartIds();
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const rawProducts = await api.getProducts();
      // Ahora "allProducts" es de tipo Product[] (del archivo data.ts)
      const allProducts = activarOfertasFrontend(rawProducts);
      
      // Filtramos usando el mismo tipo Product
      const cartProducts = ids.map(id => allProducts.find((p: Product) => p.id === id))
                              .filter((p): p is Product => !!p); // Filtro seguro para TypeScript

      setItems(cartProducts);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
    const handleStorageChange = () => refreshCart();
    window.addEventListener('cart:change', handleStorageChange);
    return () => window.removeEventListener('cart:change', handleStorageChange);
  }, []);

  const rows: GroupedCartItem[] = useMemo(() => {
    const map = new Map<number, GroupedCartItem>();
    for (const p of items) {
      const k = p.id;
      if (!map.has(k)) map.set(k, { product: p, qty: 0 });
      map.get(k)!.qty += 1;
    }
    return Array.from(map.values());
  }, [items]);

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

  const handleRemoveOne = (id: number) => removeFromCart(id);
  const handleAddOne = (id: number) => addToCart(id);
  const handleClear = () => clearCart();

  if (loading && items.length === 0) return <div className="container py-5 text-center text-white"><h3>Cargando...</h3></div>;

  if (!rows.length) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5 rounded-3 border border-secondary shadow text-white" style={{ backgroundColor: '#212529' }}>
            <div className="mb-3 text-white-50" style={{ fontSize: '4rem' }}>🛒</div>
            <h3 className="fw-bold text-white">Tu carrito está vacío</h3>
            <button className="btn btn-primary mt-3 fw-bold shadow" onClick={() => navigate('/categorias')}>Ir al Catálogo</button>
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

      <div className="table-responsive rounded-3 shadow-sm border border-secondary" style={{ backgroundColor: '#212529' }}>
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: 80 }}></th>
              <th>Producto</th>
              <th className="text-center">Cantidad</th>
              <th className="text-end">Precio Unitario</th>
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
                    <img src={product.image} alt={product.name} style={{ width: 64, height: 64, objectFit: 'contain', backgroundColor: '#fff', borderRadius: 4 }} />
                  </td>
                  <td>
                    <div className="fw-semibold text-white">{product.name}</div>
                    {product.offer && <span className="badge bg-warning text-dark me-2">¡Oferta!</span>}
                    <span className="text-white-50 small">{product.category}</span>
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
                        <div className="text-muted text-decoration-line-through small" style={{fontSize: '0.8rem'}}>{formatCLP(base)}</div>
                        <div className="fw-bold text-warning">{formatCLP(unit)}</div>
                      </>
                    ) : (<div className="fw-bold text-white">{formatCLP(base)}</div>)}
                  </td>
                  <td className="text-end fw-bold text-white">{formatCLP(subTotal)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {totals.savings > 0 && (
                <tr>
                  <td colSpan={3}></td>
                  <td className="text-end text-white-50">Ahorro total:</td>
                  <td className="text-end text-warning fw-bold">-{formatCLP(totals.savings)}</td>
                </tr>
            )}
            <tr>
              <td colSpan={3}></td>
              <td className="text-end fw-bold text-white fs-5">Total a Pagar:</td>
              <td className="text-end fw-bold text-success fs-4">{formatCLP(totals.discounted)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-success btn-lg px-5 fw-bold shadow" onClick={() => navigate('/checkout')}>
           Pagar {formatCLP(totals.discounted)}
        </button>
      </div>
    </div>
  );
}