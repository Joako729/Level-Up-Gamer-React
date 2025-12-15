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
import Perfil from './pages/Perfil';
import AdminPanel from './pages/AdminPanel';
import ProductDetail from './pages/ProductDetail'; // 🟢 NUEVO IMPORT

import './App.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App(): JSX.Element {
  const [authMsg, setAuthMsg] = useState('');
  const [wasLogged, setWasLogged] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const isLogged = localStorage.getItem('user_logged') === '1';
      if (!wasLogged && isLogged) {
        setAuthMsg('Sesión iniciada.');
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
      {authMsg && <div className="container pt-3"><div className="alert alert-success fade show">{authMsg}</div></div>}
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
          
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          
          {/* Si tienes VendedorPanel */}
          {/* <Route path="/vendedor" element={<ProtectedRoute><VendedorPanel /></ProtectedRoute>} /> */}

          {/* 🟢 NUEVA RUTA DETALLE */}
          <Route path="/producto/:id" element={<ProductDetail />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}