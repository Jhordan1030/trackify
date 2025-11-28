// src/services/api.js - MOCK VERSION FOR DEMO
// NO PERSISTENCE - DATA RESETS ON RELOAD

// --- MOCK DATA ---

const mockData = {
  user: {
    id: '3',
    nombre: 'Vendedor Demo',
    email: 'vendedor@trackify.demo',
    rol: 'usuario',
    empresaId: '1',
    empresaNombre: 'Trackify Demo Corp'
  },
  empresas: [
    { id: '1', nombre: 'Trackify Demo Corp', ruc: '20123456789', direccion: 'Av. Demo 123', telefono: '555-0001', estado: 'activo', createdAt: new Date().toISOString() },
    { id: '2', nombre: 'Cliente Ejemplo SAC', ruc: '20987654321', direccion: 'Jr. Prueba 456', telefono: '555-0002', estado: 'activo', createdAt: new Date().toISOString() }
  ],
  usuarios: [
    { id: '1', nombre: 'Demo Super Admin', email: 'admin@trackify.demo', rol: 'super_admin', empresaId: '1', estado: 'activo' },
    { id: '2', nombre: 'Gerente Demo', email: 'gerente@cliente.demo', rol: 'admin', empresaId: '2', estado: 'activo' },
    { id: '3', nombre: 'Vendedor Demo', email: 'vendedor@trackify.demo', rol: 'usuario', empresaId: '1', estado: 'activo' }
  ],
  inventario: [
    { id: '101', sku: 'LAP-001', nombre: 'Laptop Gamer Pro', descripcion: 'Laptop de alta gama', precio: 1500.00, stock: 25, categoria: 'Electrónica', estado: 'activo' },
    { id: '102', sku: 'MOU-002', nombre: 'Mouse Inalámbrico', descripcion: 'Mouse ergonómico', precio: 25.50, stock: 150, categoria: 'Accesorios', estado: 'activo' },
    { id: '103', sku: 'MON-003', nombre: 'Monitor 27" 4K', descripcion: 'Monitor IPS', precio: 350.00, stock: 10, categoria: 'Electrónica', estado: 'activo' },
    { id: '104', sku: 'KEY-004', nombre: 'Teclado Mecánico', descripcion: 'Switch Blue', precio: 80.00, stock: 45, categoria: 'Accesorios', estado: 'activo' }
  ],
  clientes: [
    { id: '201', nombre: 'Juan Pérez', email: 'juan@mail.com', telefono: '999888777', documento: '44556677', tipoDocumento: 'DNI', direccion: 'Calle 1', usuario: 'juanperez', nombre_completo: 'Juan Pérez', plataforma: 'Web' },
    { id: '202', nombre: 'Empresa ABC', email: 'contacto@abc.com', telefono: '999111222', documento: '20100200300', tipoDocumento: 'RUC', direccion: 'Av. Industrial 500', usuario: 'empresaabc', nombre_completo: 'Empresa ABC S.A.C.', plataforma: 'Tienda' }
  ],
  pedidos: [
    {
      id: '301',
      cliente: { nombre: 'Juan Pérez' },
      total: 1525.50,
      estado: 'completado',
      fecha: new Date(Date.now() - 86400000).toISOString(),
      items: [
        { producto: 'Laptop Gamer Pro', cantidad: 1, precio: 1500.00 },
        { producto: 'Mouse Inalámbrico', cantidad: 1, precio: 25.50 }
      ]
    },
    {
      id: '302',
      cliente: { nombre: 'Empresa ABC' },
      total: 3500.00,
      estado: 'pendiente_pago',
      fecha: new Date().toISOString(),
      items: [
        { producto: 'Monitor 27" 4K', cantidad: 10, precio: 350.00 }
      ]
    }
  ],
  auditoria: [
    { id: '1', accion: 'LOGIN', usuario: 'Demo Super Admin', fecha: new Date().toISOString(), detalle: 'Inicio de sesión exitoso' }
  ]
};

// --- HELPER FUNCTIONS ---

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- MOCK API IMPLEMENTATION ---

