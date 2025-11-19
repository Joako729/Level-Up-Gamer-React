// src/pages/AdminPanel.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Product,
  listProducts,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '../data/data';

// Define la interfaz para los datos del formulario de creación/edición
interface ProductFormData extends Omit<Product, 'id'> {
    description: string; 
    offerLabel?: string | null;
}

const defaultFormData: ProductFormData = {
  name: '',
  price: 0,
  category: '',
  image: '',
  offer: false,
  description: '',
  offerLabel: ''
};

export default function AdminPanel(): JSX.Element {
  const [products, setProducts] = useState<Product[]>(listProducts());
  const categories: string[] = useMemo(() => listCategories(), [products]);
  
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
      setProducts(listProducts());
  }, []);

  // Tipado de evento para cambios en inputs, select y textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Manejo de checkbox
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    setError('');
  };

  // Tipado de evento para envío de formulario
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      setError('Todos los campos principales son obligatorios.');
      return;
    }

    try {
      const { offerLabel, ...newProductData } = formData;
      const newProduct = createProduct({ ...newProductData, offerLabel: offerLabel || null });
      setProducts(listProducts()); 
      setFormData(defaultFormData); 
      alert(`Producto "${newProduct.name}" creado con éxito (ID: ${newProduct.id}).`);
    } catch (e) {
      setError('Error al crear el producto.');
    }
  };

  const handleEdit = (id: number) => {
    const productToEdit = products.find(p => p.id === id);
    if (productToEdit) {
      setEditingId(id);
      setFormData({
          name: productToEdit.name,
          price: productToEdit.price,
          category: productToEdit.category,
          image: productToEdit.image,
          offer: productToEdit.offer,
          description: productToEdit.description || '', 
          offerLabel: productToEdit.offerLabel || ''
      });
      setError('');
    }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId === null) return;

    try {
      const { offerLabel, ...updatedData } = formData;
      const updatedProduct = updateProduct(editingId, { ...updatedData, offerLabel: offerLabel || null });
      if (updatedProduct) {
        setProducts(listProducts());
        setEditingId(null);
        setFormData(defaultFormData);
        alert(`Producto "${updatedProduct.name}" (ID: ${updatedProduct.id}) actualizado con éxito.`);
      } else {
          setError('Producto no encontrado.');
      }
    } catch (e) {
      setError('Error al actualizar el producto.');
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${name}" (ID: ${id})?`)) {
      deleteProduct(id);
      setProducts(listProducts());
      if (editingId === id) {
          setEditingId(null);
          setFormData(defaultFormData);
      }
      alert(`Producto "${name}" eliminado.`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setError('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuth');
    window.location.reload();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Administrador </h2>
        <button className="btn btn-outline-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Formulario de Creación/Edición */}
      <div className="card mb-5">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">{editingId ? `Editar Producto ID: ${editingId}` : 'Crear Nuevo Producto'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Precio</label>
                <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Categoría</label>
                <select className="form-select" name="category" value={formData.category} onChange={handleInputChange} required>
                  <option value="">Selecciona...</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">URL de Imagen (o path local en public/)</label>
                <input type="text" className="form-control" name="image" value={formData.image} onChange={handleInputChange} required />
              </div>

              <div className="col-md-12">
                <label className="form-label">Descripción</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows={2} />
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="offerSwitch" name="offer" checked={formData.offer} onChange={handleInputChange} />
                  <label className="form-check-label" htmlFor="offerSwitch">Marcar como Oferta (-15% por defecto)</label>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Etiqueta de Oferta (Opcional)</label>
                <input type="text" className="form-control" name="offerLabel" value={formData.offerLabel || ''} onChange={handleInputChange} placeholder="Ej: ¡HOT SALE!" />
              </div>
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            <div className="d-flex justify-content-end gap-2 mt-4">
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                  Cancelar Edición
                </button>
              )}
              <button type="submit" className={`btn ${editingId ? 'btn-success' : 'btn-primary'}`}>
                {editingId ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla de Productos */}
      <h3 className="mb-3">Catálogo de Productos ({products.length})</h3>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Oferta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.name}
                  <small className="d-block text-muted">{p.description?.substring(0, 50)}...</small>
                </td>
                <td>${p.price.toLocaleString('es-CL')}</td>
                <td>{p.category}</td>
                <td>
                  {p.offer ? <span className="badge bg-danger">Sí ({p.offerLabel || '-15%'})</span> : <span className="badge bg-secondary">No</span>}
                </td>
                <td style={{ minWidth: 150 }}>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(p.id)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id, p.name)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}