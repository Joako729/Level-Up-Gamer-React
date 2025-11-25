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
  // --- AUTH ---
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Credenciales inválidas");
    return res.json();
  },

  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Error en el registro");
    return res.json();
  },

  // --- PRODUCTOS ---
  getProducts: async () => {
    const res = await fetch(`${API_URL}/productos`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    // Mapeo Backend -> Frontend
    return data.map((p: any) => ({
      id: p.id,
      name: p.nombre,
      price: p.precio,
      category: p.categoria,
      description: p.descripcion,
      image: p.imagen,
      stock: p.stock,
      offer: p.offer || false // Asumiendo que agregaste oferta, si no, false
    }));
  },

  createProduct: async (product: any) => {
    // Mapeo Frontend -> Backend
    const backendProduct = {
      nombre: product.name,
      precio: product.price,
      categoria: product.category,
      descripcion: product.description,
      imagen: product.image,
      stock: 10
    };

    const res = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(backendProduct),
    });
    if (!res.ok) throw new Error("Error al crear producto");
    return res.json();
  },

  // --- NUEVO: FUNCIÓN PARA ACTUALIZAR ---
  updateProduct: async (id: number, product: any) => {
    const backendProduct = {
      nombre: product.name,
      precio: product.price,
      categoria: product.category,
      descripcion: product.description,
      imagen: product.image,
      stock: 10
    };

    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(backendProduct),
    });
    if (!res.ok) throw new Error("Error al actualizar");
    return res.json();
  },

  deleteProduct: async (id: number) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar");
    return true;
  }
};