// src/services/api.js - COMPLETO CON ENDPOINTS ADICIONALES
const API_URL = import.meta.env.VITE_API_URL || 'https://trackify-backend-lake.vercel.app/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
    console.log('🔗 Conectando a API:', this.baseURL);
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

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log('🚀 Request:', url, config.method);
      const response = await fetch(url, config);
      
      if (response.status === 204) {
        return { success: true };
      }
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { 
            message: `Error ${response.status}: ${response.statusText}` 
          };
        }
        
        const errorMessage = errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`;
        console.error('❌ API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Network Error:', error.message);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data,
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // === INVENTARIO ===
  inventario = {
    // SKUs
    listarSKUs: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.stockBajo) queryParams.append('stockBajo', 'true');
      if (params.activo !== undefined) queryParams.append('activo', params.activo.toString());
      if (params.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      return this.get(`/inventario/skus/todos${queryString ? `?${queryString}` : ''}`);
    },
    
    obtenerSKU: (skuId) => {
      return this.get(`/inventario/sku/${skuId}`);
    },
    
    crearProducto: (productoData) => {
      return this.post('/inventario/sku', productoData);
    },
    
    crearProductoDebug: (productoData) => {
      return this.post('/inventario/sku-debug', productoData);
    },
    
    actualizarProducto: (productoId, productoData) => {
      return this.put(`/inventario/producto/${productoId}`, productoData);
    },
    
    ajustarStock: (skuId, ajusteData) => {
      return this.patch(`/inventario/sku/${skuId}/stock`, ajusteData);
    },

    // Movimientos
    obtenerMovimientos: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.skuId) queryParams.append('skuId', params.skuId.toString());
      if (params.tipoMovimiento) queryParams.append('tipoMovimiento', params.tipoMovimiento);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);

      const queryString = queryParams.toString();
      return this.get(`/inventario/movimientos${queryString ? `?${queryString}` : ''}`);
    },

    // Gestión de estado
    desactivarProducto: (productoId) => {
      return this.patch(`/inventario/producto/${productoId}/desactivar`);
    },

    reactivarProducto: (productoId) => {
      return this.patch(`/inventario/producto/${productoId}/reactivar`);
    },

    // Categorías (NUEVO)
    listarCategorias: () => {
      return this.get('/inventario/categorias');
    },

    crearCategoria: (categoriaData) => {
      return this.post('/inventario/categorias', categoriaData);
    },

    actualizarCategoria: (categoriaId, categoriaData) => {
      return this.put(`/inventario/categorias/${categoriaId}`, categoriaData);
    },

    eliminarCategoria: (categoriaId) => {
      return this.delete(`/inventario/categorias/${categoriaId}`);
    },

    // Reportes (NUEVO)
    obtenerReporteStock: () => {
      return this.get('/inventario/reportes/stock');
    },

    obtenerReporteMovimientos: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
      if (params.categoria) queryParams.append('categoria', params.categoria);

      const queryString = queryParams.toString();
      return this.get(`/inventario/reportes/movimientos${queryString ? `?${queryString}` : ''}`);
    }
  };

  // === CLIENTES ===
  clientes = {
    // Listado
    listar: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.plataforma) queryParams.append('plataforma', params.plataforma);

      const queryString = queryParams.toString();
      return this.get(`/clientes/todos${queryString ? `?${queryString}` : ''}`);
    },
    
    // Búsquedas
    buscarOCrear: (usuario, plataforma) => {
      return this.get(`/clientes/buscar?usuario=${encodeURIComponent(usuario)}&plataforma=${encodeURIComponent(plataforma)}`);
    },
    
    buscarPorTermino: (termino) => {
      return this.get(`/clientes/buscar/${encodeURIComponent(termino)}`);
    },

    buscarPorUsuario: (usuario, plataforma) => {
      return this.get(`/clientes/usuario/${encodeURIComponent(usuario)}/${encodeURIComponent(plataforma)}`);
    },
    
    // Operaciones CRUD
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

    // Reportes y estadísticas (NUEVO)
    obtenerEstadisticas: () => {
      return this.get('/clientes/estadisticas');
    },

    obtenerClientesFrecuentes: (limite = 10) => {
      return this.get(`/clientes/frecuentes?limite=${limite}`);
    },

    exportarClientes: (formato = 'json') => {
      return this.get(`/clientes/exportar?formato=${formato}`);
    },

    // Segmentación (NUEVO)
    obtenerSegmentos: () => {
      return this.get('/clientes/segmentos');
    },

    obtenerClientesPorSegmento: (segmento) => {
      return this.get(`/clientes/segmentos/${encodeURIComponent(segmento)}`);
    }
  };

  // === PEDIDOS ===
  pedidos = {
    // Listado
    listar: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.clienteId) queryParams.append('clienteId', params.clienteId);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);

      const queryString = queryParams.toString();
      return this.get(`/pedidos${queryString ? `?${queryString}` : ''}`);
    },
    
    // Operaciones básicas
    obtener: (id) => {
      return this.get(`/pedidos/${id}`);
    },
    
    crear: (pedidoData) => {
      return this.post('/pedidos', pedidoData);
    },

    actualizar: (id, pedidoData) => {
      return this.put(`/pedidos/${id}`, pedidoData);
    },

    eliminar: (id) => {
      return this.delete(`/pedidos/${id}`);
    },

    // Estados
    actualizarEstado: (id, nuevoEstado) => {
      return this.patch(`/pedidos/${id}/estado`, { nuevoEstado });
    },

    obtenerHistorialEstados: (pedidoId) => {
      return this.get(`/pedidos/${pedidoId}/historial-estados`);
    },

    // Live sales
    registrarVentaLive: (data) => {
      return this.post('/pedidos/live', data);
    },

    // Reportes y estadísticas
    estadisticas: () => {
      return this.get('/pedidos/estadisticas');
    },

    obtenerVentasPorPeriodo: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
      if (params.agruparPor) queryParams.append('agruparPor', params.agruparPor);

      const queryString = queryParams.toString();
      return this.get(`/pedidos/reportes/ventas-periodo${queryString ? `?${queryString}` : ''}`);
    },

    obtenerProductosMasVendidos: (limite = 10) => {
      return this.get(`/pedidos/reportes/productos-mas-vendidos?limite=${limite}`);
    },

    // Notificaciones (NUEVO)
    enviarNotificacion: (pedidoId, mensaje) => {
      return this.post(`/pedidos/${pedidoId}/notificar`, { mensaje });
    },

    // Exportación (NUEVO)
    exportarPedidos: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
      if (params.estado) queryParams.append('estado', params.estado);
      if (params.formato) queryParams.append('formato', params.formato);

      const queryString = queryParams.toString();
      return this.get(`/pedidos/exportar${queryString ? `?${queryString}` : ''}`);
    }
  };

  // === DASHBOARD === (NUEVO)
  dashboard = {
    obtenerResumen: () => {
      return this.get('/dashboard/resumen');
    },

    obtenerMetricasVentas: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.rango) queryParams.append('rango', params.rango);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);

      const queryString = queryParams.toString();
      return this.get(`/dashboard/metricas-ventas${queryString ? `?${queryString}` : ''}`);
    },

    obtenerKPI: () => {
      return this.get('/dashboard/kpi');
    },

    obtenerAlertas: () => {
      return this.get('/dashboard/alertas');
    },

    obtenerTendencias: (periodo = '30d') => {
      return this.get(`/dashboard/tendencias?periodo=${periodo}`);
    }
  };

  // === REPORTES AVANZADOS === (NUEVO)
  reportes = {
    // Reportes financieros
    obtenerBalanceVentas: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);

      const queryString = queryParams.toString();
      return this.get(`/reportes/balance-ventas${queryString ? `?${queryString}` : ''}`);
    },

    obtenerMargenes: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);

      const queryString = queryParams.toString();
      return this.get(`/reportes/margenes${queryString ? `?${queryString}` : ''}`);
    },

    // Reportes de inventario
    obtenerAnalisisStock: () => {
      return this.get('/reportes/analisis-stock');
    },

    obtenerRotacionProductos: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.periodo) queryParams.append('periodo', params.periodo);

      const queryString = queryParams.toString();
      return this.get(`/reportes/rotacion-productos${queryString ? `?${queryString}` : ''}`);
    },

    // Reportes de clientes
    obtenerComportamientoClientes: () => {
      return this.get('/reportes/comportamiento-clientes');
    },

    obtenerFidelizacion: () => {
      return this.get('/reportes/fidelizacion');
    }
  };

  // === CONFIGURACIÓN === (NUEVO)
  configuracion = {
    // Configuración general
    obtenerConfig: () => {
      return this.get('/configuracion');
    },

    actualizarConfig: (configData) => {
      return this.put('/configuracion', configData);
    },

    // Configuración de negocio
    obtenerInfoNegocio: () => {
      return this.get('/configuracion/negocio');
    },

    actualizarInfoNegocio: (negocioData) => {
      return this.put('/configuracion/negocio', negocioData);
    },

    // Configuración de notificaciones
    obtenerNotificaciones: () => {
      return this.get('/configuracion/notificaciones');
    },

    actualizarNotificaciones: (notificacionesData) => {
      return this.put('/configuracion/notificaciones', notificacionesData);
    }
  };

  // === BACKUP Y EXPORTACIÓN === (NUEVO)
  sistema = {
    // Health check
    health: () => {
      return this.get('/health');
    },
    
    // Información del sistema
    info: () => {
      return this.get('/');
    },

    // Backup
    crearBackup: () => {
      return this.post('/sistema/backup');
    },

    listarBackups: () => {
      return this.get('/sistema/backups');
    },

    restaurarBackup: (backupId) => {
      return this.post(`/sistema/backups/${backupId}/restaurar`);
    },

    // Logs
    obtenerLogs: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      if (params.nivel) queryParams.append('nivel', params.nivel);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
      if (params.limite) queryParams.append('limite', params.limite);

      const queryString = queryParams.toString();
      return this.get(`/sistema/logs${queryString ? `?${queryString}` : ''}`);
    },

    // Limpieza
    limpiarCache: () => {
      return this.post('/sistema/limpiar-cache');
    },

    optimizarBD: () => {
      return this.post('/sistema/optimizar-bd');
    }
  };

  // === UTILIDADES === (NUEVO)
  utilidades = {
    // Importación de datos
    importarClientes: (archivoData) => {
      return this.post('/utilidades/importar/clientes', archivoData);
    },

    importarProductos: (archivoData) => {
      return this.post('/utilidades/importar/productos', archivoData);
    },

    importarPedidos: (archivoData) => {
      return this.post('/utilidades/importar/pedidos', archivoData);
    },

    // Plantillas
    descargarPlantilla: (tipo) => {
      return this.get(`/utilidades/plantillas/${tipo}`);
    },

    // Sincronización
    sincronizarPlataformas: () => {
      return this.post('/utilidades/sincronizar');
    },

    // Busqueda global
    busquedaGlobal: (termino) => {
      return this.get(`/utilidades/busqueda-global?q=${encodeURIComponent(termino)}`);
    }
  };
}

const apiInstance = new ApiService();
export default apiInstance;