// src/pages/Registro.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Registro(): JSX.Element {
  const navigate = useNavigate();
  
  // Estados originales
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  
  // Nuevos estados solicitados
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [commune, setCommune] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación de contraseñas
    if (pass !== confirmPass) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Enviamos datos al backend incluyendo los nuevos campos
      await api.register({ 
        nombre: name, 
        username: username,
        edad: Number(age), // Convertimos a número
        region: region,
        comuna: commune,
        email, 
        password: pass, 
        rol: 'CLIENTE' 
      });
      
      alert('Cuenta creada exitosamente. Ahora inicia sesión.');
      navigate('/login'); 

    } catch (err) {
      console.error(err);
      setError('Error al registrar. Revisa los datos o intenta más tarde.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6"> {/* Aumenté un poco el ancho para acomodar mejor los campos */}
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              
              <h2 className="text-center mb-4 text-white fw-bold">Crear Cuenta</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleRegister}>
                
                {/* Nombre Completo */}
                <div className="mb-3">
                  <label className="form-label text-light">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary text-white border-0" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                {/* Nuevo: Nombre de Usuario */}
                <div className="mb-3">
                  <label className="form-label text-light">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary text-white border-0" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Ej. GamerPro123"
                  />
                </div>

                {/* Nuevo: Edad */}
                <div className="mb-3">
                  <label className="form-label text-light">Edad</label>
                  <input 
                    type="number" 
                    className="form-control bg-secondary text-white border-0" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min="1"
                    max="120"
                  />
                </div>

                {/* Nuevo: Región y Comuna (en una fila para ahorrar espacio) */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-light">Región</label>
                    <input 
                      type="text" 
                      className="form-control bg-secondary text-white border-0" 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required
                      placeholder="Ej. Metropolitana"
                    />
                  </div>
                  <div className="col-md-6 mt-3 mt-md-0">
                    <label className="form-label text-light">Comuna</label>
                    <input 
                      type="text" 
                      className="form-control bg-secondary text-white border-0" 
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      required
                      placeholder="Ej. Providencia"
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div className="mb-3">
                  <label className="form-label text-light">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control bg-secondary text-white border-0" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                
                {/* Contraseña */}
                <div className="mb-3">
                  <label className="form-label text-light">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control bg-secondary text-white border-0" 
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                </div>

                {/* Nuevo: Confirmar Contraseña */}
                <div className="mb-4">
                  <label className="form-label text-light">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control bg-secondary text-white border-0" 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
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