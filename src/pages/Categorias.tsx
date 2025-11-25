// src/pages/Categorias.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api'; // Importamos la API real

// Definimos la interfaz aquí o impórtala de types
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  offer: boolean;
  description: string;
}

export default function Categorias(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Estado para productos reales
  const [loading, setLoading] = useState(true);

  // 1. Cargar productos desde el Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setAllProducts(data);
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

  // 2. Calcular categorías dinámicamente basadas en lo que hay en la BD
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(allProducts.map(p => p.category)));
    return ['Todo', ...uniqueCats];
  }, [allProducts]);

  // 3. Filtrar
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (selectedCategory !== 'Todo') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [selectedCategory, searchQuery, allProducts]);

  // 4. Helper para contar
  const getCount = (cat: string) => {
    let res = allProducts;
    if (cat !== 'Todo') res = res.filter(p => p.category === cat);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
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
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 rounded bg-dark border border-secondary shadow-sm">
            <div>
              <h2 className="mb-0 text-white fs-3">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Catálogo de Productos'}
              </h2>
              <span className="text-muted">
                Mostrando {filteredProducts.length} productos de la Base de Datos
              </span>
            </div>
            {searchQuery && (
              <button onClick={clearSearch} className="btn btn-outline-danger btn-sm mt-3 mt-md-0">
                Borrar búsqueda ✖
              </button>
            )}
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
             <div className="text-center py-5"><h4 className="text-white">No hay productos aquí.</h4></div>
          )}
        </div>
      </div>
    </div>
  );
}