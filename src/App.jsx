// App.jsx
import React, { useState } from 'react';
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

  // Cambia estas credenciales si quieres
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

    // Formulario de acceso (no tiene position: fixed ni overlays)
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






