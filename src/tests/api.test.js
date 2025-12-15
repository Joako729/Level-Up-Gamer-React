// src/tests/api.test.js
import { api, API_URL } from '../services/api';

// Mock global de fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('login realiza una petición POST con credenciales', async () => {
    const mockResponse = { token: '12345' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const credentials = { email: 'test@test.com', password: 'pass' };
    const result = await api.login(credentials);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" }
    }));
    expect(result).toEqual(mockResponse);
  });

  test('getProducts envía header de autorización si hay token', async () => {
    localStorage.setItem('token', 'MY_SECRET_TOKEN');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: 1, nombre: 'Producto 1' }]),
    });

    await api.getProducts();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/productos`, expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer MY_SECRET_TOKEN'
      })
    }));
  });

  test('lanzar error si la respuesta no es ok (ej. Login fallido)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    await expect(api.login({ email: 'a', password: 'b' })).rejects.toThrow('Error Login');
  });

  test('createProduct envía POST con body correcto', async () => {
    localStorage.setItem('token', 'TOKEN');
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const newProd = { name: 'X', price: 100, category: 'C', description: 'D', image: 'I' };
    
    await api.createProduct(newProd);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/productos`, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        nombre: 'X', precio: 100, categoria: 'C', descripcion: 'D', imagen: 'I', stock: 10
      })
    }));
  });
});