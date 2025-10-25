import React, { useEffect, useMemo, useState } from 'react'
import { getCart, addToCart, removeFromCart, clearCart } from '../data/data'

const formatCLP = (v) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

function groupCart(list) {
  const map = new Map()
  for (const p of list) {
    const k = p.id
    if (!map.has(k)) map.set(k, { product: p, qty: 0 })
    map.get(k).qty += 1
  }
  return Array.from(map.values())
}

export default function Carrito() {
  const [items, setItems] = useState(() => getCart())

  const groups = useMemo(() => groupCart(items), [items])
  const total = useMemo(
    () => groups.reduce((s, g) => s + g.product.price * g.qty, 0),
    [groups]
  )

  const handleAdd = (id) => {
    addToCart(id)
    setItems(getCart())
  }
  const handleRemove = (id) => {
    removeFromCart(id)
    setItems(getCart())
  }
  const handleClear = () => {
    clearCart()
    setItems(getCart())
  }

  useEffect(() => {
    setItems(getCart())
  }, [])

  if (!groups.length) {
    return (
      <div className="container py-4">
        <h2 className="mb-3">Carrito</h2>
        <p className="text-muted">Tu carrito está vacío.</p>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Carrito</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={handleClear}>
          Vaciar carrito
        </button>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th style={{ width: 64 }}></th>
              <th>Producto</th>
              <th className="text-center" style={{ width: 140 }}>Cantidad</th>
              <th className="text-end" style={{ width: 140 }}>Precio</th>
              <th className="text-end" style={{ width: 160 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ product, qty }) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image.startsWith('http') ? product.image : `/${product.image.replace(/^\/+/, '')}`}
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
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleRemove(product.id)}>–</button>
                    <span className="btn btn-light btn-sm disabled">{qty}</span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleAdd(product.id)}>+</button>
                  </div>
                </td>
                <td className="text-end">{formatCLP(product.price)}</td>
                <td className="text-end">{formatCLP(product.price * qty)}</td>
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
  )
}

