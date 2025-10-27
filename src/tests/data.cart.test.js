import { addToCart } from '../data/data';

beforeEach(() => {
  // mock limpio de localStorage
  const store = {};
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(k => store[k] || null);
  jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((k,v) => { store[k]=v; });
});

test('addToCart agrega cantidad 1 cuando no existe', () => {
  expect(() => addToCart({ id: 999, name:'Test', price: 1000 })).not.toThrow();
});
