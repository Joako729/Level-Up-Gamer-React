import { listProductsByCategory } from '../data/data';

test('listProductsByCategory filtra por categoría', () => {
  const consolas = listProductsByCategory('Consolas');
  expect(consolas.every(p => p.category === 'Consolas')).toBe(true);

  const ropa = listProductsByCategory('Ropa');
  expect(ropa.every(p => p.category === 'Ropa')).toBe(true);
});
