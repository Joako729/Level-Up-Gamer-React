// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define la estructura para los datos de usuario almacenados
interface StoredUserData {
    name: string;
    email: string;
    password?: string;
}

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const navigate = useNavigate();

  // Funciones helper para el almacenamiento local tipado
  const loadUsers = (): Record<string, StoredUserData> => {
    try { return JSON.parse(localStorage.getItem('users_db') || '{}'); } catch { return {}; }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(''); setErr('');

    const users = loadUsers();
    
    // Simulación de login: busca por email y verifica la contraseña
    if (!users[email] || users[email].password !== password) {
      setErr('Credenciales incorrectas o usuario no registrado.');
      return;
    }

    // Login exitoso
    localStorage.setItem('user_logged', '1');
    localStorage.setItem('user_name', users[email].name || email);
    localStorage.setItem('user_email', email);
    
    // Notifica a otros componentes (ej. App.tsx para el mensaje)
    window.dispatchEvent(new Event('storage')); 
    
    navigate('/');
  };

  // Tipado de evento para cambios en inputs
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

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
            onChange={handleEmailChange}
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
            onChange={handlePasswordChange}
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