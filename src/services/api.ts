// src/services/api.ts
export const API_URL = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- AUTENTICACIÓN ---
  login: async (creds: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(creds)
    });
    if (!res.ok) throw new Error("Error Login");
    return res.json();
  },
  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error Registro");
    return res.json();
  },

  // --- PRODUCTOS (Necesarios para AdminPanel) ---
  getProducts: async () => {
    const res = await fetch(`${API_URL}/productos`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: any) => ({
      id: p.id, name: p.nombre, price: p.precio, category: p.categoria,
      description: p.descripcion, image: p.imagen, stock: p.stock, offer: p.offer || false
    }));
  },
  createProduct: async (prod: any) => {
    const backendProd = {
      nombre: prod.name, precio: prod.price, categoria: prod.category,
      descripcion: prod.description, imagen: prod.image, stock: 10
    };
    const res = await fetch(`${API_URL}/productos`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(backendProd)
    });
    if (!res.ok) throw new Error("Error crear");
    return res.json();
  },
  updateProduct: async (id: number, prod: any) => {
    const backendProd = {
      nombre: prod.name, precio: prod.price, categoria: prod.category,
      descripcion: prod.description, imagen: prod.image, stock: 10
    };
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(backendProd)
    });
    if (!res.ok) throw new Error("Error actualizar");
    return res.json();
  },
  deleteProduct: async (id: number) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE", headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error borrar");
    return true;
  },

  // --- USUARIOS (Solo Admin) ---
  getUsers: async () => {
    const res = await fetch(`${API_URL}/usuarios`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  // --- PEDIDOS (Versión con LOGS para arreglar el error) ---
  createOrder: async (orderData: any) => {
    console.log("📡 Enviando pedido al backend:", orderData);
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(orderData)
    });
    
    // Si falla, leemos el mensaje de error del backend
    if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error al crear pedido (Backend dice):", res.status, errorText);
        throw new Error("Error al guardar pedido: " + errorText);
    }
    
    const data = await res.json();
    console.log("✅ Pedido guardado con éxito:", data);
    return data;
  },

  // Admin ve todos
  getAllOrders: async () => {
    console.log("📡 Buscando TODOS los pedidos (Admin)...");
    const res = await fetch(`${API_URL}/pedidos`, { headers: getAuthHeaders() });
    
    if (!res.ok) {
        console.error("❌ Error al obtener pedidos admin:", res.status, await res.text());
        return []; // Evita romper la app, pero avisa en consola
    }
    
    const data = await res.json();
    console.log("✅ Pedidos Admin recibidos:", data);
    return data;
  },

  // Cliente ve los suyos
  getMyOrders: async () => {
    console.log("📡 Buscando MIS pedidos...");
    const res = await fetch(`${API_URL}/pedidos/mis-pedidos`, { headers: getAuthHeaders() });
    
    if (!res.ok) {
        console.error("❌ Error al obtener mis pedidos:", res.status, await res.text());
        return [];
    }
    
    const data = await res.json();
    console.log("✅ Mis pedidos recibidos:", data);
    return data;
  }
};