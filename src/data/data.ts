// src/data/data.ts

// Definición de la interfaz principal para un Producto
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

// Definición de la interfaz para el perfil de usuario (helper)
export interface UserProfile {
  name: string;
  email: string;
}

// ====== Catálogo con descripciones añadidas y 4 ofertas (1,3,7,10) ======
const baseProducts: Product[] = [
  {
    id: 1,
    name: 'Catan',
    price: 39990,
    category: 'Juegos de Mesa',
    image: 'img/Producto_img/Catan.png',
    offer: true,
    description:
      'Clásico de estrategia y comercio para 3–4 jugadores; partidas de 60–90 min con tablero modular y alta rejugabilidad.'
  },
  {
    id: 2,
    name: 'Carcassonne',
    price: 34990,
    category: 'Juegos de Mesa',
    image: 'img/Producto_img/Carcassonne.png',
    offer: false,
    description:
      'Juego de colocación de losetas y meeples: construye ciudades y caminos con reglas simples pero gran profundidad estratégica.'
  },
  {
    id: 3,
    name: 'Auriculares Gamer Razer Kraken',
    price: 59990,
    category: 'Accesorios',
    image: 'img/Producto_img/Auri.png',
    offer: true,
    description:
      'Headset con micrófono y cancelación de ruido; cómodo para sesiones largas y sonido claro para chat de voz y juego competitivo.'
  },
  {
    id: 4,
    name: 'Razer Deathadder Viper Standard Edition 6400',
    price: 29990,
    category: 'Accesorios',
    image: 'img/Producto_img/MouseGamer.png',
    offer: false,
    description:
      'Sensor preciso y switches rápidos; ideal para shooters y MOBAs, con DPI ajustable y botones programables para mejor control.'
  },
  {
    id: 5,
    name: 'Mouse Pad gamer Logitech G640 de tela',
    price: 12990,
    category: 'Accesorios',
    image: 'img/Producto_img/Mousepad.png',
    offer: false,
    description:
      'Superficie de deslizamiento uniforme con base antideslizante y bordes reforzados; mejora la precisión del mouse en cada movimiento.'
  },
  {
    id: 6,
    name: 'Silla Gamer Cougar Armor One',
    price: 129990,
    category: 'Sillas',
    image: 'img/Producto_img/SillaGamer.png',
    offer: false,
    description:
      'Silla ergonómica con soporte lumbar y reclinación; materiales duraderos pensados para largas horas de juego, estudio o trabajo.'
  },
  {
    id: 7,
    name: 'PlayStation 5',
    price: 599990,
    category: 'Consolas',
    image: 'img/Producto_img/Play5.png',
    offer: true,
    description:
      'Consola de nueva generación con SSD ultrarrápido, gráficos 4K y experiencia inmersiva con control háptico y audio 3D.'
  },
  {
    id: 8,
    name: 'Joystick Microsoft Xbox Series',
    price: 54990,
    category: 'Consolas',
    image: 'img/Producto_img/Controlador.png',
    offer: false,
    description:
      'Mando inalámbrico con gatillos adaptativos y vibración háptica; conexión estable y batería de larga duración.'
  },
  {
    id: 9,
    name: 'PC Gamer Intel i7 RTX 4060',
    price: 899990,
    category: 'PCs',
    image: 'img/Producto_img/PCGamer.png',
    offer: false,
    description:
      'Equipo listo para jugar en alto rendimiento; ideal para 1080p/1440p con multitarea fluida en gaming y creación de contenido.'
  },
  {
    id: 10,
    name: 'Polera Level-Up Logo',
    price: 19990,
    category: 'Ropa',
    image: 'img/Producto_img/Polera.png',
    offer: true,
    description:
      'Polera temática gamer de tela suave y respirable; calce cómodo para uso diario y fanáticos de Level-Up.'
  }
];

// ====== Construcción del arreglo final de productos ======
const products: Product[] = baseProducts.slice(); // sin mutaciones posteriores

// ====== API de lectura de productos ======
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

// ====== Carrito (por id) ======
const CART_KEY = 'lvlup_cart';

function loadCart(): number[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch { return []; }
}
function saveCart(list: number[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(list));
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
export function clearCart(): Product[] {
  saveCart([]);
  return [];
}

// ====== CRUD productos (en memoria) ======
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

// ====== Otros helpers ======
export function getUserProfile(): UserProfile { return { name: 'Invitado', email: '' }; }
export function saveOrder(order: any): boolean {
    console.log('Pedido guardado:', order);
    return true;
}

// ====== Exports ======
export { products as default, products };