// src/tests/ProductCard.test.jsx
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

test('muestra badge de descuento cuando offer=true', () => {
  render(
    <ProductCard
      product={{ id: 1, name: 'X', price: 1000, image: '/', offer: true }}
    />
  );
  expect(screen.getByText(/-15%/i)).toBeInTheDocument();
});

test('usa placeholder si no hay imagen', () => {
  render(
    <ProductCard
      product={{ id: 2, name: 'Y', price: 1000, image: '' }}
    />
  );
  const img = screen.getByRole('img');
  expect(img.getAttribute('src')).toBe('/img/Producto_img/placeholder.png'); // coincide con tus rutas
});
