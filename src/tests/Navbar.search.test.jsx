// src/tests/Navbar.search.test.jsx
import '@testing-library/jest-dom'; // <--- IMPORTANTE
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { MemoryRouter } from 'react-router-dom';
import * as dataModule from '../data/data';

jest.mock('../data/data');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(dataModule, 'getCartIds').mockReturnValue([]);
  });

  test('renderiza enlaces públicos y carrito vacío (sin badge)', () => {
    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Categorías/i)).toBeInTheDocument();
    
    const cartLink = screen.getByText(/🛒/i);
    expect(cartLink).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument(); 
  });

  test('muestra badge con cantidad correcta de items en carrito', () => {
    jest.spyOn(dataModule, 'getCartIds').mockReturnValue([101, 102, 103]);
    
    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('usuario NO logueado ve botones Login y Registro', () => {
    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Registro/i)).toBeInTheDocument();
    expect(screen.queryByText(/Perfil/i)).not.toBeInTheDocument();
  });

  test('usuario LOGUEADO ve su nombre y menú de Perfil', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user_name', 'PlayerOne');
    localStorage.setItem('user_role', 'USER');

    render(<Navbar />, { wrapper: MemoryRouter });

    expect(screen.getByText('PlayerOne')).toBeInTheDocument();
    expect(screen.getByText(/👤 Perfil/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
  });

  test('usuario ADMIN ve botón Panel', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user_role', 'ADMIN');

    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText(/⚙️ Panel/i)).toBeInTheDocument();
  });

  test('funcionalidad de búsqueda redirige correctamente', () => {
    render(<Navbar />, { wrapper: MemoryRouter });
    const input = screen.getByPlaceholderText(/Buscar.../i);
    const btnSearch = screen.getByRole('button', { name: /🔍/i });

    fireEvent.change(input, { target: { value: 'Nintendo' } });
    fireEvent.click(btnSearch);

    expect(mockNavigate).toHaveBeenCalledWith('/categorias?q=Nintendo');
  });

  test('Cerrar sesión limpia storage y redirige a login', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user_name', 'TestUser');

    render(<Navbar />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('TestUser'));
    fireEvent.click(screen.getByText(/Cerrar Sesión/i));

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});