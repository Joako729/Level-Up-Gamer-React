// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface AdminPanelProps {
  onLogout?: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export default function AdminPanel({ onLogout }: AdminPanelProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estados formulario
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Accesorios');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  // ESTADO PARA SABER SI ESTAMOS EDITANDO (Si es null, estamos creando)
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      alert("Acceso denegado");
      window.location.href = '/#/login';
    } else {
      refreshProducts();
    }
  }, []);

  const refreshProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  // --- FUNCIÓN PARA CARGAR DATOS EN EL FORMULARIO ---
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImage(product.image);
    setDescription(product.description);
    
    // Hacemos scroll hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- FUNCIÓN PARA CANCELAR EDICIÓN ---
  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setImage('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Nombre y Precio son obligatorios');
      return;
    }

    const productData = {
      name,
      price: Number(price),
      category,
      image: image || '/Img/Producto_Img/mouse.png',
      description: description || 'Sin descripción'
    };

    try {
      if (editingId) {
        // ACTUALIZAR
        await api.updateProduct(editingId, productData);
        alert('Producto actualizado exitosamente');
      } else {
        // CREAR
        await api.createProduct(productData);
        alert('Producto creado exitosamente');
      }

      // Limpiar todo
      cancelEdit();
      refreshProducts();

    } catch (error) {
      alert('Error: No tienes permisos o el servidor falló.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.deleteProduct(id);
        refreshProducts();
      } catch (error) {
        alert('Error al eliminar.');
      }
    }
  };

  const handleInternalLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/#/login';
  };

  return (
    <div className="container py-5">
      
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
        <h2 className="text-white fw-bold mb-0">Panel de Administración</h2>
        <button onClick={handleInternalLogout} className="btn btn-danger fw-bold">
          Cerrar Sesión
        </button>
      </div>
      
      {/* Formulario (Cambia título y botón según si edita o crea) */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              
              <h3 className="text-center mb-4 text-white fw-bold">
                {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-light">Nombre</label>
                  <input type="text" className="form-control bg-secondary text-white border-0"
                    value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label text-light">Precio</label>
                    <input type="number" className="form-control bg-secondary text-white border-0"
                      value={price} onChange={e => setPrice(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light">Categoría</label>
                    <select className="form-select bg-secondary text-white border-0"
                      value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Consolas">Consolas</option>
                      <option value="PCs">PCs</option>
                      <option value="Ropa">Ropa</option>
                      <option value="Juegos de Mesa">Juegos de Mesa</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">URL Imagen</label>
                  <input type="text" className="form-control bg-secondary text-white border-0"
                    placeholder="/Img/Producto_Img/..." value={image} onChange={e => setImage(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">Descripción</label>
                  <textarea className="form-control bg-secondary text-white border-0" rows={3}
                    value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className={`btn fw-bold btn-lg ${editingId ? 'btn-warning' : 'btn-primary'}`}>
                    {editingId ? 'Actualizar Producto' : 'Guardar en BD'}
                  </button>
                  
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="btn btn-outline-light">
                      Cancelar Edición
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="card bg-dark border-secondary shadow-lg">
        <div className="card-header bg-transparent border-secondary">
          <h4 className="text-white mb-0">Inventario Actual</h4>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Img</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>
                    <img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  </td>
                  <td className="fw-bold">{p.name}</td>
                  <td>${p.price.toLocaleString('es-CL')}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      {/* BOTÓN EDITAR */}
                      <button 
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEditClick(p)}
                      >
                        ✏️ Editar
                      </button>
                      
                      {/* BOTÓN ELIMINAR */}
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
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