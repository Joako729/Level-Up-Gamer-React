const KEYS = { products:'lug_products', cart:'lug_cart', profile:'lug_profile', orders:'lug_orders' };

function seed(){
  if(!localStorage.getItem(KEYS.products)){
    // Reemplaza el contenido del array "initial" por este:
  const initial = [
    // 🔹 Juegos de mesa
    { id: 1,  name: 'Catan',                  price: 39990, category: 'Juegos de mesa',image: '/Img/Producto_Img/Catan.png', offer: true },
    { id: 2,  name: 'Carcassonne',            price: 34990, category: 'Juegos de mesa', image: '/Img/Producto_Img/Carcassone.png', offer: false },

    // 🔹 Accesorios
    { id: 3,  name: 'Auriculares Gamer',      price: 59990, category: 'Accesorios',     image: '/Img/Producto_Img/Auri.png', offer: false },
    { id: 4,  name: 'Mouse Gamer',            price: 29990, category: 'Accesorios',     image: '/Img/Producto_Img/MouseGamer.png', offer: true },
    { id: 5,  name: 'Mousepad',               price: 12990, category: 'Accesorios',     image: '', offer: false },
    { id: 6,  name: 'Silla Gamer',            price: 129990,category: 'Accesorios',     image: '', offer: false },

    // 🔹 Consolas
    { id: 7,  name: 'PlayStation 5',          price: 599990,category: 'Consolas',       image: '/Img/Producto_Img/Play5.png', offer: true },
    { id: 8,  name: 'Controlador Inalámbrico',price: 54990, category: 'Consolas',       image: '', offer: false },

    // 🔹 PCs
    { id: 9,  name: 'PC Gamer ASUS',          price: 899990,category: 'PCs',            image: '', offer: false },

    // 🔹 Ropa
    { id: 10, name: 'Polera Gamer',           price: 19990, category: 'Ropa',           image: '', offer: false },
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
