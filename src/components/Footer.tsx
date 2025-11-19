// src/components/Footer.tsx
import React from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto border-top border-secondary">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} <strong className="text-primary">LEVEL-UP</strong>. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}