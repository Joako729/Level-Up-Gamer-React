// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Product { id: number; name: string; price: number; category: string; image: string; description: string; }

export default function AdminPanel(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Formulario
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Accesorios');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { refreshProducts(); }, []);

  const refreshProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) { console.error(e); }
  };

  const handleEditClick = (p: Product) => {
    setEditingId(p.id);
    setName(p.name); setPrice(p.price.toString()); setCategory(p.category);
    setImage(p.image); setDescription(p.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null); setName(''); setPrice(''); setImage(''); setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name, price: Number(price), category,
      image: image || '/Img/Producto_Img/mouse.png',
      description: description || 'Sin descripción'
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, productData);
        alert('Actualizado correctamente');
      } else {
        await api.createProduct(productData);
        alert('Creado correctamente');
      }
      cancelEdit();
      refreshProducts();
    } catch (error) { alert('Error al guardar.'); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar producto?')) {
      await api.deleteProduct(id);
      refreshProducts();
    }
  };

  return (
    <div className="text-white">
      <h3 className="mb-4 text-white border-bottom border-secondary pb-2">📦 Inventario de Productos</h3>
      
      {/* Formulario */}
      <div className="card bg-secondary border-0 p-4 mb-4 shadow-sm">
        <h5 className="text-white mb-3">{editingId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <input className="form-control" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <input type="number" className="form-control" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option>Accesorios</option><option>Consolas</option><option>PCs</option><option>Sillas</option><option>Juegos de Mesa</option><option>Ropa</option>
              </select>
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="URL Imagen (/Img/...)" value={image} onChange={e => setImage(e.target.value)} />
            </div>
            <div className="col-12">
              <textarea className="form-control" rows={2} placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn btn-dark fw-bold flex-grow-1">{editingId ? 'Actualizar' : 'Guardar'}</button>
            {editingId && <button type="button" onClick={cancelEdit} className="btn btn-light">Cancelar</button>}
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="card bg-dark border-secondary shadow">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead><tr><th>Img</th><th>Nombre</th><th>Precio</th><th className="text-center">Acciones</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><img src={p.image} alt="" width="40" height="40" style={{objectFit:'contain', background:'#fff', borderRadius:4}}/></td>
                  <td className="fw-bold">{p.name}</td>
                  <td>${p.price.toLocaleString('es-CL')}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditClick(p)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}