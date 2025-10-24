import React from 'react';

export default function ProductCard({ product, onAdd }){
  return (
    <div className="card h-100 position-relative">
      {product.offer && <span className="badge bg-success badge-oferta">Oferta</span>}
      {product.image ? (
        <img src={product.image} className="card-img-top p-2" alt={`Imagen de ${product.name}`} />
      ) : (
        <div className="card-img-top p-2">
          <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{height:'180px'}}>
            <span className="text-muted small">Sin imagen</span>
          </div>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <h6 className="text-muted mb-1">{product.category}</h6>
        <h5 className="card-title">{product.name}</h5>
        <p className="precio mb-3">${product.price.toLocaleString()}</p>
        <div className="mt-auto d-flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={() => onAdd(product)}>Agregar</button>
          <button className="btn btn-sm btn-outline-secondary" type="button">Detalles</button>
        </div>
      </div>
    </div>
  );
}