export const authAPI = {
  login: async (email, password) => {
    await delay(500);
    return {
      success: true,
      data: {
        token: 'mock-token-123',
        user: mockData.user
      }
    };
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },

  getProfile: async () => {
    await delay(300);
    return { success: true, data: mockData.user };
  },

  verifyToken: async () => {
    await delay(200);
    return { success: true, data: { valid: true, user: mockData.user } };
  },

  changePassword: async (currentPassword, newPassword) => {
    await delay(500);
    return { success: true, message: 'Contraseña actualizada (Demo)' };
  }
};

export const empresasAPI = {
  getEmpresas: async () => {
    await delay(400);
    return { success: true, data: mockData.empresas };
  },

  createEmpresa: async (empresaData) => {
    await delay(500);
    const newEmpresa = { ...empresaData, id: generateId(), createdAt: new Date().toISOString(), estado: 'activo' };
    mockData.empresas.push(newEmpresa);
    return { success: true, data: newEmpresa };
  },

  updateEmpresa: async (id, empresaData) => {
    await delay(400);
    const index = mockData.empresas.findIndex(e => e.id === id);
    if (index !== -1) {
      mockData.empresas[index] = { ...mockData.empresas[index], ...empresaData };
      return { success: true, data: mockData.empresas[index] };
    }
    return { success: false, error: 'Empresa no encontrada' };
  },

  toggleEmpresaStatus: async (id) => {
    await delay(300);
    const index = mockData.empresas.findIndex(e => e.id === id);
    if (index !== -1) {
      mockData.empresas[index].estado = mockData.empresas[index].estado === 'activo' ? 'inactivo' : 'activo';
      return { success: true, data: mockData.empresas[index] };
    }
    return { success: false, error: 'Empresa no encontrada' };
  }
};

export const usuariosAPI = {
  getUsuarios: async () => {
    await delay(400);
    return { success: true, data: mockData.usuarios };
  },

  getUsuariosByEmpresa: async (empresaId) => {
    await delay(400);
    const usuarios = mockData.usuarios.filter(u => u.empresaId === empresaId);
    return { success: true, data: usuarios };
  },

  createUsuario: async (usuarioData) => {
    await delay(500);
    const newUsuario = { ...usuarioData, id: generateId(), estado: 'activo' };
    mockData.usuarios.push(newUsuario);
    return { success: true, data: newUsuario };
  },

  updateUsuario: async (id, usuarioData) => {
    await delay(400);
    const index = mockData.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      mockData.usuarios[index] = { ...mockData.usuarios[index], ...usuarioData };
      return { success: true, data: mockData.usuarios[index] };
    }
    return { success: false, error: 'Usuario no encontrado' };
  },

  toggleUsuarioStatus: async (id) => {
    await delay(300);
    const index = mockData.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      mockData.usuarios[index].estado = mockData.usuarios[index].estado === 'activo' ? 'inactivo' : 'activo';
      return { success: true, data: mockData.usuarios[index] };
    }
    return { success: false, error: 'Usuario no encontrado' };
  }
};

export const inventarioAPI = {
  getInventario: async () => {
    await delay(400);
    return { success: true, data: mockData.inventario };
  },

  getInventarioTodos: async () => {
    await delay(400);
    return { success: true, data: mockData.inventario };
  },

  createProducto: async (productoData) => {
    await delay(500);
    const newProducto = {
      ...productoData,
      id: generateId(),
      estado: 'activo',
      stock_disponible: productoData.stock || 0,
      stock_minimo: 5
    };
    mockData.inventario.push(newProducto);
    return { success: true, data: newProducto };
  },

  updateProducto: async (id, productoData) => {
    await delay(400);
    const index = mockData.inventario.findIndex(p => p.id === id);
    if (index !== -1) {
      mockData.inventario[index] = { ...mockData.inventario[index], ...productoData };
      return { success: true, data: mockData.inventario[index] };
    }
    return { success: false, error: 'Producto no encontrado' };
  },

  deleteProducto: async (id) => {
    await delay(300);
    const index = mockData.inventario.findIndex(p => p.id === id);
    if (index !== -1) {
      mockData.inventario[index].estado = 'inactivo';
      return { success: true, message: 'Producto desactivado' };
    }
    return { success: false, error: 'Producto no encontrado' };
  }
};

