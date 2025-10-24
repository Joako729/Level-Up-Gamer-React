import React, { useState } from 'react';

export default function CheckoutForm({ onSubmit, defaultValues = {} }){
  const [form, setForm] = useState({
    nombre: defaultValues.nombre || '',
    correo: defaultValues.correo || '',
    direccion: defaultValues.direccion || '',
    comuna: defaultValues.comuna || '',
    telefono: defaultValues.telefono || '',
  });

  function handleChange(e){ setForm({ ...form, [e.target.name]: e.target.value }); }
  function handleSubmit(e){ e.preventDefault(); onSubmit(form); }

  return (
    <form className="row g-3" onSubmit={handleSubmit}>
      <div className="col-md-6">
        <label className="form-label">Nombre</label>
        <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Correo</label>
        <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} required />
      </div>
      <div className="col-12">
        <label className="form-label">Dirección</label>
        <input className="form-control" name="direccion" value={form.direccion} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Comuna</label>
        <input className="form-control" name="comuna" value={form.comuna} onChange={handleChange} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Teléfono</label>
        <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
      </div>
      <div className="col-12">
        <button className="btn btn-success">Pagar</button>
      </div>
    </form>
  );
}
