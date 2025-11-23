import { Package, AlertTriangle, TrendingUp, Archive } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const InventarioList = ({ inventario, loading, onAjustarStock }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center py-8">
          <div className="spinner w-8 h-8 border-2 border-primary-200 border-t-primary-600" />
        </div>
      </div>
    );
  }

  if (!inventario || inventario.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
          <p className="text-gray-500">Los productos aparecerán aquí cuando se agreguen al inventario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Inventario ({inventario.length} productos)
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {inventario.map((item, index) => (
          <div
            key={item.id}
            className={`card-hover animate-fade-in-up ${
              item.stock_bajo ? 'border-warning-200 bg-warning-50' : ''
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  item.stock_bajo 
                    ? 'bg-warning-100 text-warning-600' 
                    : 'bg-primary-100 text-primary-600'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-1">
                    {item.producto_nombre}
                  </h4>
                  <p className="text-sm text-gray-500">{item.sku_codigo}</p>
                </div>
              </div>
              {item.stock_bajo && (
                <AlertTriangle className="w-5 h-5 text-warning-500" />
              )}
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>Categoría:</strong> {item.categoria}</p>
                {Object.keys(item.variacion || {}).length > 0 && (
                  <p><strong>Variaciones:</strong> {JSON.stringify(item.variacion)}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Stock Actual</p>
                  <p className={`font-semibold ${
                    item.stock_bajo ? 'text-warning-600' : 'text-gray-900'
                  }`}>
                    {item.stock_actual}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Disponible</p>
                  <p className="font-semibold text-gray-900">
                    {item.stock_disponible}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Reservado</p>
                  <p className="font-semibold text-gray-900">
                    {item.stock_reservado}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Mínimo</p>
                  <p className="font-semibold text-gray-900">
                    {item.stock_minimo}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold text-lg text-gray-900">
                  {formatCurrency(item.precio_venta)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAjustarStock(item.id, 'entrada_compra')}
                    className="btn btn-success text-xs"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Stock
                  </button>
                  <button
                    onClick={() => onAjustarStock(item.id, 'salida_ajuste')}
                    className="btn btn-outline text-xs"
                  >
                    <Archive className="w-3 h-3 mr-1" />
                    Ajustar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};