export const pedidosAPI = {
  // Alias for compatibility
  listar: async () => {
    await delay(400);
    return { success: true, data: mockData.pedidos };
  },

  obtener: async (id) => {
    await delay(300);
    const pedido = mockData.pedidos.find(p => p.id === id);
    if (pedido) {
      return { success: true, data: pedido };
    }
    return { success: false, error: 'Pedido no encontrado' };
  },

  actualizarEstado: async (id, nuevoEstado) => {
    await delay(400);
    const index = mockData.pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      mockData.pedidos[index].estado = nuevoEstado;
      return { success: true, data: mockData.pedidos[index] };
    }
    return { success: false, error: 'Pedido no encontrado' };
  },

  getPedidos: async () => {
    await delay(400);
    return { success: true, data: mockData.pedidos };
  },

  createPedido: async (pedidoData) => {
    await delay(600);
    const newPedido = {
      ...pedidoData,
      id: generateId(),
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };
    mockData.pedidos.unshift(newPedido);
    return { success: true, data: newPedido };
  },

  registrarVentaLive: async (ventaData) => {
    await delay(600);
    const newPedido = {
      id: generateId(),
      numero_pedido: `PED-${Math.floor(Math.random() * 10000)}`,
      cliente: { nombre: ventaData.usuario || 'Cliente Live' },
      total: ventaData.total,
      subtotal: ventaData.subtotal,
      costo_envio: ventaData.costo_envio,
      estado: 'pendiente_pago',
      fecha: new Date().toISOString(),
      items: ventaData.items || []
    };
    mockData.pedidos.unshift(newPedido);
    return { success: true, data: newPedido };
  },

  updatePedido: async (id, pedidoData) => {
    await delay(400);
    const index = mockData.pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      mockData.pedidos[index] = { ...mockData.pedidos[index], ...pedidoData };
      return { success: true, data: mockData.pedidos[index] };
    }
    return { success: false, error: 'Pedido no encontrado' };
  }
};

export const clientesAPI = {
  // Alias for compatibility
  listar: async (params = {}) => {
    await delay(400);
    return { success: true, data: mockData.clientes };
  },

  eliminar: async (id) => {
    await delay(300);
    const index = mockData.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      mockData.clientes.splice(index, 1);
      return { success: true, message: 'Cliente eliminado' };
    }
    return { success: false, error: 'Cliente no encontrado' };
  },

  getClientes: async () => {
    await delay(400);
    return { success: true, data: mockData.clientes };
  },

  createCliente: async (clienteData) => {
    await delay(500);
    const newCliente = { ...clienteData, id: generateId() };
    mockData.clientes.push(newCliente);
    return { success: true, data: newCliente };
  },

  updateCliente: async (id, clienteData) => {
    await delay(400);
    const index = mockData.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      mockData.clientes[index] = { ...mockData.clientes[index], ...clienteData };
      return { success: true, data: mockData.clientes[index] };
    }
    return { success: false, error: 'Cliente no encontrado' };
  }
};

export const auditoriaAPI = {
  getLogs: async (filters = {}) => {
    await delay(300);
    return { success: true, data: mockData.auditoria };
  },

  getStats: async () => {
    await delay(300);
    return {
      success: true,
      data: {
        totalUsuarios: mockData.usuarios.length,
        totalEmpresas: mockData.empresas.length,
        totalPedidos: mockData.pedidos.length,
        ventasHoy: 1500.00
      }
    };
  }
};

export default {
  auth: authAPI,
  empresas: empresasAPI,
  usuarios: usuariosAPI,
  inventario: inventarioAPI,
  pedidos: pedidosAPI,
  clientes: clientesAPI,
  auditoria: auditoriaAPI
};