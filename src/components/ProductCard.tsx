import React from 'react';
import { Link } from 'react-router-dom'; // 🟢 IMPORTAR
import { Product, addToCart } from '../data/data';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = () => {
    addToCart(product.id);
  };

  return (
    <div className="card h-100 shadow-sm" style={{ backgroundColor: '#3C3C3C', color: '#E0E0E0', border: 'none' }}>
      
      {/* 🟢 IMAGEN CON LINK */}
      <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none' }}>
          <img
            src={product.image}
            className="card-img-top p-3"
            alt={product.name}
            style={{ height: 200, objectFit: 'contain', backgroundColor: '#3C3C3C', cursor: 'pointer' }} 
          />
      </Link>

      <div className="card-body d-flex flex-column">
        {/* 🟢 TÍTULO CON LINK */}
        <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h5 className="card-title text-light">{product.name}</h5>
        </Link>
        
        <p className="card-text text-light small">Categoría: {product.category}</p>
        <p className="card-text text-light text-truncate">{product.description}</p>
        
        <div className="mt-auto">
          {product.offer && (
            <span className="badge bg-danger mb-2">¡Oferta!</span>
          )}
          <p className="card-text fs-4 fw-bold text-light">${product.price.toLocaleString('es-CL')}</p>
          
          <div className="d-grid gap-2">
            <button onClick={handleAddToCart} className="btn btn-primary">
                Añadir al Carrito
            </button>
            
            {/* 🟢 BOTÓN EXTRA PARA VER DETALLE */}
            <Link to={`/producto/${product.id}`} className="btn btn-outline-light btn-sm">
                Ver Reseñas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;