// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
// Asegúrate de que la ruta a data sea correcta
import { Product, listProducts, createProduct, deleteProduct } from '../data/data';

interface AdminPanelProps {
  onLogout?: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estados formulario
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Accesorios');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [offer, setOffer] = useState(false);

  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = () => {
    setProducts([...listProducts()]);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Nombre y Precio son obligatorios');
      return;
    }

    createProduct({
      name,
      price: Number(price),
      category,
      image: image || 'img/Producto_img/mouse.png',
      description: description || 'Sin descripción',
      offer
    });

    // Limpiar campos
    setName('');
    setPrice('');
    setImage('');
    setDescription('');
    setOffer(false);
    
    alert('Producto creado exitosamente');
    refreshProducts();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(id);
      refreshProducts();
    }
  };

  return (
    <div className="container py-5">
      
      {/* Encabezado con Botón Cerrar Sesión */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
        <h2 className="text-white fw-bold mb-0">Panel de Administración</h2>
        {onLogout && (
          <button onClick={onLogout} className="btn btn-danger fw-bold">
            Cerrar Sesión
          </button>
        )}
      </div>
      
      {/* Formulario Agregar Producto */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              
              <h3 className="text-center mb-4 text-white fw-bold">Agregar Nuevo Producto</h3>
              
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label text-light">Nombre</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary text-white border-0"
                    placeholder="Ej: Mouse Gamer X"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label text-light">Precio</label>
                    <input 
                      type="number" 
                      className="form-control bg-secondary text-white border-0"
                      placeholder="9990"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light">Categoría</label>
                    <select 
                      className="form-select bg-secondary text-white border-0"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="Accesorios">Accesorios</option>
                      <option value="Consolas">Consolas</option>
                      <option value="PCs">PCs</option>
                      <option value="Sillas">Sillas</option>
                      <option value="Juegos de Mesa">Juegos de Mesa</option>
                      <option value="Ropa">Ropa</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">URL Imagen</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary text-white border-0"
                    placeholder="http://..."
                    value={image}
                    onChange={e => setImage(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">Descripción</label>
                  <textarea 
                    className="form-control bg-secondary text-white border-0"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-check mb-4">
                  <input 
                    className="form-check-input bg-secondary border-0" 
                    type="checkbox" 
                    id="offerCheck"
                    checked={offer}
                    onChange={e => setOffer(e.target.checked)}
                  />
                  <label className="form-check-label text-white" htmlFor="offerCheck">
                    ¿Es una Oferta?
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold btn-lg">
                  Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="card bg-dark border-secondary shadow-lg">
        <div className="card-header bg-transparent border-secondary">
          <h4 className="text-white mb-0">Inventario</h4>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Img</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>
                    <img 
                      src={p.image.startsWith('http') ? p.image : `/${String(p.image).replace(/^\/+/, '')}`} 
                      alt="" 
                      style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, background: '#fff' }} 
                    />
                  </td>
                  <td className="fw-bold">{p.name} {p.offer && <span className="badge bg-danger ms-1">Oferta</span>}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toLocaleString('es-CL')}</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-white-50 py-4">
                    No hay productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}