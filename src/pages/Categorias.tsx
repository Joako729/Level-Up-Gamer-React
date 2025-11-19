// src/pages/Categorias.tsx
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { listProducts, listCategories } from '../data/data';

export default function Categorias(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'Todo';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);

  // Obtener todos los productos y categorías
  const allProducts = useMemo(() => listProducts(), []);
  const categories = useMemo(() => listCategories(), []); // ['Todo', 'Accesorios', ...]

  // Filtramos los productos según la selección
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todo') return allProducts;
    return allProducts.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, allProducts]);

  // Helper para contar productos por categoría
  const getCount = (cat: string) => {
    if (cat === 'Todo') return allProducts.length;
    return allProducts.filter((p) => p.category === cat).length;
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams({ cat: cat === 'Todo' ? '' : cat });
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* BARRA LATERAL (Filtros) */}
        <div className="col-lg-3 mb-4">
          <div className="card bg-dark border-secondary shadow-sm">
            <div className="card-header bg-transparent border-secondary">
              {/* TÍTULO BLANCO */}
              <h4 className="mb-0 text-white">Categorías</h4>
            </div>
            <ul className="list-group list-group-flush">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <li key={cat} className="list-group-item bg-dark border-secondary p-0">
                    <button
                      onClick={() => handleCategoryChange(cat)}
                      className={`btn w-100 text-start rounded-0 py-3 px-4 d-flex justify-content-between align-items-center ${
                        isActive 
                          ? 'btn-primary text-white fw-bold' 
                          : 'btn-dark text-white-50 hover-white'
                      }`}
                      style={{ transition: 'all 0.2s' }}
                    >
                      <span>{cat}</span>
                      {/* CONTADOR (ej: 10) */}
                      <span className={`badge ${isActive ? 'bg-light text-primary' : 'bg-secondary text-white'}`}>
                        {getCount(cat)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded bg-dark border border-secondary shadow-sm">
            {/* TÍTULO CATÁLOGO BLANCO */}
            <h2 className="mb-0 text-white fs-3">Catálogo de Productos</h2>
            <span className="text-muted">
              Mostrando {filteredProducts.length} resultados
            </span>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-12 text-center py-5">
                <p className="text-white-50 fs-5">No se encontraron productos en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}