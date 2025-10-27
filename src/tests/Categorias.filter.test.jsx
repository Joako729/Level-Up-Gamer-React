// src/tests/Categorias.filter.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Categorias from '../pages/Categorias'; // Asegúrate de que la ruta esté correcta

test('al hacer click en "Consolas" cambia el título y filtra', async () => {
  render(<Categorias />, { wrapper: MemoryRouter });

  const sidebarItem = screen.getByText('Consolas');
  fireEvent.click(sidebarItem);

  // Esperar a que la categoría activa cambie
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Consolas' })).toBeInTheDocument());
});

test('muestra "No hay productos en esta categoría" si no hay productos filtrados', async () => {
  render(<Categorias />, { wrapper: MemoryRouter });

  const sidebarItem = screen.getByText('Consolas');
  fireEvent.click(sidebarItem);

  // Esperar a que se muestre el mensaje cuando no hay productos
  await waitFor(() => expect(screen.getByText(/No hay productos en esta categoría/i)).toBeInTheDocument());
});
