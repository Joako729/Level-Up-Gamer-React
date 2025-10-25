import React from 'react';
import { listCategories, listProductsByCategory, listProducts, addToCart } from '../data/data';
import ProductCard from '../components/ProductCard';

export default function Categorias() {
  // Orden fijo deseado
  const ORDEN = ['Todos', 'Juegos de mesa', 'Accesorios', 'Consolas', 'PCs', 'Ropa'];

  // Traemos categorías reales y anteponemos "Todos"
  const categoriasRaw = listCategories();
  const categorias = ['Todos', ...ORDEN.filter(c => c !== 'Todos' && categoriasRaw.includes(c))];

  const [activa, setActiva] = React.useState(categorias[0]);

  // Si es "Todos", mostramos todo el catálogo
  const productos = activa === 'Todos'
    ? listProducts()
    : listProductsByCategory(activa);

  return (
    <div className="row g-4">
      {/* Sidebar de categorías */}
      <aside className="col-12 col-lg-3">
        <div className="card">
          <div className="card-header fw-bold">Categorías</div>
          <ul className="list-group list-group-flush">
            {categorias.map(c => (
              <li
                key={c}
                className={
                  'list-group-item d-flex justify-content-between align-items-center ' +
                  (c === activa ? 'active text-white' : '')
                }
                style={{ cursor: 'pointer' }}
                onClick={() => setActiva(c)}
              >
                <span>{c}</span>
                {c === activa && (
                  <span className="badge bg-light text-dark">Activa</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Productos */}
      <section className="col-12 col-lg-9">
        <h2 className="titulo-seccion mb-3">{activa}</h2>
        <div className="row g-3">
          {productos.map(p => (
            <div className="col-12 col-md-6 col-lg-4" key={p.id}>
              <ProductCard product={p} onAdd={addToCart} />
            </div>
          ))}
          {productos.length === 0 && (
            <div className="text-muted">No hay productos en esta categoría.</div>
          )}
        </div>
      </section>
    </div>
  );
}

