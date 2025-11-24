// src/services/api.ts

export const API_URL = "http://localhost:8080/api";

// Helper para obtener el token guardado
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- AUTENTICACIÓN ---
  login: async (credentials: { email: string; password: string }) => {
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
    // Mapeamos de Backend (Español) a Frontend (Inglés)
    return data.map((p: any) => ({
      id: p.id,
      name: p.nombre,
      price: p.precio,
      category: p.categoria,
      description: p.descripcion,
      image: p.imagen,
      stock: p.stock,
      offer: false // El backend básico no tenía oferta, lo dejamos false por defecto
    }));
  },

  createProduct: async (product: any) => {
    // Mapeamos de Frontend a Backend
    const backendProduct = {
      nombre: product.name,
      precio: product.price,
      categoria: product.category,
      descripcion: product.description,
      imagen: product.image,
      stock: 10 // Valor por defecto
    };

    const res = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(backendProduct),
    });
    if (!res.ok) throw new Error("Error al crear producto (¿Eres Admin?)");
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