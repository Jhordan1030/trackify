// src/services/api.js - ACTUALIZADO CON ENDPOINT DE ACTUALIZACIÓN
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
      
      // Obtener el texto de la respuesta
      const responseText = await response.text();
      
      if (!response.ok) {
        // Intentar parsear como JSON para obtener mensaje de error
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: `Error ${response.status}: ${response.statusText}` };
        }
        
        console.error('❌ Error del servidor:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData
        });
        
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Parsear la respuesta exitosa
      const data = JSON.parse(responseText);
      console.log('✅ Respuesta exitosa:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en request:', {
        message: error.message,
        endpoint: url,
        method: config.method
      });
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

  // === INVENTARIO ===
  inventario = {
    listarSKUs: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.stockBajo) queryParams.append('stockBajo', 'true');
      if (params.activo !== undefined) queryParams.append('activo', params.activo.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      return this.get(`/inventario/skus${queryString ? `?${queryString}` : ''}`);
    },
    
    obtenerSKU: (skuId) => {
      return this.get(`/inventario/sku/${skuId}`);
    },
    
    crearProducto: (productoData) => {
      return this.post('/inventario/sku', productoData);
    },
    
    // Endpoint de debug
    crearProductoDebug: (productoData) => {
      return this.post('/inventario/sku-debug', productoData);
    },
    
    // NUEVO: Actualizar producto
    actualizarProducto: (productoId, productoData) => {
      return this.put(`/inventario/producto/${productoId}`, productoData);
    },
    
    // ALTERNATIVA: Si el endpoint es diferente
    actualizarProductoAlternativo: (productoId, productoData) => {
      return this.patch(`/inventario/producto/${productoId}`, productoData);
    },
    
    ajustarStock: (skuId, ajusteData) => {
      return this.patch(`/inventario/sku/${skuId}/stock`, ajusteData);
    },
    
    obtenerMovimientos: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.skuId) queryParams.append('skuId', params.skuId.toString());
      if (params.tipoMovimiento) queryParams.append('tipoMovimiento', params.tipoMovimiento);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      return this.get(`/inventario/movimientos${queryString ? `?${queryString}` : ''}`);
    },

    // NUEVO: Obtener producto por ID (para edición)
    obtenerProducto: (productoId) => {
      return this.get(`/inventario/producto/${productoId}`);
    },

    // NUEVO: Eliminar producto
    eliminarProducto: (productoId) => {
      return this.delete(`/inventario/producto/${productoId}`);
    },

    // NUEVO: Desactivar producto
    desactivarProducto: (productoId) => {
      return this.patch(`/inventario/producto/${productoId}/desactivar`);
    },

    // NUEVO: Reactivar producto
    reactivarProducto: (productoId) => {
      return this.patch(`/inventario/producto/${productoId}/reactivar`);
    }
  };

  // ... resto de los métodos (clientes, pedidos, sistema) se mantienen igual
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
      return this.patch(`/pedidos/${id}/estado`, {
        nuevoEstado: estado,
        ...data
      });
    },
  };

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