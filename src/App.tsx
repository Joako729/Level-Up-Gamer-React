// src/App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Corregido imports
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

// --- COMPONENTE DE LOGIN ADMIN (Definido afuera para evitar errores) ---
interface AdminLoginProps {
  onLogin: () => void;
}

function AdminLogin({ onLogin }: AdminLoginProps): JSX.Element {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const ADMIN_CREDENTIALS = { user: 'levelupadmin', pass: 'levelupadmin' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verificación simple
    if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
      onLogin();
    } else {
      setError('Credenciales incorrectas.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {/* Tarjeta estilo Dark Mode */}
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              <h3 className="text-center mb-4 text-white fw-bold">Acceso Administrador</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-light">Usuario</label>
                  <input
                    className="form-control bg-secondary text-white border-0"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Usuario admin"
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-light">Contraseña</label>
                  <input
                    type="password"
                    className="form-control bg-secondary text-white border-0"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Contraseña"
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg fw-bold">
                    Ingresar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm mt-2 border-0"
                    onClick={() => alert(`Usuario: ${ADMIN_CREDENTIALS.user}\nPass: ${ADMIN_CREDENTIALS.pass}`)}
                  >
                    ¿Olvidaste la contraseña?
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

// --- COMPONENTE PRINCIPAL APP ---
export default function App(): JSX.Element {
  // Estado de autenticación admin
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try { return sessionStorage.getItem('isAdminAuth') === '1'; } catch { return false; }
  });

  // Mensajes globales de login usuario (opcional)
  const [authMsg, setAuthMsg] = useState<string>('');
  const [wasLogged, setWasLogged] = useState<boolean>(() => {
    try { return localStorage.getItem('user_logged') === '1'; } catch { return false; }
  });

  useEffect(() => {
    const handler = () => {
      let now = false;
      try { now = localStorage.getItem('user_logged') === '1'; } catch {}
      
      if (!wasLogged && now) {
        setAuthMsg('Inicio de sesión correcto.');
        setTimeout(() => setAuthMsg(''), 4000);
      }
      setWasLogged(now);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [wasLogged]);

  // Handlers para Admin
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('isAdminAuth', '1');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('isAdminAuth');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Alerta flotante */}
      {authMsg && (
        <div className="container pt-3">
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {authMsg}
            <button type="button" className="btn-close" onClick={() => setAuthMsg('')} />
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
          
          {/* RUTA ADMIN PROTEGIDA */}
          <Route 
            path="/admin" 
            element={
              isAdminAuthenticated 
                ? <AdminPanel onLogout={handleAdminLogout} /> 
                : <AdminLogin onLogin={handleAdminLogin} />
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}