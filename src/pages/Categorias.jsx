import React from 'react';
import { listCategories, listProductsByCategory, addToCart } from '../data/data';
import ProductCard from '../components/ProductCard';

export default function Categorias(){
  // Orden fijo deseado (como en tu otra web)
  const ORDEN = ['Juegos de mesa', 'Accesorios', 'Consolas', 'PCs', 'Ropa'];

  // Obtenemos categorías que existan en datos y las ordenamos según ORDEN
  const categoriasRaw = listCategories();
  const categorias = ORDEN.filter(c => categoriasRaw.includes(c));

  const [activa, setActiva] = React.useState(categorias[0]);
  const productos = listProductsByCategory(activa);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <div className="card">
          <div className="card-header fw-bold">Categorías</div>
          <ul className="list-group list-group-flush">
            {categorias.map(c => (
              <li
                key={c}
                className={"list-group-item d-flex justify-content-between align-items-center " + (c===activa ? "active text-white" : "")}
                style={{cursor:'pointer'}}
                onClick={()=>setActiva(c)}
              >
                <span>{c}</span>
                {c===activa && <span className="badge bg-light text-dark">Activa</span>}
              </li>
            ))}
          </ul>
        </div>
      </aside>

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
