// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import CompraExitosa from './pages/CompraExitosa';
import CompraFallida from './pages/CompraFallida';
import AdminPanel from './pages/AdminPanel';
import './App.css';

export default function App() {
  // Persistencia simple en sessionStorage para el login de admin
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try { return sessionStorage.getItem('isAdminAuth') === '1'; } catch { return false; }
  });

  // 🔔 NUEVO: mensaje global para login/registro correcto
  const [authMsg, setAuthMsg] = useState('');
  const [authMsgType] = useState('success'); // solo mostramos success
  const [wasLogged, setWasLogged] = useState(() => {
    try { return localStorage.getItem('user_logged') === '1'; } catch { return false; }
  });

  // Escucha cambios en localStorage.user_logged para mostrar mensajes
  useEffect(() => {
    const handler = () => {
      let now = false;
      try { now = localStorage.getItem('user_logged') === '1'; } catch {}

      // transición de no-logueado -> logueado
      if (!wasLogged && now) {
        const path = (window.location.pathname || '').toLowerCase();
        if (path.includes('/registro')) {
          setAuthMsg('Registrado correctamente.');
        } else if (path.includes('/login')) {
          setAuthMsg('Inicio de sesión correctamente.');
        } else {
          setAuthMsg('Inicio de sesión correctamente.');
        }
        // ocultar automáticamente después de 4s
        setTimeout(() => setAuthMsg(''), 4000);
      }
      setWasLogged(now);
    };

    // Chequeo inicial + suscripción a cambios
    handler();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [wasLogged]);

  // Credenciales admin (puedes cambiarlas)
  const ADMIN_CREDENTIALS = { user: 'levelupadmin', pass: 'levelupadmin' };

  function AdminWrapper() {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      const matchDefault = user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass;
      const matchSame = user !== '' && user === pass; // “si son las mismas, puede ingresar”

      if (matchDefault || matchSame) {
        setIsAdminAuthenticated(true);
        try { sessionStorage.setItem('isAdminAuth', '1'); } catch {}
        setError('');
        return;
      }
      setError('Credenciales incorrectas.');
    };

    if (isAdminAuthenticated) return <AdminPanel />;

    // Formulario de acceso
    return (
      <div className="container py-4">
        <h2 className="mb-3">Acceso administrador</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
          <div className="mb-3">
            <label className="form-label">Nombre de usuario</label>
            <input
              className="form-control"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="usuario"
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="contraseña"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">Ingresar</button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                alert(
                  `Puedes ingresar con:\nusuario: ${ADMIN_CREDENTIALS.user}\ncontraseña: ${ADMIN_CREDENTIALS.pass}\n\nO cualquier par usuario=contraseña.`
                )
              }
            >
              Ayuda
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* 🔔 Alerta global de login/registro correcto */}
      {authMsg && (
        <div className="container pt-3">
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {authMsg}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setAuthMsg('')}
            />
          </div>
        </div>
      )}

      <main className="flex-grow-1 container py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa" element={<CompraExitosa />} />
          <Route path="/compra-fallida" element={<CompraFallida />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          {/* Ruta protegida de admin */}
          <Route path="/admin" element={<AdminWrapper />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}







