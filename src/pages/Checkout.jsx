import React from 'react';
import CheckoutForm from '../components/CheckoutForm';
import { getUserProfile, saveOrder, getCart } from '../data/data';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const nav = useNavigate();
  const perfil = getUserProfile();
  const carro = getCart();
  const total = carro.reduce((a,b)=>a+b.price,0);

  function onSubmit(datos){
    const ok = saveOrder(datos);
    nav(ok ? '/compra-exitosa' : '/compra-fallida');
  }

  return (
    <div className="row g-4">
      <section className="col-12 col-lg-8">
        <h2 className="titulo-seccion mb-3">Datos de envío</h2>
        <CheckoutForm onSubmit={onSubmit} defaultValues={perfil} />
        <p className="text-muted mt-2 small">Si el usuario ha iniciado sesión, los datos se completan automáticamente.</p>
      </section>
      <aside className="col-12 col-lg-4">
        <div className="resumen-checkout">
          <h5 className="mb-3">Resumen</h5>
          <ul className="list-group mb-3">
            {carro.map((it, i)=> (
              <li className="list-group-item d-flex justify-content-between" key={i}>
                <span>{it.name}</span>
                <strong>${it.price.toLocaleString()}</strong>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span><span>${total.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Envío</span><span>$0</span>
          </div>
          <div className="d-flex justify-content-between border-top pt-2">
            <strong>Total</strong><strong>${total.toLocaleString()}</strong>
          </div>
        </div>
      </aside>
    </div>
  );
}
