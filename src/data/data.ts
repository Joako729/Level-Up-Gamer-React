// src/data/data.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  offer?: boolean;
  description?: string;
}

// Clave para guardar en el navegador
const CART_KEY = 'lvlup_cart';

// Obtener IDs del carrito
export const getCartIds = (): number[] => {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
};

// 🟢 FUNCIÓN: Agregar 1 unidad
export const addToCart = (id: number) => {
  const cart = getCartIds();
  cart.push(id); // Agregamos el ID
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Avisamos que el carrito cambió
  window.dispatchEvent(new Event('cart:change'));
};

// 🟢 FUNCIÓN: Quitar 1 unidad (botón -)
export const removeFromCart = (id: number) => {
  const cart = getCartIds();
  const index = cart.indexOf(id); // Buscamos la primera aparición del producto
  if (index > -1) {
    cart.splice(index, 1); // Lo borramos
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart:change')); // Avisamos
  }
};

// 🟢 FUNCIÓN: Vaciar carrito completo
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart:change'));
};

// 🟢 UTILIDAD: Activar ofertas en el Frontend (usado en Carrito y Checkout)
export const activarOfertasFrontend = (products: any[]): Product[] => {
  return products.map((p: any) => {
      const nameLower = p.name.toLowerCase();
      let isOffer = false;
      // Lista maestra de ofertas
      if (nameLower.includes('catan') || 
          nameLower.includes('carcassonne') || 
          nameLower.includes('polera') || 
          nameLower.includes('playstation 5')) {
          isOffer = true;
      }
      return { ...p, offer: isOffer };
  });
};