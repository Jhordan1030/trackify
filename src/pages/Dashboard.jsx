// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';

// Usar la URL desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://trackify-backend-lake.vercel.app/api/v1';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  // Función para cargar todos los datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando datos del dashboard...');

      // Hacer todas las llamadas en paralelo
      const [statsRes, pedidosRes, inventarioRes, clientesRes] = await Promise.all([
        fetch(`${API_URL}/pedidos/estadisticas`),
        fetch(`${API_URL}/pedidos`),
        fetch(`${API_URL}/inventario/skus`),
        fetch(`${API_URL}/clientes`)
      ]);

      // Verificar respuestas
      if (!statsRes.ok) throw new Error(`Error stats: ${statsRes.status}`);
      if (!pedidosRes.ok) throw new Error(`Error pedidos: ${pedidosRes.status}`);
      if (!inventarioRes.ok) throw new Error(`Error inventario: ${inventarioRes.status}`);
      if (!clientesRes.ok) throw new Error(`Error clientes: ${clientesRes.status}`);

      // Convertir a JSON
      const statsData = await statsRes.json();
      const pedidosData = await pedidosRes.json();
      const inventarioData = await inventarioRes.json();
      const clientesData = await clientesRes.json();

      console.log('✅ Datos cargados correctamente');

      // Actualizar estados
      setStats(statsData.data || {});
      setPedidos(pedidosData.data || []);
      setInventario(inventarioData.data || []);
      setClientes(clientesData.data || []);

    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'venta-rapida':
        window.location.href = '/venta-live';
        break;
      case 'agregar-producto':
        window.location.href = '/inventario';
        break;
      case 'buscar-cliente':
        window.location.href = '/clientes';
        break;
      case 'actualizar':
        cargarDatos();
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={cargarDatos}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Resumen general de tu negocio y actividad reciente
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Análisis
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-green-600 text-sm font-medium">+12.5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Ventas Totales</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${parseFloat(stats.ingresos_totales || 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <span className="text-green-600 text-sm font-medium">+5.2%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Pedidos</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total_pedidos || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-green-600 text-sm font-medium">+2.4%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Clientes</h3>
          <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-green-600 text-sm font-medium">+3.1%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Ticket Promedio</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${parseFloat(stats.ticket_promedio || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {pedidos.length} actividades
              </span>
            </div>

            <div className="space-y-4">
              {pedidos.slice(0, 6).map((pedido) => (
                <div key={pedido.id} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pedido.cliente_usuario || 'Cliente'}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 capitalize">{pedido.plataforma}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>📅</span>
                      <span>
                        {new Date(pedido.fecha_creacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      ${parseFloat(pedido.total).toFixed(2)}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
                      pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                      pedido.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                      pedido.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {pedidos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Ver todos los pedidos →
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Columna derecha */}
        <div className="space-y-6">
          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickAction('venta-rapida')}
                className="p-4 rounded-xl border-2 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-200 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500 group-hover:scale-110 transition-transform">
                    <span className="text-white">🛒</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Nueva Venta</p>
                    <p className="text-xs text-gray-600">Registrar venta rápida</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('agregar-producto')}
                className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500 group-hover:scale-110 transition-transform">
                    <span className="text-white">📦</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Agregar Producto</p>
                    <p className="text-xs text-gray-600">Añadir al inventario</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('buscar-cliente')}
                className="p-4 rounded-xl border-2 border-yellow-100 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-200 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-yellow-500 group-hover:scale-110 transition-transform">
                    <span className="text-white">👥</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Buscar Cliente</p>
                    <p className="text-xs text-gray-600">Encontrar o crear</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('actualizar')}
                className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-500 group-hover:scale-110 transition-transform">
                    <span className="text-white">🔄</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">Actualizar</p>
                    <p className="text-xs text-gray-600">Refrescar datos</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen Rápido
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Clientes Activos:</span>
                <span className="font-semibold text-gray-900">{clientes.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Productos en Stock:</span>
                <span className="font-semibold text-green-600">{inventario.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Pedidos del Mes:</span>
                <span className="font-semibold text-blue-600">{stats.total_pedidos || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Tasa de Conversión:</span>
                <span className="font-semibold text-yellow-600">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;