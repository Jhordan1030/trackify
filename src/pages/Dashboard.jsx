// src/pages/Dashboard.jsx - VERSIÓN COMPLETA CORREGIDA
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Building,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalPedidos: 0,
    totalClientes: 0,
    ventasHoy: 0,
    alertasStock: 0,
    totalEmpresas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setRefreshing(true);

      console.log('📊 Cargando datos del dashboard...');
      console.log('👤 Usuario actual:', user);
      console.log('👑 Es super admin:', isSuperAdmin);

      if (isSuperAdmin) {
        // Para super_admin: cargar datos globales
        console.log('🌍 Cargando datos globales para super admin...');
        
        const [empresasRes, inventarioRes, pedidosRes, clientesRes] = await Promise.all([
          api.empresas.getEmpresas().catch(err => {
            console.error('Error cargando empresas:', err);
            return { data: [] };
          }),
          api.inventario.getInventarioTodos().catch(err => {
            console.error('Error cargando inventario:', err);
            return { data: [] };
          }),
          api.pedidos.getPedidos().catch(err => {
            console.error('Error cargando pedidos:', err);
            return { data: [] };
          }),
          api.clientes.getClientes().catch(err => {
            console.error('Error cargando clientes:', err);
            return { data: [] };
          })
        ]);

        console.log('📦 Respuestas recibidas:', {
          empresas: empresasRes,
          inventario: inventarioRes,
          pedidos: pedidosRes,
          clientes: clientesRes
        });

        const empresas = Array.isArray(empresasRes) ? empresasRes : (empresasRes.data || []);
        const inventario = Array.isArray(inventarioRes) ? inventarioRes : (inventarioRes.data || []);
        const pedidos = Array.isArray(pedidosRes) ? pedidosRes : (pedidosRes.data || []);
        const clientes = Array.isArray(clientesRes) ? clientesRes : (clientesRes.data || []);

        console.log('📊 Datos procesados:', {
          empresas: empresas.length,
          inventario: inventario.length,
          pedidos: pedidos.length,
          clientes: clientes.length
        });

        setStats({
          totalProductos: inventario.length,
          totalPedidos: pedidos.length,
          totalClientes: clientes.length,
          ventasHoy: pedidos.filter(p => p.estado === 'entregado').length,
          alertasStock: inventario.filter(p => {
            const stock = p.stock_disponible || p.stock || 0;
            const stockMinimo = p.stock_minimo || 5;
            return stock <= stockMinimo;
          }).length,
          totalEmpresas: empresas.length
        });

      } else {
        // Para admin/usuario: cargar datos de su empresa
        console.log('🏢 Cargando datos de empresa para usuario normal...');
        
        const [inventarioRes, pedidosRes, clientesRes] = await Promise.all([
          api.inventario.getInventario().catch(err => {
            console.error('Error cargando inventario:', err);
            return { data: [] };
          }),
          api.pedidos.getPedidos().catch(err => {
            console.error('Error cargando pedidos:', err);
            return { data: [] };
          }),
          api.clientes.getClientes().catch(err => {
            console.error('Error cargando clientes:', err);
            return { data: [] };
          })
        ]);

        const inventario = Array.isArray(inventarioRes) ? inventarioRes : (inventarioRes.data || []);
        const pedidos = Array.isArray(pedidosRes) ? pedidosRes : (pedidosRes.data || []);
        const clientes = Array.isArray(clientesRes) ? clientesRes : (clientesRes.data || []);

        setStats({
          totalProductos: inventario.length,
          totalPedidos: pedidos.length,
          totalClientes: clientes.length,
          ventasHoy: pedidos.filter(p => p.estado === 'entregado').length,
          alertasStock: inventario.filter(p => {
            const stock = p.stock_disponible || p.stock || 0;
            const stockMinimo = p.stock_minimo || 5;
            return stock <= stockMinimo;
          }).length,
          totalEmpresas: 0
        });
      }

      console.log('✅ Datos del dashboard cargados exitosamente');

    } catch (err) {
      console.error('❌ Error cargando dashboard:', err);
      setError(err.message || 'Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, isSuperAdmin]);

  const handleRefresh = () => {
    loadDashboardData();
  };

  const statCards = [
    ...(isSuperAdmin ? [{
      title: 'Total Empresas',
      value: stats.totalEmpresas,
      icon: Building,
      color: 'purple',
      change: '+2%'
    }] : []),
    {
      title: 'Total Productos',
      value: stats.totalProductos,
      icon: Package,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Pedidos Activos',
      value: stats.totalPedidos,
      icon: ShoppingCart,
      color: 'green',
      change: '+5%'
    },
    {
      title: 'Total Clientes',
      value: stats.totalClientes,
      icon: Users,
      color: 'orange',
      change: '+8%'
    },
    {
      title: 'Ventas Hoy',
      value: stats.ventasHoy,
      icon: TrendingUp,
      color: 'emerald',
      change: '+15%'
    }
  ];

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !refreshing) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Error al cargar el dashboard</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Reintentar
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Ir al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Bienvenido de vuelta, {user?.nombre || 'Usuario'}!
              </h1>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                title="Actualizar datos"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              {isSuperAdmin 
                ? 'Panel de control global - Super Administrador' 
                : `Dashboard de ${user?.empresaNombre || 'tu empresa'}`
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Hoy es</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {stats.alertasStock > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">
              Tienes {stats.alertasStock} productos con stock bajo
            </span>
          </div>
        </div>
      )}

      {/* Loading durante refresh */}
      {refreshing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <RefreshCw className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
            <span className="text-blue-800">Actualizando datos...</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = {
            blue: 'text-blue-600 bg-blue-50',
            green: 'text-green-600 bg-green-50',
            purple: 'text-purple-600 bg-purple-50',
            orange: 'text-orange-600 bg-orange-50',
            emerald: 'text-emerald-600 bg-emerald-50'
          };

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{card.change} desde ayer</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/inventario'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium">Gestionar Inventario</span>
          </button>
          <button 
            onClick={() => window.location.href = '/pedidos'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-sm font-medium">Ver Pedidos</span>
          </button>
          <button 
            onClick={() => window.location.href = '/clientes'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium">Gestionar Clientes</span>
          </button>
          <button 
            onClick={() => window.location.href = '/venta-live'}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-orange-600 mr-3" />
            <span className="text-sm font-medium">Venta Live</span>
          </button>
        </div>
      </div>

      {/* Información de debug (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Debug Info</h3>
          <pre className="text-xs text-gray-600">
            {JSON.stringify({
              user: {
                id: user?.id,
                email: user?.email,
                rol: user?.rol,
                empresaId: user?.empresaId
              },
              stats,
              isSuperAdmin
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;