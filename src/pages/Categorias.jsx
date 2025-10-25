import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  listCategories,
  listProducts,
  listProductsByCategory,
  addToCart,
} from '../data/data';
import ProductCard from '../components/ProductCard';

export default function Categorias() {
  const [params, setParams] = useSearchParams();

  // Orden deseado para mostrar
  const ORDEN = ['Todos', 'Juegos de mesa', 'Accesorios', 'Consolas', 'PCs', 'Ropa'];

  // Leemos categorías reales una sola vez
  const reales = React.useMemo(() => listCategories(), []);
  const categorias = React.useMemo(
    () => ['Todos', ...ORDEN.filter((c) => c !== 'Todos' && reales.includes(c))],
    [reales]
  );

  // Estado de categoría activa (por defecto "Todos")
  const [activa, setActiva] = React.useState('Todos');

  // Sincroniza el estado con ?cat= cuando cambia el URL
  React.useEffect(() => {
    const c = params.get('cat');
    if (c && categorias.includes(c)) {
      setActiva(c);
    } else if (!c) {
      setActiva('Todos');
    }
  }, [params, categorias]);

  // Al seleccionar desde el sidebar, actualiza estado y URL
  function handleSelect(c) {
    setActiva(c);
    setParams(c === 'Todos' ? {} : { cat: c }, { replace: false });
  }

  // Productos según la categoría activa
  const productos = React.useMemo(
    () => (activa === 'Todos' ? listProducts() : listProductsByCategory(activa)),
    [activa]
  );

  return (
    <div className="row g-4">
      {/* Sidebar fijo */}
      <aside className="col-12 col-lg-3">
        <div className="card sticky-sidebar">
          <div className="card-header fw-bold">Categorías</div>
          <ul className="list-group list-group-flush">
            {categorias.map((c) => (
              <li
                key={c}
                className={
                  'list-group-item d-flex justify-content-between align-items-center ' +
                  (c === activa ? 'active text-white' : '')
                }
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelect(c)}
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

      {/* Lista de productos */}
      <section className="col-12 col-lg-9">
        <h2 className="titulo-seccion mb-3">{activa}</h2>
        <div className="row g-3">
          {productos.map((p) => (
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
