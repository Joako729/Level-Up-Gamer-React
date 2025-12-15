// src/tests/ProductCard.test.jsx
import '@testing-library/jest-dom'; // <--- IMPORTANTE
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import * as dataModule from '../data/data';

jest.mock('../data/data', () => ({
  addToCart: jest.fn(),
}));

const mockProduct = {
  id: 1,
  name: 'Silla Gamer Pro',
  price: 150000,
  category: 'Muebles',
  description: 'Silla ergonómica',
  image: '/img/silla.png',
  stock: 5,
  offer: false
};

describe('ProductCard Component', () => {
  test('renderiza la información del producto correctamente', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Silla Gamer Pro')).toBeInTheDocument();
    expect(screen.getByText(/Categoría: Muebles/i)).toBeInTheDocument();
    expect(screen.getByText('$150.000')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/img/silla.png');
  });

  test('muestra badge de oferta solo si offer es true', () => {
    const offerProduct = { ...mockProduct, offer: true };
    render(<ProductCard product={offerProduct} />);
    
    expect(screen.getByText(/¡Oferta!/i)).toBeInTheDocument();
  });

  test('botón "Añadir al Carrito" llama a la función addToCart con el ID', () => {
    render(<ProductCard product={mockProduct} />);
    
    const btn = screen.getByRole('button', { name: /Añadir al Carrito/i });
    fireEvent.click(btn);

    expect(dataModule.addToCart).toHaveBeenCalledTimes(1);
    expect(dataModule.addToCart).toHaveBeenCalledWith(1);
  });
});