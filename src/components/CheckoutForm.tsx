// src/components/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveOrder, UserProfile } from '../data/data'; // Importar UserProfile

// Definición de la interfaz para los datos del formulario
interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  paymentMethod: string;
}

// Definición de las props
interface CheckoutFormProps {
    total: number;
    itemsCount: number;
}

const formatCLP = (v: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(v);
};

// Helper para obtener el perfil de usuario simulado
function getLoggedUserProfile(): UserProfile {
    // Busca el nombre y email guardado en el login/registro
    return { 
        name: localStorage.getItem('user_name') || '', 
        email: localStorage.getItem('user_email') || '' 
    };
}

export default function CheckoutForm({ total, itemsCount }: CheckoutFormProps): JSX.Element {
  const navigate = useNavigate();
  const profile: UserProfile = getLoggedUserProfile();

  const [formData, setFormData] = useState<FormData>({
    name: profile.name,
    email: profile.email,
    address: '',
    city: '',
    zip: '',
    paymentMethod: ''
  });
  const [isLogged] = useState<boolean>(!!localStorage.getItem('user_logged')); 
  const [error, setError] = useState<string>('');

  // Sincroniza el estado inicial con el perfil
  useEffect(() => {
    if (profile.name || profile.email) {
      setFormData(prev => ({
        ...prev,
        name: profile.name,
        email: profile.email
      }));
    }
  }, [profile.name, profile.email]);

  // Tipado de evento para cambios en inputs y select
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Tipado de evento para envío de formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isLogged) {
        setError('Debes iniciar sesión para completar la compra.');
        return;
    }
    
    // Validación simple
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.paymentMethod) {
      setError('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    const orderData = {
        ...formData,
        total,
        itemsCount,
        timestamp: new Date().toISOString(),
        products: JSON.parse(localStorage.getItem('cart_v1') || '[]') // Obtener productos del carrito
    };

    // Lógica simulada de pago
    const success = saveOrder(orderData); 
    
    if (success) {
      localStorage.removeItem('cart_v1'); 
      window.dispatchEvent(new Event('cart:change')); 
      navigate('/compra-exitosa');
    } else {
      navigate('/compra-fallida');
    }
  };

  return (
    <div className="card shadow-lg p-4">
      <h3 className="card-title mb-4">Información de Envío y Pago</h3>
      
      {!isLogged && (
          <div className="alert alert-warning">
              Debes <Link to="/login" className="alert-link">iniciar sesión</Link> para completar los datos de envío y pago.
          </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Nombre y Email (Pre-rellenado si está logueado) */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Nombre Completo *</label>
            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={isLogged} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email *</label>
            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} disabled={isLogged} required />
          </div>

          {/* Dirección */}
          <div className="col-12">
            <label htmlFor="address" className="form-label">Dirección *</label>
            <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Av. Principal 123" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="city" className="form-label">Ciudad *</label>
            <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="zip" className="form-label">Código Postal</label>
            <input type="text" className="form-control" id="zip" name="zip" value={formData.zip} onChange={handleInputChange} />
          </div>

          {/* Método de Pago */}
          <div className="col-12">
            <label htmlFor="paymentMethod" className="form-label">Método de Pago *</label>
            <select id="paymentMethod" className="form-select" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required>
              <option value="">Selecciona...</option>
              <option value="Tarjeta de Crédito/Débito">Tarjeta de Crédito/Débito</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              <option value="Efectivo al Recibir">Efectivo al Recibir</option>
            </select>
          </div>
        </div>

        {/* Resumen y Botón de Pago */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <h4 className="mb-0">Total: <span className="text-success">{formatCLP(total)}</span></h4>
          
          {error && <div className="text-danger small">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" disabled={!isLogged || total === 0}>
            Pagar {formatCLP(total)}
          </button>
        </div>
      </form>
    </div>
  );
}