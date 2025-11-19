// src/pages/Registro.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro(): JSX.Element {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && pass.trim()) {
      // Guardar usuario simulado
      localStorage.setItem('user_logged', '1');
      localStorage.setItem('user_data', JSON.stringify({ name, email }));
      
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
          
          {/* Tarjeta oscura */}
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              
              {/* TÍTULO BLANCO */}
              <h2 className="text-center mb-4 text-white fw-bold">Crear Cuenta</h2>
              
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label text-light">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary text-white border-0" 
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control bg-secondary text-white border-0" 
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label text-light">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control bg-secondary text-white border-0" 
                    placeholder="********"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>

                {/* 🔔 CAMBIO: Botón btn-primary (AZUL) */}
                <button type="submit" className="btn btn-primary w-100 fw-bold btn-lg">
                  Registrarse
                </button>
              </form>

              <hr className="border-secondary my-4" />

              {/* TEXTOS Y ENLACES EN BLANCO */}
              <div className="text-center">
                <span className="text-white">¿Ya tienes cuenta? </span>
                <Link to="/login" className="text-white fw-bold text-decoration-underline">
                  Iniciar sesión
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}