import { AlertTriangle, Package } from 'lucide-react';

export const StockAlerts = ({ inventario }) => {
  const stockBajo = inventario?.filter(item => item.stock_bajo) || [];

  if (stockBajo.length === 0) {
    return null;
  }

  return (
    <div className="card border-l-4 border-l-warning-500">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-warning-500 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">
            Alertas de Stock Bajo ({stockBajo.length})
          </h4>
          <div className="space-y-2">
            {stockBajo.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{item.producto_nombre}</span>
                  <span className="text-gray-500">({item.sku_codigo})</span>
                </div>
                <div className="text-warning-600 font-semibold">
                  Stock: {item.stock_actual} (Mín: {item.stock_minimo})
                </div>
              </div>
            ))}
            {stockBajo.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                +{stockBajo.length - 5} productos más con stock bajo...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};