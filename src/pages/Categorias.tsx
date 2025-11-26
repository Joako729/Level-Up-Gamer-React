// src/pages/Categorias.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { Product } from '../data/data';

export default function Categorias(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos y normalizar categorías
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        
        // 🟢 NORMALIZACIÓN DE CATEGORÍAS
        const normalizedData = data.map((p: any) => {
            // 1. Unificar Mobiliario y Periféricos en "Accesorios"
            if (p.category === 'Mobiliario' || 
                p.category === 'Periféricos' || 
                p.category === 'Perifericos') {
                return { ...p, category: 'Accesorios' };
            }
            // 2. 🟢 CORRECCIÓN: Cambiar "Computadoras" por "PCs" para que el botón funcione
            if (p.category === 'Computadoras' || p.category === 'Computadores') {
                 return { ...p, category: 'PCs' };
            }
            
            return p;
        });

        setAllProducts(normalizedData);
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const selectedCategory = searchParams.get('cat') || 'Todo';
  const searchQuery = searchParams.get('q') || '';

  // Generar lista de categorías
  const categories = useMemo(() => {
    if (allProducts.length === 0) return ['Todo'];
    const uniqueCats = Array.from(new Set(allProducts.map(p => p.category))).sort();
    return ['Todo', ...uniqueCats];
  }, [allProducts]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (selectedCategory !== 'Todo') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        return nameMatch || descMatch;
      });
    }
    
    return result;
  }, [selectedCategory, searchQuery, allProducts]);

  const getCount = (cat: string) => {
    let res = allProducts;
    if (cat !== 'Todo') res = res.filter(p => p.category === cat);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return res.length;
  };

  const handleCategoryChange = (cat: string) => {
    const params: any = {};
    if (cat !== 'Todo') params.cat = cat;
    setSearchParams(params);
  };

  const clearSearch = () => {
    const params: any = {};
    if (selectedCategory !== 'Todo') params.cat = selectedCategory;
    setSearchParams(params);
  };

  if (loading) return <div className="text-center py-5 text-white"><h2>Cargando Catálogo...</h2></div>;

  return (
    <div className="container py-4">
      <div className="row">
        {/* BARRA LATERAL */}
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
                        isActive ? 'btn-primary text-white fw-bold' : 'btn-dark text-white-50 hover-white'
                      }`}
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

        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-9">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 rounded bg-dark border border-secondary shadow-sm">
            <div>
              <h2 className="mb-0 text-white fs-3">
                {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory === 'Todo' ? 'Todo el Catálogo' : selectedCategory}
              </h2>
              <span className="text-muted">
                Mostrando {filteredProducts.length} productos
              </span>
            </div>
            {searchQuery && (
              <button onClick={clearSearch} className="btn btn-outline-danger btn-sm mt-3 mt-md-0">
                Borrar búsqueda ✖
              </button>
            )}
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h3 className="text-white-50">No hay productos en esta categoría.</h3>
                <button className="btn btn-outline-light mt-3" onClick={() => handleCategoryChange('Todo')}>
                  Ver todo el catálogo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}