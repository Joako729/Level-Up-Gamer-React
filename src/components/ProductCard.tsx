// src/components/ProductCard.tsx
import React from 'react';
import { Product, addToCart } from '../data/data';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = () => {
    addToCart(product.id);
  };

  // Se aplica el fondo oscuro a la tarjeta de producto y el color del texto por defecto a claro
  return (
    <div className="card h-100 shadow-sm" style={{ backgroundColor: '#3C3C3C', color: '#E0E0E0', border: 'none' }}>
      <img
        src={product.image}
        className="card-img-top p-3"
        alt={product.name}
        // El fondo de la imagen también se pone oscuro
        style={{ height: 200, objectFit: 'contain', backgroundColor: '#3C3C3C' }} 
      />
      <div className="card-body d-flex flex-column">
        {/* Título en color claro */}
        <h5 className="card-title text-light">{product.name}</h5>
        {/* Texto de categoría en color claro */}
        <p className="card-text text-light">Categoría: {product.category}</p>
        <p className="card-text text-light">{product.description}</p>
        <div className="mt-auto">
          {product.offer && (
            <span className="badge bg-danger mb-2">¡Oferta!</span>
          )}
          {/* Precio en color claro y destacado */}
          <p className="card-text fs-4 fw-bold text-light">${product.price.toLocaleString('es-CL')}</p>
          <button onClick={handleAddToCart} className="btn btn-primary w-100">
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;