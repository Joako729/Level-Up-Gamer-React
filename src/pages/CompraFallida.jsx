import React from 'react';
import { Link } from 'react-router-dom';
export default function CompraFallida(){
  return (
    <div className="text-center py-5">
      <div className="display-6 mb-2 text-danger">Pago rechazado</div>
      <p className="mb-4">No se pudo procesar el pago. Revisa tus datos o intenta con otro método.</p>
      <Link to="/checkout" className="btn btn-warning">Volver al checkout</Link>
    </div>
  );
}
