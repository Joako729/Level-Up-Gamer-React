import React from 'react';
import { Link } from 'react-router-dom';
export default function CompraExitosa(){
  return (
    <div className="text-center py-5">
      <div className="display-6 mb-2 text-success">¡Compra exitosa!</div>
      <p className="mb-4">Tu pago fue procesado correctamente. Te enviamos el comprobante al correo.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}
