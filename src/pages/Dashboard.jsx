// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { StockAlerts } from '../components/Inventario/StockAlerts';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { PerformanceChart } from '../components/Dashboard/PerformanceChart';
import { useStats } from '../hooks/useStats';
import { usePedidos } from '../hooks/usePedidos';
import { useInventario } from '../hooks/useInventario';

const Dashboard = () => {
  const { stats, obtenerEstadisticas } = useStats();
  const { pedidos, obtenerPedidos } = usePedidos();
  const { inventario, obtenerInventario } = useInventario();
  
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      await Promise.all([
        obtenerEstadisticas(),
        obtenerPedidos(),
        obtenerInventario()
      ]);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
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

      {/* Alertas de Stock */}
      <StockAlerts inventario={inventario} />

      {/* Estadísticas Principales */}
      <StatsCards 
        stats={stats} 
        loading={loading}
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna Izquierda - Actividad Reciente */}
        <div className="xl:col-span-2 space-y-6">
          <RecentActivity pedidos={pedidos} loading={loading} />
          
          {activeView === 'analytics' && (
            <PerformanceChart stats={stats} loading={loading} />
          )}
        </div>
        
        {/* Columna Derecha - Acciones y Resumen */}
        <div className="space-y-6">
          <QuickActions onAction={handleQuickAction} />
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen Rápido
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Clientes Activos:</span>
                <span className="font-semibold text-gray-900">{stats?.total_clientes || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Productos en Stock:</span>
                <span className="font-semibold text-green-600">{inventario?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Pedidos del Mes:</span>
                <span className="font-semibold text-blue-600">{stats?.total_pedidos || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Ingresos Totales:</span>
                <span className="font-semibold text-green-600">
                  ${parseFloat(stats?.ingresos_totales || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;