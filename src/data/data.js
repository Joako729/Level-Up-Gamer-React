const baseProducts = [
  {
    id: 1,
    name: 'Catan',
    price: 39990,
    category: 'Juegos de Mesa',
    image: 'img/Producto_img/Catan.png',
    offer: true    
  },
  {
    id: 2,
    name: 'Carcassonne',
    price: 34990,
    category: 'Juegos de Mesa',
    image: 'img/Producto_img/Carcassonne.png',
    offer: false
  },
  {
    id: 3,
    name: 'Auriculares Gamer Razer Kraken',
    price: 59990,
    category: 'Accesorios',
    image: 'img/Producto_img/Auri.png',  
    offer: true    
  },
  {
    id: 4,
    name: 'Mouse Gamer Logitech G502',
    price: 29990,
    category: 'Accesorios',
    image: 'img/Producto_img/MouseGamer.png',
    offer: false
  },
  {
    id: 5,
    name: 'Mousepad RGB SteelSeries',
    price: 12990,
    category: 'Accesorios',
    image: 'img/Producto_img/Mousepad.png',
    offer: false
  },
  {
    id: 6,
    name: 'Silla Gamer Cougar Armor One',
    price: 129990,
    category: 'Sillas',
    image: 'img/Producto_img/SillaGamer.png',
    offer: false
  },
  {
    id: 7,
    name: 'PlayStation 5',
    price: 599990,
    category: 'Consolas',
    image: 'img/Producto_img/Play5.png',
    offer: true    
  },
  {
    id: 8,
    name: 'Controlador DualSense PS5',
    price: 54990,
    category: 'Consolas',
    image: 'img/Producto_img/Controlador.png',
    offer: false
  },
  {
    id: 9,
    name: 'PC Gamer Intel i7 RTX 4060',
    price: 899990,
    category: 'PCs',
    image: 'img/Producto_img/PCGamer.png',
    offer: false
  },
  {
    id: 10,
    name: 'Polera Level-Up Logo',
    price: 19990,
    category: 'Ropa',
    image: 'img/Producto_img/Polera.png',
    offer: true     
  }
];


const EXTRAS_BY_ID = {
  1:  { description: 'Clásico de estrategia y comercio para 3–4 jugadores; partidas de 60–90 min con tablero modular y alta rejugabilidad.', offerText: '15% de descuento (ahora $33.990)' },
  2:  { description: 'Juego de colocación de losetas y meeples; construye ciudades y caminos con reglas simples pero profundidad estratégica.', offerText: '' },
  3:  { description: 'Headset con micrófono y cancelación de ruido; cómodo para sesiones largas y sonido claro en chat de voz.', offerText: '20% de descuento (ahora $47.990)' },
  4:  { description: 'Sensor preciso y switches rápidos; ideal para shooters y MOBAs, con DPI ajustable para mejor control.', offerText: '' },
  5:  { description: 'Superficie de deslizamiento uniforme con base antideslizante; mejora la precisión del mouse en cada movimiento.', offerText: '' },
  6:  { description: 'Silla ergonómica con soporte lumbar y reclinación; pensada para largas horas de juego o estudio.', offerText: '' },
  7:  { description: 'Consola de nueva generación con SSD ultrarrápido, gráficos 4K y experiencia inmersiva con control háptico.', offerText: '10% de descuento (ahora $539.990)' },
  8:  { description: 'Mando inalámbrico con gatillos adaptativos y vibración háptica; conexión estable y batería de larga duración.', offerText: '' },
  9:  { description: 'Equipo listo para jugar en alto rendimiento; ideal para 1080p/1440p con multitarea fluida.', offerText: '' },
  10: { description: 'Polera temática gamer de tela suave y respirable; calce cómodo para uso diario.', offerText: '20% de descuento (ahora $15.990)' },
};


const products = baseProducts.map(p => ({ ...p, ...(EXTRAS_BY_ID[p.id] || {}) }));


export function listProducts() { return products; }
export function listOffers() { return products.filter(p => p.offer === true); }
export function listProductsByCategory(category) {
  if (!category || category === 'Todo') return products;
  return products.filter(p => (p.category || '').toLowerCase() === String(category).toLowerCase());
}
export function listCategories() {
  const cats = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  return ['Todo', ...cats];
}


const CART_KEY = 'lvlup_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function saveCart(list) {
  localStorage.setItem(CART_KEY, JSON.stringify(list))
}


export function getCart() {
  const ids = loadCart()
  
  const prods = []
  for (const id of ids) {
    const p = listProducts().find(x => x.id === id)
    if (p) prods.push(p)
  }
  return prods
}
export function addToCart(id) {
  const ids = loadCart()
  ids.push(id)
  saveCart(ids)
  return getCart()
}
export function removeFromCart(id) {
  const ids = loadCart()
  const i = ids.indexOf(id)
  if (i !== -1) ids.splice(i, 1)
  saveCart(ids)
  return getCart()
}
export function clearCart() {
  saveCart([])
  return []
}


export function createProduct(newProduct) {
  const nextId = (products.reduce((m, p) => Math.max(m, p.id), 0) || 0) + 1;
  const product = { id: nextId, ...newProduct };
  products.push(product);
  return product;
}
export function updateProduct(id, updated) {
  const i = products.findIndex(p => p.id === id);
  if (i !== -1) products[i] = { ...products[i], ...updated, id };
  return products[i];
}
export function deleteProduct(id) {
  const i = products.findIndex(p => p.id === id);
  if (i !== -1) products.splice(i, 1);
  return true;
}


export function getUserProfile() { return { name: 'Invitado', email: '' }; }
export function saveOrder(order) { console.log('Pedido guardado:', order); return true; }


export { products as default, products };




