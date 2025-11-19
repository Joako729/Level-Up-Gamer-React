// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación simple de validación
    if (email.trim() && pass.trim()) {
      localStorage.setItem('user_logged', '1');
      // Notificar a la App y al Navbar que hubo un cambio
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {/* Tarjeta con fondo oscuro y borde sutil */}
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              
              {/* TÍTULO BLANCO */}
              <h2 className="text-center mb-4 text-white fw-bold">Iniciar Sesión</h2>
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-light">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control bg-secondary text-white border-0 placeholder-light" 
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ ['--bs-placeholder-opacity' as any]: 0.6 }}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label text-light">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control bg-secondary text-white border-0 placeholder-light" 
                    placeholder="********"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold btn-lg">
                  Ingresar
                </button>
              </form>

              <hr className="border-secondary my-4" />

              {/* TEXTOS Y ENLACES EN BLANCO */}
              <div className="text-center">
                <span className="text-white">¿No tienes cuenta? </span>
                <Link to="/registro" className="text-white fw-bold text-decoration-underline">
                  Crear cuenta
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}