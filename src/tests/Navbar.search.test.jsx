// src/tests/Navbar.search.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../components/Navbar'; // ajusta si tu ruta es distinta

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

test('buscar "Consolas" navega a /categorias?cat=Consolas', async () => {
  render(<Navbar />);
  await userEvent.type(screen.getByPlaceholderText(/buscar/i), 'Consolas');
  await userEvent.click(screen.getByRole('button', { name: /buscar/i }));
  expect(mockNavigate).toHaveBeenCalledWith('/categorias?cat=Consolas');
});
