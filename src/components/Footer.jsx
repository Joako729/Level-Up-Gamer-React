import React from 'react';
export default function Footer(){
  const anio = new Date().getFullYear();
  return (
    <footer className="bg-dark text-white py-3 mt-4">
      <div className="container text-center small">© {anio} LEVEL‑UP GAMER — Todos los derechos reservados</div>
    </footer>
  );
}
