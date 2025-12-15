// src/tests/Login.test.jsx
import '@testing-library/jest-dom'; // <--- IMPORTANTE: Agregado para que funcione toBeInTheDocument
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { api } from '../services/api';

// Mock de la API
jest.mock('../services/api');

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renderiza el formulario correctamente', () => {
    render(<Login />, { wrapper: MemoryRouter });
    expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });

  test('muestra error si la API rechaza el login', async () => {
    api.login.mockRejectedValue(new Error('Credenciales inválidas'));

    render(<Login />, { wrapper: MemoryRouter });

    await userEvent.type(screen.getByLabelText(/Correo/i), 'error@test.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    expect(await screen.findByText(/Email o contraseña incorrectos/i)).toBeInTheDocument();
  });

  test('login exitoso guarda datos y redirige a /perfil', async () => {
    const fakeResponse = {
      token: 'fake-jwt-token',
      rol: 'USER',
      nombre: 'Gamer Test',
      email: 'gamer@test.com',
      id: 99
    };
    api.login.mockResolvedValue(fakeResponse);

    render(<Login />, { wrapper: MemoryRouter });

    await userEvent.type(screen.getByLabelText(/Correo/i), 'gamer@test.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });
  });
});