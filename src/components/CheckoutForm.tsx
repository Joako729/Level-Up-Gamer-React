// src/components/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api'; 
import { UserProfile } from '../data/data';

interface FormData {
  name: string; email: string; address: string; city: string; zip: string; paymentMethod: string;
}
interface CheckoutFormProps { total: number; itemsCount: number; }
interface CartItem { id: number; price: number; offer: boolean; }

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
        setError('Error de sesión. Vuelve a ingresar.');
        setLoading(false);
        return;
    }

    // PREPARAR DATOS
    const cartIds: number[] = JSON.parse(localStorage.getItem('lvlup_cart') || '[]');
    const productMap = new Map<number, number>();
    cartIds.forEach(id => {
        const currentQty = productMap.get(id) || 0;
        productMap.set(id, currentQty + 1);
    });

    const productosParaEnviar = Array.from(productMap.entries()).map(([id, qty]) => ({
        productoId: id,
        cantidad: qty,
        precioUnitario: 0 
    }));

    const orderPayload = {
        usuarioId: userId,
        total: total,
        productos: productosParaEnviar
    };

    try {
        console.log("📡 Enviando...", orderPayload);
        await api.createOrder(orderPayload);
        
        localStorage.removeItem('lvlup_cart'); 
        window.dispatchEvent(new Event('cart:change')); 
        navigate('/compra-exitosa');
        
    } catch (err: any) {
        console.error(err);
        setError('Error al procesar: ' + (err.message || 'Revisa la consola'));
    } finally {
        setLoading(false);
    }
  };

  // --- ESTILOS INPUTS ---
  const inputClass = "form-control bg-secondary text-white border-secondary";
  const selectClass = "form-select bg-secondary text-white border-secondary";

  return (
    // FONDO OSCURO (#212529) y TEXTO BLANCO
    <div className="card shadow-lg p-4 border-secondary" style={{ backgroundColor: '#212529', color: '#fff' }}>
      <h3 className="card-title mb-4 border-bottom border-secondary pb-2">Finalizar Compra</h3>
      
      {!isLogged && <div className="alert alert-warning">Inicia sesión para continuar.</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
            <div className="col-md-6">
                <label className="form-label text-white-50">Nombre</label>
                <input className={inputClass} name="name" value={formData.name} readOnly />
            </div>
            <div className="col-md-6">
                <label className="form-label text-white-50">Email</label>
                <input className={inputClass} name="email" value={formData.email} readOnly />
            </div>

            <div className="col-12">
                <label className="form-label text-white-50">Dirección *</label>
                <input type="text" className={inputClass} name="address" value={formData.address} onChange={handleInputChange} placeholder="Calle 123" required />
            </div>
            <div className="col-md-6">
                <label className="form-label text-white-50">Ciudad *</label>
                <input type="text" className={inputClass} name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label text-white-50">Código Postal</label>
                <input type="text" className={inputClass} name="zip" value={formData.zip} onChange={handleInputChange} />
            </div>

            <div className="col-12">
                <label className="form-label text-white-50">Método de Pago *</label>
                <select className={selectClass} name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required>
                    <option value="" className="text-white">Selecciona...</option>
                    <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Efectivo">Efectivo al Recibir</option>
                </select>
            </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary">
          <h4 className="mb-0">Total: <span className="text-success">{formatCLP(total)}</span></h4>
          
          {error && <div className="text-danger small">{error}</div>}

          <button type="submit" className="btn btn-success btn-lg fw-bold" disabled={!isLogged || loading || total === 0}>
            {loading ? 'Procesando...' : 'Pagar Ahora'}
          </button>
        </div>
      </form>
    </div>
  );
}