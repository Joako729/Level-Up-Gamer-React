// src/data/data.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  offer: boolean;
  description: string;
  offerLabel?: string | null;
}

export interface UserProfile {
  name: string;
  email: string;
}

const baseProducts: Product[] = [
  // --- Productos Originales (IDs 1-10) ---
  {
    id: 1,
    name: 'Catan',
    price: 39990,
    category: 'Juegos de Mesa',
    image: 'img/Producto_img/Catan.png',
    offer: true,
    description: 'Clásico de estrategia y comercio para 3–4 jugadores.'
  },
  {
    id: 2,
    name: 'Carcassonne',
    price: 34990,
    category: 'Juegos de Mesa',
    image: 'img/Producto_img/Carcassonne.png',
    offer: false,
    description: 'Juego de colocación de losetas y meeples.'
  },
  {
    id: 3,
    name: 'Auriculares Gamer Razer Kraken',
    price: 59990,
    category: 'Accesorios',
    image: 'img/Producto_img/Auri.png',
    offer: true,
    description: 'Headset con micrófono y cancelación de ruido.'
  },
  {
    id: 4,
    name: 'Razer Deathadder Viper',
    price: 29990,
    category: 'Accesorios',
    image: 'img/Producto_img/MouseGamer.png',
    offer: false,
    description: 'Sensor preciso y switches rápidos.'
  },
  {
    id: 5,
    name: 'Mouse Pad Logitech G640',
    price: 12990,
    category: 'Accesorios',
    image: 'img/Producto_img/Mousepad.png',
    offer: false,
    description: 'Superficie de deslizamiento uniforme.'
  },
  {
    id: 6,
    name: 'Silla Gamer Cougar Armor One',
    price: 129990,
    category: 'Sillas',
    image: 'img/Producto_img/SillaGamer.png',
    offer: false,
    description: 'Silla ergonómica con soporte lumbar.'
  },
  {
    id: 7,
    name: 'PlayStation 5',
    price: 599990,
    category: 'Consolas',
    image: 'img/Producto_img/Play5.png',
    offer: true,
    description: 'Consola de nueva generación.'
  },
  {
    id: 8,
    name: 'Joystick Xbox Series',
    price: 54990,
    category: 'Consolas',
    image: 'img/Producto_img/Controlador.png',
    offer: false,
    description: 'Mando inalámbrico con gatillos adaptativos.'
  },
  {
    id: 9,
    name: 'PC Gamer Intel i7 RTX 4060',
    price: 899990,
    category: 'PCs',
    image: 'img/Producto_img/PCGamer.png',
    offer: false,
    description: 'Equipo listo para jugar en alto rendimiento.'
  },
  {
    id: 10,
    name: 'Polera Level-Up Logo',
    price: 19990,
    category: 'Ropa',
    image: 'img/Producto_img/Polera.png',
    offer: true,
    description: 'Polera temática gamer.'
  },

  // --- TUS 4 OFERTAS EXCLUSIVAS NUEVAS (IDs 11-14) ---
  {
    id: 11,
    name: 'Silla Gamer Cougar Armor',
    price: 129990,
    category: 'Sillas',
    image: 'Img/Producto_Img/SillaGamer.png',
    offer: true,
    description: 'Comodidad ergonómica para largas sesiones.',
    offerLabel: 'Liquidación'
  },
  {
    id: 12,
    name: 'Mouse Pad Logitech G640',
    price: 12990,
    category: 'Accesorios',
    image: 'Img/Producto_Img/MousePad.png',
    offer: true,
    description: 'Superficie de tela para control total.',
    offerLabel: '2x1'
  },
  {
    id: 13,
    name: 'Carcassonne Edición 20 Aniv.',
    price: 34990,
    category: 'Juegos de Mesa',
    image: 'Img/Producto_Img/Carcassonne.png',
    offer: true,
    description: 'El clásico juego de estrategia.',
    offerLabel: '-20%'
  },
  {
    id: 14,
    name: 'Joystick Xbox Series Carbon',
    price: 54990,
    category: 'Consolas',
    image: 'Img/Producto_Img/Controlador.png',
    offer: true,
    description: 'Compatible con PC, Android y Xbox.',
    offerLabel: 'Envío Gratis'
  }
];

// Inicialización
const products: Product[] = baseProducts.slice(); 

// Funciones API
export function listProducts(): Product[] { return products; }
export function listOffers(): Product[] { return products.filter(p => p.offer === true); }
export function listProductsByCategory(category: string | null | undefined): Product[] {
  if (!category || category === 'Todo') return products;
  return products.filter(p => (p.category || '').toLowerCase() === String(category).toLowerCase());
}
export function listCategories(): string[] {
  const cats: (string | undefined)[] = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  return ['Todo', ...(cats as string[])];
}

// Lógica Carrito
const CART_KEY = 'lvlup_cart';

function loadCart(): number[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch { return []; }
}
function saveCart(list: number[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('cart:change'));
}
export function getCart(): Product[] {
  const ids: number[] = loadCart();
  const prods: Product[] = [];
  for (const id of ids) {
    const p = listProducts().find(x => x.id === id);
    if (p) prods.push(p);
  }
  return prods;
}
export function addToCart(id: number): Product[] {
  const ids: number[] = loadCart();
  ids.push(id);
  saveCart(ids);
  return getCart();
}
export function removeFromCart(id: number): Product[] {
  const ids: number[] = loadCart();
  const i = ids.indexOf(id);
  if (i !== -1) ids.splice(i, 1);
  saveCart(ids);
  return getCart();
}
export function removeAllFromCart(id: number): Product[] {
  const ids: number[] = loadCart();
  const newIds = ids.filter(itemId => itemId !== id);
  saveCart(newIds);
  return getCart();
}
export function clearCart(): Product[] {
  saveCart([]);
  return [];
}

// CRUD Helpers
export function createProduct(newProduct: Omit<Product, 'id'>): Product {
  const nextId = (products.reduce((m, p) => Math.max(m, p.id), 0) || 0) + 1;
  const product: Product = { id: nextId, ...newProduct };
  products.push(product);
  return product;
}
export function updateProduct(id: number, updated: Partial<Omit<Product, 'id'>>): Product | undefined {
  const i = products.findIndex(p => p.id === id);
  if (i !== -1) products[i] = { ...products[i], ...updated, id } as Product;
  return products[i];
}
export function deleteProduct(id: number): boolean {
  const i = products.findIndex(p => p.id === id);
  if (i !== -1) products.splice(i, 1);
  return true;
}

export function getUserProfile(): UserProfile { return { name: 'Invitado', email: '' }; }
export function saveOrder(order: any): boolean {
    console.log('Pedido guardado:', order);
    return true;
}

export { products as default, products };