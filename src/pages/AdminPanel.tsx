// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

// Definimos que el componente acepta la prop onLogout (opcional)
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

  // Verificamos si es admin real al cargar
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      alert("Acceso denegado: No eres Administrador");
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
      console.error("Error cargando productos", e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Nombre y Precio son obligatorios');
      return;
    }

    try {
      await api.createProduct({
        name,
        price: Number(price),
        category,
        image: image || 'img/Producto_img/mouse.png',
        description: description || 'Sin descripción'
      });

      setName('');
      setPrice('');
      setImage('');
      setDescription('');
      
      alert('Producto creado en Base de Datos!');
      refreshProducts();
    } catch (error) {
      alert('Error: No tienes permisos o el servidor falló.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de la BD?')) {
      try {
        await api.deleteProduct(id);
        refreshProducts();
      } catch (error) {
        alert('Error al eliminar. Verifica tus permisos de Admin.');
      }
    }
  };

  // Función de cierre de sesión
  const handleInternalLogout = () => {
    localStorage.clear();
    sessionStorage.clear(); // Limpiamos también session por si acaso
    if (onLogout) onLogout(); // Llamamos al padre si existe
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/#/login';
  };

  return (
    <div className="container py-5">
      
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
        <h2 className="text-white fw-bold mb-0">Panel de Administración (BD Real)</h2>
        <button onClick={handleInternalLogout} className="btn btn-danger fw-bold">
          Cerrar Sesión
        </button>
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
                      <option value="Juegos de mesa">Juegos De Mesa</option>
                      <option value="Ropa">Ropa</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">URL Imagen</label>
                  <input type="text" className="form-control bg-secondary text-white border-0"
                    placeholder="http://..." value={image} onChange={e => setImage(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">Descripción</label>
                  <textarea className="form-control bg-secondary text-white border-0" rows={3}
                    value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold btn-lg">Guardar en BD</button>
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
                <th>Nombre</th>
                <th>Precio</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td className="fw-bold">{p.name}</td>
                  <td>${p.price.toLocaleString('es-CL')}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                      Eliminar
                    </button>
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