// src/pages/Categorias.tsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product, listProductsByCategory, listCategories } from '../data/data';

export default function Categorias(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todo');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Lista total de categorías (desde data.ts)
  const categories: string[] = useMemo(() => listCategories(), []);

  // Usa un memo para obtener la lista de productos basada en la categoría seleccionada
  const productsByCategory: Product[] = useMemo(() => {
    return listProductsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Aplica el filtro de búsqueda al resultado por categoría
  const filteredProducts: Product[] = useMemo(() => {
    if (!searchTerm) {
      return productsByCategory;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return productsByCategory.filter(p => 
      p.name.toLowerCase().includes(lowerCaseSearch) ||
      p.description?.toLowerCase().includes(lowerCaseSearch) ||
      p.category.toLowerCase().includes(lowerCaseSearch)
    );
  }, [productsByCategory, searchTerm]);

  // Efecto para leer los parámetros de la URL al cargar
  useEffect(() => {
    const cat = searchParams.get('cat');
    const q = searchParams.get('q');
    
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
    }
    if (q) {
      setSearchTerm(q);
    }
  }, [searchParams, categories]);
  
  // Función para manejar el cambio de categoría
  const handleCategoryChange = (e: React.MouseEvent<HTMLButtonElement>, category: string) => {
    e.preventDefault();
    setSelectedCategory(category);
    setSearchTerm(''); // Limpiar búsqueda al cambiar de categoría
  };

  // Función para manejar el cambio de búsqueda (Tipado de evento de input)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedCategory('Todo'); // Volver a "Todo" al buscar
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Catálogo de Productos</h1>

      <div className="row mb-4">
        {/* Filtros de Categoría */}
        <div className="col-md-3">
          <h5 className="mb-2">Categorías</h5>
          <div className="list-group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                onClick={(e) => handleCategoryChange(e, cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listado de Productos */}
        <div className="col-md-9">
          {/* Barra de Búsqueda */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder={`Buscar en ${selectedCategory}...`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <h2 className="mb-3">{selectedCategory} ({filteredProducts.length})</h2>

          {filteredProducts.length === 0 ? (
            <div className="alert alert-warning">
              No se encontraron productos en esta categoría o con el término de búsqueda.
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
