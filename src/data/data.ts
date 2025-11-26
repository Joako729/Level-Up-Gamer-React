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

const products: Product[] = []; // Se mantiene vacío, usamos API.

// 🟢 NUEVA FUNCIÓN MAESTRA PARA ACTIVAR OFERTAS
// Recibe los productos de la API y les "pega" la oferta si coinciden con los nombres.
export function activarOfertasFrontend(listaProductos: any[]): Product[] {
  return listaProductos.map(p => {
    // Normalizamos el nombre para buscar (minúsculas)
    const nombre = p.name.toLowerCase();
    
    // LÓGICA DE TUS 4 OFERTAS:
    if (nombre.includes('catan')) {
      return { ...p, offer: true, offerLabel: '20% OFF' };
    }
    if (nombre.includes('carcassonne')) {
      return { ...p, offer: true, offerLabel: '15% OFF' };
    }
    if (nombre.includes('playstation 5')) {
      return { ...p, offer: true, offerLabel: '¡Oportunidad!' };
    }
    if (nombre.includes('polera')) { // Polera Level-Up
      return { ...p, offer: true, offerLabel: '2x1' };
    }

    // Si no es ninguno, devolvemos el producto tal cual viene de la BD
    return p;
  });
}

// --- LÓGICA DEL CARRITO ---
const CART_KEY = 'lvlup_cart';

export function getCartIds(): number[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch { return []; }
}

function saveCart(list: number[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('cart:change'));
}

export function addToCart(id: number): void {
  const ids = getCartIds();
  ids.push(id);
  saveCart(ids);
}

export function removeFromCart(id: number): void {
  const ids = getCartIds();
  const i = ids.indexOf(id);
  if (i !== -1) ids.splice(i, 1);
  saveCart(ids);
}

export function removeAllFromCart(id: number): void {
  const ids = getCartIds();
  const newIds = ids.filter(itemId => itemId !== id);
  saveCart(newIds);
}

export function clearCart(): void {
  saveCart([]);
}

// Helpers de compatibilidad
export function getCart(): Product[] { return []; }
export function listProducts(): Product[] { return products; }
export function listOffers(): Product[] { return products; }
export function listProductsByCategory(c: string|null): Product[] { return products; }
export function listCategories(): string[] { return ['Todo']; }
export function getUserProfile(): UserProfile { return { name: 'Invitado', email: '' }; }
export function saveOrder(o: any): boolean { console.log('Pedido:', o); return true; }
export function createProduct(n: any): Product { return { id: 0, ...n }; }
export function updateProduct(id: number, u: any): Product | undefined { return undefined; }
export function deleteProduct(id: number): boolean { return true; }

export { products as default };