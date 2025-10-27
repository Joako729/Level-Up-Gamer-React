import { render, screen } from '@testing-library/react';
import Categorias from '../pages/Categorias';
import { MemoryRouter } from 'react-router-dom';

test('renderiza sidebar de Categorías y título', () => {
  render(<Categorias />, { wrapper: MemoryRouter });
  expect(screen.getByText(/Categorías/i)).toBeInTheDocument();
  // título inicial debería ser "Todos"
  expect(screen.getByRole('heading', { name: /Todos/i })).toBeInTheDocument();
});
