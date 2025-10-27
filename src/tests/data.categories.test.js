// src/tests/data.categories.test.js
import { listCategories } from '../data/data';

test('listCategories devuelve categorías válidas (case-insensitive)', () => {
  const cats = listCategories();
  expect(Array.isArray(cats)).toBe(true);

  const lower = cats.map(c => String(c).toLowerCase());
  const must = ['juegos de mesa', 'accesorios', 'consolas', 'pcs', 'ropa'];

  must.forEach(c => expect(lower).toContain(c));
  expect(cats.length).toBeGreaterThanOrEqual(must.length); // puede haber "Todo" u otras
});
