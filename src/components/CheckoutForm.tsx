// src/components/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { UserProfile } from '../data/data';

interface FormData {
  name: string; email: string; address: string; city: string; zip: string; paymentMethod: string;
}
interface CheckoutFormProps { total: number; itemsCount: number; }

const formatCLP = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

function getLoggedUserProfile(): UserProfile {
    return { 
        name: localStorage.getItem('user_name') || '', 
        email: localStorage.getItem('user_email') || '' 
    };
}

export default function CheckoutForm({ total, itemsCount }: CheckoutFormProps): JSX.Element {
  const navigate = useNavigate();
  const profile = getLoggedUserProfile();

  const [formData, setFormData] = useState<FormData>({
    name: profile.name, email: profile.email, address: '', city: '', zip: '', paymentMethod: ''
  });
  
  const [isLogged] = useState<boolean>(!!localStorage.getItem('token')); 
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (profile.name || profile.email) {
        setFormData(prev => ({ ...prev, name: profile.name, email: profile.email }));
    }
  }, [profile.name, profile.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogged) {
        setError('Debes iniciar sesión.');
        setLoading(false);
        return;
    }

    if (!formData.address || !formData.city || !formData.paymentMethod) {
      setError('Rellena los campos obligatorios.');
      setLoading(false);
      return;
    }

    const userId = Number(localStorage.getItem('user_id'));
    if (!userId) {
        setError('Error de sesión. Haz login de nuevo.');
        setLoading(false);
        return;
    }

    // --- CORRECCIÓN CLAVE: LEER EL CARRITO CORRECTO (lvlup_cart) ---
    // lvlup_cart es un array de IDs: [1, 1, 2, 5]
    const cartIds: number[] = JSON.parse(localStorage.getItem('lvlup_cart') || '[]');
    
    // Contamos cuántas veces aparece cada ID
    const productMap = new Map<number, number>();
    cartIds.forEach(id => {
        const currentQty = productMap.get(id) || 0;
        productMap.set(id, currentQty + 1);
    });

    // Creamos la lista para el backend
    const productosParaEnviar = Array.from(productMap.entries()).map(([id, qty]) => ({
        productoId: id,
        cantidad: qty,
        precioUnitario: 0 // El backend pone el precio real
    }));

    const orderPayload = {
        usuarioId: userId,
        total: total,
        productos: productosParaEnviar
    };

    try {
        console.log("📡 Enviando pedido real...", orderPayload);
        await api.createOrder(orderPayload);
        
        // Limpiamos el carrito correcto
        localStorage.removeItem('lvlup_cart'); 
        window.dispatchEvent(new Event('cart:change')); 
        navigate('/compra-exitosa');
        
    } catch (err: any) {
        console.error(err);
        setError('Error: ' + (err.message || 'No se pudo procesar el pedido'));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg p-4">
      <h3 className="card-title mb-4">Finalizar Compra</h3>
      
      {!isLogged && <div className="alert alert-warning">Inicia sesión para continuar.</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
            <div className="col-md-6"><label>Nombre</label><input className="form-control" name="name" value={formData.name} readOnly /></div>
            <div className="col-md-6"><label>Email</label><input className="form-control" name="email" value={formData.email} readOnly /></div>
            <div className="col-12"><label>Dirección *</label><input className="form-control" name="address" value={formData.address} onChange={handleInputChange} required /></div>
            <div className="col-md-6"><label>Ciudad *</label><input className="form-control" name="city" value={formData.city} onChange={handleInputChange} required /></div>
            <div className="col-12"><label>Pago *</label>
                <select className="form-select" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required>
                    <option value="">Selecciona...</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                </select>
            </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <h4>Total: <span className="text-success">{formatCLP(total)}</span></h4>
          {error && <div className="text-danger small">{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg" disabled={!isLogged || loading || total === 0}>
            {loading ? 'Procesando...' : 'Pagar Ahora'}
          </button>
        </div>
      </form>
    </div>
  );
}