// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [msg, setMsg] = useState('');     // ✅ mensaje de éxito
  const [err, setErr] = useState('');     // mensaje de error

  // “Base de usuarios” simple en localStorage
  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem('users_db') || '{}'); } catch { return {}; }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(''); setErr('');

    if (!email || !password) {
      setErr('Ingresa correo y contraseña.');
      return;
    }

    const users = getUsers();
    const ok = users[email]?.password === password || password.length >= 4; // modo demo: acepta pass >=4

    if (!ok) {
      setErr('Credenciales inválidas.');
      return;
    }

    // Marca sesión y dispara evento para que otras vistas se enteren
    try {
      localStorage.setItem('user_logged', '1');
      localStorage.setItem('user_email', email);
      window.dispatchEvent(new Event('storage'));
    } catch {}

    // ✅ Mensaje inmediato en esta página
    setMsg('Inicio de sesión correctamente.');
  };

  return (
    <div className="container py-4" style={{ maxWidth: 480 }}>
      <h2 className="mb-3">Iniciar sesión</h2>

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

        <button type="submit" className="btn btn-success w-100">
          Entrar
        </button>
      </form>

      <div className="text-center mt-3">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="link-primary">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
