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
        </div >
      )}
    </div >
  );
};

export default Dashboard;