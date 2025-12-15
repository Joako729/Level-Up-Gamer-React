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

  // --- PRODUCTOS ---
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

  // --- USUARIOS ---
  getUsers: async () => {
    const res = await fetch(`${API_URL}/usuarios`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return res.json();
  },
  deleteUser: async (id: number) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE", headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error borrar usuario");
    return true;
  },

  // --- PEDIDOS ---
  createOrder: async (orderData: any) => {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error("Error pedido");
    return res.json();
  },
  getAllOrders: async () => {
    const res = await fetch(`${API_URL}/pedidos`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return res.json();
  },
  getMyOrders: async () => {
    const res = await fetch(`${API_URL}/pedidos/mis-pedidos`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return res.json();
  },
  deleteOrder: async (id: number) => {
    const res = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "DELETE", headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error borrar pedido");
    return true;
  },

  // --- NUEVO: RESEÑAS ---
  getReviewsByProduct: async (productId: number) => {
    const res = await fetch(`${API_URL}/resenias/producto/${productId}`);
    if (!res.ok) return [];
    return res.json();
  },
  createReview: async (data: { productoId: number, emailUsuario: string, comentario: string, calificacion: number }) => {
    const res = await fetch(`${API_URL}/resenias`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error al publicar reseña");
    return res.json();
  }
};