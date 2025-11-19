// src/pages/Registro.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define la estructura de datos para el usuario en el almacenamiento local
interface UserData {
  name: string;
  email: string;
  password?: string;
}

export default function Registro(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [err, setErr] = useState<string>('');
  const navigate = useNavigate();

  // Funciones helper para el almacenamiento local tipado
  const loadUsers = (): Record<string, UserData> => {
    try { return JSON.parse(localStorage.getItem('users_db') || '{}'); } catch { return {}; }
  };
  const saveUsers = (users: Record<string, UserData>): void => {
    try { localStorage.setItem('users_db', JSON.stringify(users)); } catch {}
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(''); setErr('');

    if (password.length < 6) {
        setErr('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    if (password !== confirm) {
      setErr('Las contraseñas no coinciden.');
      return;
    }

    const users = loadUsers();
    if (users[email]) {
      setErr('Este correo ya está registrado.');
      return;
    }

    // Registro exitoso
    const namePart = email.split('@')[0];
    users[email] = {
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1), // Capitalizar
        email: email,
        password: password,
    };
    saveUsers(users);

    // Login automático después del registro
    localStorage.setItem('user_logged', '1');
    localStorage.setItem('user_name', users[email].name);
    localStorage.setItem('user_email', email);

    // Notifica a otros componentes (ej. App.tsx para el mensaje)
    window.dispatchEvent(new Event('storage'));
    
    navigate('/');
  };
  
  // Tipado de eventos para cambios en inputs
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value);

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

        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            className="form-control"
            value={confirm}
            onChange={handleConfirmChange}
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