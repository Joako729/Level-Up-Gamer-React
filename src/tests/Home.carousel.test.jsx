import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';
import { MemoryRouter } from 'react-router-dom';

test('Home muestra carrusel y al menos 3 slides', () => {
  render(<Home />, { wrapper: MemoryRouter });
  const imgs = screen.getAllByRole('img');
  // debe haber al menos las 3 del carrusel (y quizá más por categorías)
  expect(imgs.length).toBeGreaterThanOrEqual(3);
});
