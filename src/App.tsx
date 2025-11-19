// App.tsx
import { HashRouter as Router } from 'react-router-dom';

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

// Define type for admin credentials
interface AdminCredentials {
  user: string;
  pass: string;
}

export default function App(): JSX.Element {
  // Persistencia simple en sessionStorage para el login de admin
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try { return sessionStorage.getItem('isAdminAuth') === '1'; } catch { return false; }
  });

  // 🔔 NUEVO: mensaje global para login/registro correcto
  const [authMsg, setAuthMsg] = useState<string>('');
  const [authMsgType] = useState<string>('success'); // solo mostramos success
  const [wasLogged, setWasLogged] = useState<boolean>(() => {
    try { return localStorage.getItem('user_logged') === '1'; } catch { return false; }
  });

  // Credenciales admin (puedes cambiarlas)
  const ADMIN_CREDENTIALS: AdminCredentials = { user: 'levelupadmin', pass: 'levelupadmin' };

  // Escucha cambios en localStorage.user_logged para mostrar mensajes
  useEffect(() => {
    const handler = () => {
      let now: boolean = false;
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
    window.addEventListener('storage', handler as EventListener);
    return () => window.removeEventListener('storage', handler as EventListener);
  }, [wasLogged]);


  function AdminWrapper(): JSX.Element {
    const [user, setUser] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const matchDefault: boolean = user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass;
      const matchSame: boolean = user !== '' && user === pass; // “si son las mismas, puede ingresar”

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
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Acceso administrador</h3>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre de usuario</label>
                    <input
                      className="form-control"
                      value={user}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
                      placeholder="contraseña"
                    />
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary w-100">
                      Ingresar
                    </button>
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
            </div>
          </div>
        </div>
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