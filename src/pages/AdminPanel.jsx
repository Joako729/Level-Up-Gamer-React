import React from 'react';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../data/data';

export default function AdminPanel(){
  const [form, setForm] = React.useState({ id:null, name:'', price:0, category:'General', image:'', offer:false });
  const [lista, setLista] = React.useState(listProducts());

  function refrescar(){ setLista(listProducts()); }
  function onChange(e){
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: e.target.type==='number' ? Number(v) : v });
  }
  function onSubmit(e){
    e.preventDefault();
    if(form.id){ updateProduct(form.id, form); }
    else { createProduct(form); }
    setForm({ id:null, name:'', price:0, category:'General', image:'', offer:false });
    refrescar();
  }
  function onEdit(p){ setForm(p); }
  function onDelete(id){ deleteProduct(id); refrescar(); }

  return (
    <div>
      <h2 className="mb-3">Panel Administrativo</h2>
      <form className="row g-2 mb-3" onSubmit={onSubmit}>
        <div className="col-md-3"><input className="form-control" placeholder="Nombre" name="name" value={form.name} onChange={onChange} required /></div>
        <div className="col-md-2"><input type="number" className="form-control" placeholder="Precio" name="price" value={form.price} onChange={onChange} required /></div>
        <div className="col-md-2"><input className="form-control" placeholder="Categoría" name="category" value={form.category} onChange={onChange} /></div>
        <div className="col-md-3"><input className="form-control" placeholder="URL de imagen" name="image" value={form.image} onChange={onChange} /></div>
        <div className="col-md-1 form-check d-flex align-items-center">
          <input className="form-check-input me-2" type="checkbox" name="offer" checked={form.offer} onChange={onChange} /> Oferta
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-primary">{form.id ? 'Actualizar' : 'Crear'}</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Oferta</th><th></th></tr></thead>
          <tbody>
            {lista.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price.toLocaleString()}</td>
                <td>{p.category}</td>
                <td>{p.offer ? 'Sí' : 'No'}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>onEdit(p)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>onDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
