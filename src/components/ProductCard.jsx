import React from 'react'

export default function ProductCard({ product, onAdd }) {
  if (!product) return null

  const {
    id,
    name,
    image,
    category,
    price,
    description,
    offer,
    offerText,
  } = product

  const formatCLP = (v) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

  return (
    <div className="card h-100 shadow-sm border-0">
      {/* Imagen */}
      <div className="ratio ratio-4x3 bg-light">
        <img
          src={image}
          alt={name}
          className="card-img-top object-fit-cover"
          style={{ borderTopLeftRadius: '.5rem', borderTopRightRadius: '.5rem' }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        {/* Título + categoría */}
        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
          <h5 className="card-title mb-0 text-truncate" title={name}>{name}</h5>
          {category && (
            <span className="badge text-bg-secondary" title={category}>
              {category}
            </span>
          )}
        </div>

        {offerText && (
          <div className="mb-2">
            <span className="badge text-bg-success">{offerText}</span>
          </div>
        )}

        {/* Precio */}
        <div className="d-flex align-items-baseline gap-2 mb-2">
          <span className="fw-bold">{formatCLP(price)}</span>
          {offer && !offerText && (
            <span className="badge text-bg-success">Oferta</span>
          )}
        </div>

        {description && (
          <p className="card-text text-muted small mb-3" style={{ lineHeight: 1.35 }}>
            {description}
          </p>
        )}

        <div className="mt-auto">
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => onAdd && onAdd(product)}
            aria-label={`Agregar ${name} al carrito`}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}


