import { listProducts } from '../data/data';

test('listProducts devuelve al menos 1 producto', () => {
  const all = listProducts();
  expect(all.length).toBeGreaterThan(0);
  // Debe contener algunos nombres conocidos (ajusta según tu seed)
  const nombres = all.map(p => p.name);
  expect(nombres.join(' ')).toMatch(/Catan|PlayStation|Mouse/i);
});
