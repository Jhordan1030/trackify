// src/components/Debug/DebugAPI.jsx
import { useEffect, useState } from 'react';
import { useClientes } from '../../hooks/useClientes';
import { useInventario } from '../../hooks/useInventario';
import { usePedidos } from '../../hooks/usePedidos';
import { useStats } from '../../hooks/useStats';

export const DebugAPI = () => {
  const { obtenerClientes, clientes } = useClientes();
  const { obtenerInventario, inventario } = useInventario();
  const { obtenerPedidos, pedidos } = usePedidos();
  const { obtenerEstadisticas, stats } = useStats();

  const [status, setStatus] = useState({});

  const testEndpoints = async () => {
    const endpoints = {
      clientes: 'https://trackify-backend-lake.vercel.app/api/v1/clientes',
      inventario: 'https://trackify-backend-lake.vercel.app/api/v1/inventario/skus',
      pedidos: 'https://trackify-backend-lake.vercel.app/api/v1/pedidos',
      estadisticas: 'https://trackify-backend-lake.vercel.app/api/v1/pedidos/estadisticas',
      health: 'https://trackify-backend-lake.vercel.app/health'
    };

    const results = {};

    for (const [key, url] of Object.entries(endpoints)) {
      try {
        console.log(`🔍 Probando endpoint: ${url}`);
        const response = await fetch(url);
        const data = await response.json();
        results[key] = {
          status: response.status,
          ok: response.ok,
          data: data
        };
        console.log(`✅ ${key}:`, data);
      } catch (error) {
        results[key] = {
          status: 'ERROR',
          error: error.message
        };
        console.error(`❌ ${key}:`, error);
      }
    }

    setStatus(results);
  };

  useEffect(() => {
    testEndpoints();
    obtenerClientes();
    obtenerInventario();
    obtenerPedidos();
    obtenerEstadisticas();
  }, []);

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🔧 Debug API Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {Object.entries(status).map(([key, result]) => (
          <div key={key} className={`p-3 rounded-lg ${
            result.ok ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
          } border`}>
            <strong>{key.toUpperCase()}:</strong> {result.ok ? '✅' : '❌'} 
            {result.status && ` Status: ${result.status}`}
            {result.data && (
              <div className="text-xs mt-1">
                Data: {JSON.stringify(result.data).substring(0, 100)}...
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <strong>Clientes:</strong> {clientes?.length || 0}
          <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-32">
            {JSON.stringify(clientes, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Inventario:</strong> {inventario?.length || 0}
          <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-32">
            {JSON.stringify(inventario, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Pedidos:</strong> {pedidos?.length || 0}
          <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-32">
            {JSON.stringify(pedidos, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-4">
        <strong>Estadísticas:</strong>
        <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-32">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div>

      <button 
        onClick={testEndpoints}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Volver a Probar Endpoints
      </button>
    </div>
  );
};