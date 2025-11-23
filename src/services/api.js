// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Helper para las peticiones
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Servicios para Clientes
export const clientesService = {
  buscarOCrear: (usuario, plataforma) => 
    fetchAPI(`/clientes/buscar?usuario=${usuario}&plataforma=${plataforma}`),

  listar: (page = 1, limit = 50) => 
    fetchAPI(`/clientes?page=${page}&limit=${limit}`),

  obtener: (id) => 
    fetchAPI(`/clientes/${id}`),

  crear: (clienteData) => 
    fetchAPI('/clientes', { method: 'POST', body: clienteData }),

  actualizar: (id, clienteData) => 
    fetchAPI(`/clientes/${id}`, { method: 'PUT', body: clienteData }),

  eliminar: (id) => 
    fetchAPI(`/clientes/${id}`, { method: 'DELETE' }),

  buscar: (termino, page = 1, limit = 20) => 
    fetchAPI(`/clientes/buscar/${termino}?page=${page}&limit=${limit}`),
};

// Servicios para Inventario
export const inventarioService = {
  listarSKUs: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    return fetchAPI(`/inventario/skus?${params}`);
  },

  obtenerSKU: (skuId) => 
    fetchAPI(`/inventario/sku/${skuId}`),

  crearSKU: (skuData) => 
    fetchAPI('/inventario/sku', { method: 'POST', body: skuData }),

  ajustarStock: (skuId, ajusteData) => 
    fetchAPI(`/inventario/sku/${skuId}/stock`, { 
      method: 'PATCH', 
      body: ajusteData 
    }),

  obtenerMovimientos: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    return fetchAPI(`/inventario/movimientos?${params}`);
  },
};

// Servicios para Pedidos
export const pedidosService = {
  listar: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    return fetchAPI(`/pedidos?${params}`);
  },

  obtener: (id) => 
    fetchAPI(`/pedidos/${id}`),

  registrarVenta: (ventaData) => 
    fetchAPI('/pedidos/live', { method: 'POST', body: ventaData }),

  actualizarEstado: (id, nuevoEstado) => 
    fetchAPI(`/pedidos/${id}/estado`, { 
      method: 'PATCH', 
      body: { nuevoEstado } 
    }),

  obtenerEstadisticas: () => 
    fetchAPI('/pedidos/estadisticas'),
};

export default fetchAPI;