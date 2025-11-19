// src/pages/Categorias.tsx
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { listProducts, listCategories } from '../data/data';

export default function Categorias(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. Leemos directamente de la URL para sincronizarnos con el Navbar
  const selectedCategory = searchParams.get('cat') || 'Todo';
  const searchQuery = searchParams.get('q') || '';

  // Obtener todos los productos y categorías
  const allProducts = useMemo(() => listProducts(), []);
  const categories = useMemo(() => listCategories(), []);

  // 2. Filtro Principal (Categoría + Búsqueda)
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Filtrar por Categoría
    if (selectedCategory !== 'Todo') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filtrar por Búsqueda (nombre o descripción)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [selectedCategory, searchQuery, allProducts]);

  // 3. Helper para contar productos (considerando la búsqueda actual)
  const getCount = (cat: string) => {
    let res = allProducts;
    
    // Si la categoría es específica, filtramos
    if (cat !== 'Todo') {
      res = res.filter(p => p.category === cat);
    }
    
    // Si hay búsqueda activa, contamos solo los que coinciden
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    
    return res.length;
  };

  // Al cambiar categoría, limpiamos la búsqueda para ver todos los productos de esa sección
  const handleCategoryChange = (cat: string) => {
    const params: any = {};
    if (cat !== 'Todo') params.cat = cat;
    // No incluimos 'q', así que se borra la búsqueda al cambiar de categoría
    setSearchParams(params);
  };

  // Al borrar filtro de búsqueda
  const clearSearch = () => {
    const params: any = {};
    if (selectedCategory !== 'Todo') params.cat = selectedCategory;
    setSearchParams(params);
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* BARRA LATERAL (Filtros) */}
        <div className="col-lg-3 mb-4">
          <div className="card bg-dark border-secondary shadow-sm">
            <div className="card-header bg-transparent border-secondary">
              <h4 className="mb-0 text-white">Categorías</h4>
            </div>
            <ul className="list-group list-group-flush">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = getCount(cat);
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
                      <span className={`badge ${isActive ? 'bg-light text-primary' : 'bg-secondary text-white'}`}>
                        {count}
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
          
          {/* Header de Resultados */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 rounded bg-dark border border-secondary shadow-sm">
            <div>
              <h2 className="mb-0 text-white fs-3">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Catálogo de Productos'}
              </h2>
              <span className="text-muted">
                {selectedCategory !== 'Todo' && <span className="badge bg-secondary me-2">{selectedCategory}</span>}
                Mostrando {filteredProducts.length} productos
              </span>
            </div>
            
            {/* Botón para limpiar búsqueda si existe */}
            {searchQuery && (
              <button onClick={clearSearch} className="btn btn-outline-danger btn-sm mt-3 mt-md-0">
                Borrar búsqueda ✖
              </button>
            )}
          </div>

          {/* Grilla de Productos */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Mensaje sin resultados */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-5 bg-dark rounded border border-secondary">
              <div className="fs-1 mb-3">🔍</div>
              <h4 className="text-white">No encontramos lo que buscas</h4>
              <p className="text-white-50">
                Intenta con otra palabra clave o navega por las categorías.
              </p>
              <button onClick={clearSearch} className="btn btn-primary mt-2">
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}