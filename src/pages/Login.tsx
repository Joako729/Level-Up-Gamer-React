import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login({ email, password: pass });
      
      // GUARDAMOS TODO EN MEMORIA
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_role', data.rol);
      localStorage.setItem('user_name', data.nombre);
      localStorage.setItem('user_email', data.email); // <--- ESTO FALTABA
      localStorage.setItem('user_id', data.id);
      localStorage.setItem('user_logged', '1');

      window.dispatchEvent(new Event('storage'));
      
      // Redirigir siempre al perfil unificado
      navigate('/perfil');

    } catch (err) {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card bg-dark border-secondary shadow-lg rounded-3">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 text-white fw-bold">Iniciar Sesión</h2>
              {error && <div className="alert alert-danger text-center">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-light">Correo Electrónico</label>
                  <input type="email" className="form-control bg-secondary text-white border-0" 
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-light">Contraseña</label>
                  <input type="password" className="form-control bg-secondary text-white border-0" 
                    value={pass} onChange={(e) => setPass(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold btn-lg" disabled={loading}>
                  {loading ? 'Cargando...' : 'Ingresar'}
                </button>
              </form>
              <hr className="border-secondary my-4" />
              <div className="text-center">
                <span className="text-white">¿No tienes cuenta? </span>
                <Link to="/registro" className="text-white fw-bold text-decoration-underline">Crear cuenta</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}