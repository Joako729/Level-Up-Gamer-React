// src/pages/Registro.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Registro(): JSX.Element {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Enviamos datos al backend
      // Por defecto el backend asigna rol 'CLIENTE'
      await api.register({ nombre: name, email, password: pass, rol: 'CLIENTE' });
      
      alert('Cuenta creada exitosamente. Ahora inicia sesión.');
      navigate('/login'); 

    } catch (err) {
      setError('Error al registrar. Revisa que el email no exista.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              
              <h2 className="text-center mb-4 text-white fw-bold">Crear Cuenta</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label text-light">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary text-white border-0" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control bg-secondary text-white border-0" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label text-light">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control bg-secondary text-white border-0" 
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold btn-lg">
                  Registrarse
                </button>
              </form>

              <hr className="border-secondary my-4" />

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