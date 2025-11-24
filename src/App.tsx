// src/App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Componente para proteger la ruta de Admin
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const role = localStorage.getItem('user_role');
  const token = localStorage.getItem('token');
  
  // Si no tiene token o no es admin, lo mandamos al login
  if (!token || role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App(): JSX.Element {
  const [authMsg, setAuthMsg] = useState<string>('');
  const [wasLogged, setWasLogged] = useState<boolean>(false);

  // Escuchar cambios en el login para mostrar mensaje
  useEffect(() => {
    const checkLogin = () => {
      const isLogged = localStorage.getItem('user_logged') === '1';
      if (!wasLogged && isLogged) {
        setAuthMsg('Sesión iniciada correctamente.');
        setTimeout(() => setAuthMsg(''), 4000);
      }
      setWasLogged(isLogged);
    };

    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [wasLogged]);

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
          
          {/* RUTA ADMIN PROTEGIDA CON TOKEN REAL */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}