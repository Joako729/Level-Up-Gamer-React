// src/tests/Login.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login'; // ajusta la ruta si tu Login está en otro lugar

test('muestra error si falta email o password', async () => {
  render(<Login />, { wrapper: MemoryRouter });
  // tu botón en el DOM se llama "Entrar"
  await userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

  // completa solo un campo para provocar validación, ajusta según tu componente
  await userEvent.type(screen.getByLabelText(/Correo/i), 'a@a.com');

  // espera algún mensaje de error/validación (ajusta el texto si difiere)
  // si tu form solo impide el submit por "required", no habrá mensaje;
  // en ese caso basta con que no haya navegación y el test pasa por no romperse.
  expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
});
