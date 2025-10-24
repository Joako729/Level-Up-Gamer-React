import React from 'react';
import { getCart, removeFromCart, clearCart } from '../data/data';
import { Link } from 'react-router-dom';

export default function Carrito(){
  const [carro, setCarro] = React.useState(getCart());
  const refrescar = () => setCarro(getCart());
  const quitar = (id) => { removeFromCart(id); refrescar(); }
  const vaciar = () => { clearCart(); refrescar(); }

  const total = carro.reduce((acc, it) => acc + it.price, 0);

  return (
    <div>
      <h2 className="titulo-seccion mb-3">Carrito</h2>
      {carro.length === 0 ? <p>Tu carrito está vacío.</p> : (
        <>
          <div className="table-responsive mb-3">
            <table className="table table-carrito align-middle">
              <thead className="table-light">
                <tr><th>Producto</th><th className="text-end">Precio</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {carro.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.name}</td>
                    <td className="text-end">${it.price.toLocaleString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>quitar(it.id)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <th className="text-end">${total.toLocaleString()}</th>
                  <th className="text-end"></th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={vaciar}>Vaciar</button>
            <Link className="btn btn-success" to="/checkout">Ir a pagar</Link>
          </div>
        </>
      )}
    </div>
  );
}
