// src/pages/Registro.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [msg, setMsg] = useState('');     // ✅ mensaje de éxito
  const [err, setErr] = useState('');     // mensaje de error

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem('users_db') || '{}'); } catch { return {}; }
  };
  const saveUsers = (users) => {
    try { localStorage.setItem('users_db', JSON.stringify(users)); } catch {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(''); setErr('');

    if (!email || !password || !confirm) {
      setErr('Completa todos los campos.');
      return;
    }
    if (password !== confirm) {
      setErr('Las contraseñas no coinciden.');
      return;
    }

    const users = getUsers();
    if (users[email]) {
      setErr('Este correo ya está registrado.');
      return;
    }

    users[email] = { email, password, createdAt: Date.now() };
    saveUsers(users);

    // Marca sesión y avisa al resto de la app
    try {
      localStorage.setItem('user_logged', '1');
      localStorage.setItem('user_email', email);
      window.dispatchEvent(new Event('storage'));
    } catch {}

    // ✅ Mensaje inmediato en esta página
    setMsg('Registrado correctamente.');
  };

  return (
    <div className="container py-4" style={{ maxWidth: 480 }}>
      <h2 className="mb-3">Crear cuenta</h2>

      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@dominio.com"
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            className="form-control"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Registrarme
        </button>
      </form>

      <div className="text-center mt-3">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="link-primary">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
