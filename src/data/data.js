const KEYS = { products:'lug_products', cart:'lug_cart', profile:'lug_profile', orders:'lug_orders' };

function seed(){
  if(!localStorage.getItem(KEYS.products)){
    const initial = [
      { id:1, name:'Control Pro', price:39990, category:'Accesorios', image:'', offer:true },
      { id:2, name:'Auriculares Razer', price:59990, category:'Accesorios', image:'', offer:false },
      { id:3, name:'Teclado Mecánico', price:49990, category:'Periféricos', image:'', offer:true },
      { id:4, name:'Mouse Gamer 8K', price:29990, category:'Periféricos', image:'', offer:false },
    ];
    localStorage.setItem(KEYS.products, JSON.stringify(initial));
  }
  if(!localStorage.getItem(KEYS.cart)) localStorage.setItem(KEYS.cart, JSON.stringify([]));
  if(!localStorage.getItem(KEYS.profile)){
    localStorage.setItem(KEYS.profile, JSON.stringify({ nombre:'', correo:'', direccion:'', comuna:'', telefono:'' }));
  }
  if(!localStorage.getItem(KEYS.orders)) localStorage.setItem(KEYS.orders, JSON.stringify([]));
}
seed();

const read = (k) => JSON.parse(localStorage.getItem(k) || '[]');
const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

export const listProducts = () => read(KEYS.products);
export const listCategories = () => Array.from(new Set(listProducts().map(p=>p.category)));
export const listProductsByCategory = (c) => listProducts().filter(p=>p.category===c);
export const listOffers = () => listProducts().filter(p=>p.offer);

export function createProduct(p){
  const list = listProducts();
  const nextId = (list.reduce((m, x)=>Math.max(m, x.id), 0) + 1) || 1;
  const prod = { ...p, id: nextId };
  list.push(prod);
  write(KEYS.products, list);
  return prod;
}
export function updateProduct(id, patch){
  write(KEYS.products, listProducts().map(p => p.id===id ? { ...p, ...patch, id } : p));
}
export function deleteProduct(id){
  write(KEYS.products, listProducts().filter(p => p.id!==id));
}

// Carrito
export const getCart = () => read(KEYS.cart);
export function addToCart(product){ const cart = getCart(); cart.push(product); write(KEYS.cart, cart); }
export function removeFromCart(id){ write(KEYS.cart, getCart().filter(it=>it.id!==id)); }
export function clearCart(){ write(KEYS.cart, []); }

// Perfil y Orden
export const getUserProfile = () => JSON.parse(localStorage.getItem(KEYS.profile) || '{}');
export function saveOrder(data){
  const ok = Math.random() > 0.2;
  const orders = read(KEYS.orders);
  orders.push({ ...data, id: orders.length+1, ok, date: new Date().toISOString() });
  write(KEYS.orders, orders);
  return ok;
}
