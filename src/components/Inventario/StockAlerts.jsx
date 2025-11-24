import { AlertTriangle, Package } from 'lucide-react';

export const StockAlerts = ({ inventario }) => {
  const stockBajo = inventario?.filter(item => item.stock_bajo) || [];

  if (stockBajo.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-sm border-l-4 border-l-orange-500 p-6">
      <div className="flex items-start space-x-4">
        <div className="bg-orange-100 p-3 rounded-xl flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-4">
            <h4 className="font-bold text-gray-900 text-lg">
              Alertas de Stock Bajo
            </h4>
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {stockBajo.length}
            </span>
          </div>
          <div className="space-y-3">
            {stockBajo.slice(0, 5).map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Package className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-900 truncate block">{item.producto_nombre}</span>
                    <span className="text-gray-500 text-sm truncate block">{item.sku_codigo}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <div className="text-right">
                    <div className="text-orange-600 font-bold text-sm">
                      Stock: {item.stock_actual}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Mínimo: {item.stock_minimo}
                    </div>
                  </div>
                  <div className="w-2 h-8 bg-orange-200 rounded-full"></div>
                </div>
              </div>
            ))}
            {stockBajo.length > 5 && (
              <p className="text-orange-700 text-sm font-medium text-center pt-2 border-t border-orange-200">
                +{stockBajo.length - 5} productos más con stock bajo...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};