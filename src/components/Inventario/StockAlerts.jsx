// src/components/Inventario/StockAlerts.jsx
import { AlertTriangle, Package } from 'lucide-react';

export const StockAlerts = ({ inventario }) => {
  const stockBajo = inventario?.filter(item => item.stock_bajo) || [];

  if (stockBajo.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
            Alertas de Stock Bajo ({stockBajo.length})
          </h4>
          <div className="space-y-2">
            {stockBajo.slice(0, 5).map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-1 sm:gap-0">
                <div className="flex items-center space-x-2 min-w-0">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-medium truncate">{item.producto_nombre}</span>
                  <span className="text-gray-500 truncate hidden sm:inline">({item.sku_codigo})</span>
                </div>
                <div className="text-yellow-600 font-semibold text-xs sm:text-sm">
                  Stock: {item.stock_actual} (Mín: {item.stock_minimo})
                </div>
              </div>
            ))}
            {stockBajo.length > 5 && (
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                +{stockBajo.length - 5} productos más con stock bajo...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};