const API_URL = import.meta.env.VITE_API_URL || 'https://trackify-backend-lake.vercel.app/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🔄 ${config.method || 'GET'} ${url}`);
      if (config.body) {
        console.log('📦 Body enviado:', JSON.parse(config.body));
      }
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta exitosa:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en request:', error);
      throw error;
    }
  }

  // Métodos HTTP
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // === CLIENTES ===
  clientes = {
    listar: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.get(`/clientes${queryString ? `?${queryString}` : ''}`);
    },
    
    buscar: (usuario, plataforma) => {
      return this.get(`/clientes/buscar?usuario=${encodeURIComponent(usuario)}&plataforma=${encodeURIComponent(plataforma)}`);
    },
    
    buscarPorNombre: (termino) => {
      return this.get(`/clientes/buscar/${encodeURIComponent(termino)}`);
    },
    
    obtener: (id) => {
      return this.get(`/clientes/${id}`);
    },

    obtenerCompleto: (id) => {
      return this.get(`/clientes/${id}/completo`);
    },
    
    crear: (data) => {
      return this.post('/clientes', data);
    },
    
    actualizar: (id, data) => {
      return this.put(`/clientes/${id}`, data);
    },
    
    eliminar: (id) => {
      return this.delete(`/clientes/${id}`);
    },

    reactivar: (id) => {
      return this.patch(`/clientes/${id}/reactivar`);
    },

    buscarPorUsuario: (usuario, plataforma) => {
      return this.get(`/clientes/usuario/${encodeURIComponent(usuario)}/${encodeURIComponent(plataforma)}`);
    }
  };

  // === PRODUCTOS ===
  productos = {
    buscar: (termino) => {
      // Usamos el endpoint de inventario/skus con filtro de búsqueda
      return this.get(`/inventario/skus?search=${encodeURIComponent(termino)}&limit=10`);
    },
    
    obtener: (id) => {
      return this.get(`/productos/${id}`);
    },
  };

  // === INVENTARIO ===
  inventario = {
    listarSKUs: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.get(`/inventario/skus${queryString ? `?${queryString}` : ''}`);
    },
    
    obtenerSKU: (skuId) => {
      return this.get(`/inventario/sku/${skuId}`);
    },
    
    crearSKU: (data) => {
      return this.post('/inventario/sku', data);
    },
    
    ajustarStock: (skuId, data) => {
      return this.patch(`/inventario/sku/${skuId}/stock`, data);
    },
    
    movimientos: () => {
      return this.get('/inventario/movimientos');
    },
  };

  // === PEDIDOS ===
  pedidos = {
    listar: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.get(`/pedidos${queryString ? `?${queryString}` : ''}`);
    },
    
    obtener: (id) => {
      return this.get(`/pedidos/${id}`);
    },
    
    estadisticas: () => {
      return this.get('/pedidos/estadisticas');
    },
    
    registrarVentaLive: (data) => {
      return this.post('/pedidos/live', data);
    },
    
    actualizarEstado: (id, estado, data = {}) => {
      console.log('🎯 API: Actualizando estado del pedido', { id, estado });
      // CAMBIO CRÍTICO: Enviar 'nuevoEstado' en lugar de 'estado'
      return this.patch(`/pedidos/${id}/estado`, {
        nuevoEstado: estado,  // ← ESTE ES EL CAMBIO CLAVE
        ...data
      });
    },
  };

  // === SISTEMA ===
  sistema = {
    health: () => {
      return fetch(`${this.baseURL.replace('/api/v1', '')}/health`).then(r => r.json());
    },
    
    info: () => {
      return fetch(this.baseURL.replace('/api/v1', '')).then(r => r.json());
    },
  };
}

// Crear instancia única
const apiInstance = new ApiService();

// Exportar la instancia
export default apiInstance;