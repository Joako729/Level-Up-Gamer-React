import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api'; 

interface UserProfile { name: string; email: string; }

interface FormData {
  name: string; email: string; address: string; city: string; zip: string; paymentMethod: string;
}

// 🟢 INTERFAZ ACTUALIZADA: Ahora incluye ID para buscar el precio exacto
interface CheckoutFormProps { 
    total: number; 
    itemsCount: number; 
    cartDetails: { id: number; name: string; finalPrice: number }[]; 
}

const formatCLP = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

function getLoggedUserProfile(): UserProfile {
    return { 
        name: localStorage.getItem('user_name') || '', 
        email: localStorage.getItem('user_email') || '' 
    };
}

export default function CheckoutForm({ total, itemsCount, cartDetails }: CheckoutFormProps): JSX.Element {
  const navigate = useNavigate();
  const profile = getLoggedUserProfile();
  const [formData, setFormData] = useState<FormData>({ name: profile.name, email: profile.email, address: '', city: '', zip: '', paymentMethod: '' });
  const [isLogged] = useState<boolean>(!!localStorage.getItem('token')); 
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (profile.name) setFormData(prev => ({ ...prev, name: profile.name, email: profile.email }));
  }, [profile.name, profile.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogged) { setError('Debes iniciar sesión para comprar.'); setLoading(false); return; }
    if (!formData.address || !formData.city || !formData.paymentMethod) { setError('Por favor completa todos los campos de envío.'); setLoading(false); return; }

    const userId = Number(localStorage.getItem('user_id'));
    if (!userId) { setError('Error de sesión.'); setLoading(false); return; }

    // 🟢 LÓGICA CORREGIDA PARA ENVIAR EL PRECIO CON DESCUENTO
    const cartIds: number[] = JSON.parse(localStorage.getItem('lvlup_cart') || '[]');
    const productMap = new Map<number, number>();
    
    // Contamos cantidades
    cartIds.forEach(id => {
        productMap.set(id, (productMap.get(id) || 0) + 1);
    });

    const productosParaEnviar = Array.from(productMap.entries()).map(([id, qty]) => {
        // Buscamos el precio CON DESCUENTO en los detalles que nos pasó el componente padre
        const itemInfo = cartDetails.find(d => d.id === id);
        const unitPrice = itemInfo ? itemInfo.finalPrice : 0;

        return {
            productoId: id,
            cantidad: qty,
            precioUnitario: unitPrice // Enviamos el precio rebajado para que quede registrado
        };
    });

    const orderPayload = {
        usuarioId: userId,
        total: total,
        productos: productosParaEnviar
    };

    try {
        await api.createOrder(orderPayload);
        
        localStorage.removeItem('lvlup_cart'); 
        window.dispatchEvent(new Event('cart:change')); 
        
        // Enviamos el resumen a la pantalla de éxito
        navigate('/compra-exitosa', { 
            state: { 
                summary: {
                    total: total,
                    items: cartDetails,
                    customer: formData.name,
                    date: new Date().toLocaleDateString()
                }
            } 
        });
        
    } catch (err: any) {
        console.error(err);
        setError('Error al procesar el pedido.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg p-4 border-secondary" style={{ backgroundColor: '#212529', color: '#fff' }}>
       <h4 className="mb-4 border-bottom border-secondary pb-2">Datos de Envío y Pago</h4>
       <form onSubmit={handleSubmit}>
         <div className="row mb-3">
            <div className="col-md-6">
                <label className="form-label">Nombre Completo</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control bg-dark text-white border-secondary" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
         </div>

         <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input type="text" className="form-control bg-dark text-white border-secondary" name="address" placeholder="Av. Principal 123" value={formData.address} onChange={handleInputChange} required />
         </div>

         <div className="row mb-3">
            <div className="col-md-6">
                <label className="form-label">Ciudad</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="col-md-6">
                <label className="form-label">Código Postal</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" name="zip" value={formData.zip} onChange={handleInputChange} />
            </div>
         </div>

         <div className="mb-4">
            <label className="form-label">Método de Pago</label>
            <select className="form-select bg-dark text-white border-secondary" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required>
                <option value="">Seleccionar...</option>
                <option value="credit">Tarjeta de Crédito / Débito</option>
                <option value="transfer">Transferencia Bancaria</option>
                <option value="paypal">PayPal</option>
            </select>
         </div>

         <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary">
          <h4 className="mb-0">Total: <span className="text-success">{formatCLP(total)}</span></h4>
          {error && <div className="text-danger small me-2">{error}</div>}
          <button type="submit" className="btn btn-success btn-lg fw-bold" disabled={!isLogged || loading || total === 0}>
            {loading ? 'Procesando...' : 'Pagar Ahora'}
          </button>
        </div>
       </form>
    </div>
  );
}