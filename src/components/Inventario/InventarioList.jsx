// src/components/Inventario/InventarioList.jsx - MEJORADO CON IMPORTAR
import { Package, AlertTriangle, TrendingUp, Archive, Plus, Edit, Upload } from 'lucide-react';

// Función helper para formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const InventarioList = ({ 
  inventario, 
  loading, 
  onAjustarStock, 
  onCrearProducto,
  onEditarProducto,
  onImportarExcel
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600"></div>
          <div className="text-center sm:text-left">
            <p className="text-gray-600 text-sm sm:text-base">Cargando inventario...</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Espere un momento por favor</p>
          </div>
        </div>
      </div>
    );
  }

  if (!inventario || inventario.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <div className="text-center py-8 sm:py-12">
          <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No hay productos en inventario</h3>
          <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Comienza agregando tu primer producto al inventario para llevar un control de stock.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onCrearProducto}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base font-medium"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Crear Primer Producto</span>
            </button>
            <button
              onClick={onImportarExcel}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base font-medium"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Importar desde Excel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Responsivo Mejorado */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
            Inventario ({inventario.length} {inventario.length === 1 ? 'producto' : 'productos'})
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Gestiona y controla tu stock de productos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
          <button
            onClick={onImportarExcel}
            className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base font-medium shadow-sm order-2 sm:order-1"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Importar Excel</span>
          </button>
          <button
            onClick={onCrearProducto}
            className="px-4 py-2.5 sm:px-5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 w-full xs:w-auto text-sm sm:text-base font-medium shadow-sm order-1 sm:order-2"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Grid Responsivo Mejorado */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {inventario.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 sm:p-4 border-2 ${
              item.stock_bajo 
                ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300' 
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            {/* Header de la Tarjeta - Mejorado Responsivo */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  item.stock_bajo 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight truncate">
                    {item.producto_nombre || 'Sin nombre'}
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm truncate mt-0.5">
                    {item.sku_codigo || 'Sin SKU'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1.5 ml-2">
                {item.stock_bajo && (
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                )}
                {/* Botón de edición mejorado */}
                <button
                  onClick={() => onEditarProducto(item)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  title="Editar producto"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Información del Producto */}
            <div className="space-y-3">
              {/* Categoría y Variaciones - Mejorado */}
              <div className="text-xs sm:text-sm text-gray-600 space-y-1.5">
                {item.categoria && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700 min-w-[70px]">Categoría:</span>
                    <span className="truncate">{item.categoria}</span>
                  </div>
                )}
                {item.variacion && Object.keys(item.variacion).length > 0 && (
                  <div className="flex items-start space-x-2">
                    <span className="font-medium text-gray-700 min-w-[70px] mt-0.5">Variación:</span>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.variacion).map(([tipo, valores]) => (
                        <span key={tipo} className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200">
                          {tipo}: {Array.isArray(valores) ? valores.join(', ') : valores}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid de Stock Mejorado */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500 font-medium text-xs sm:text-sm mb-1">Stock Actual</p>
                  <p className={`font-bold text-sm sm:text-base lg:text-lg ${
                    item.stock_bajo ? 'text-yellow-600' : 'text-gray-900'
                  }`}>
                    {item.stock_actual || 0}
                  </p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500 font-medium text-xs sm:text-sm mb-1">Stock Mínimo</p>
                  <p className="font-bold text-sm sm:text-base lg:text-lg text-gray-900">
                    {item.stock_minimo || 0}
                  </p>
                </div>
              </div>

              {/* Precio y Acciones - Mejorado */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg truncate block">
                    {formatCurrency(item.precio_venta || 0)}
                  </span>
                  <p className="text-gray-400 text-xs mt-0.5">Precio de venta</p>
                </div>
                <div className="flex space-x-1.5 sm:space-x-2 ml-3">
                  <button
                    onClick={() => onAjustarStock(item.id, 'entrada_compra')}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-all duration-200 flex items-center space-x-1 text-xs sm:text-sm font-medium shadow-sm"
                    title="Agregar stock"
                  >
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">Agregar</span>
                  </button>
                  <button
                    onClick={() => onAjustarStock(item.id, 'salida_ajuste')}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-all duration-200 flex items-center space-x-1 text-xs sm:text-sm font-medium shadow-sm"
                    title="Reducir stock"
                  >
                    <Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">Reducir</span>
                  </button>
                </div>
              </div>

              {/* Alerta de Stock Bajo Mejorada */}
              {item.stock_bajo && (
                <div className="mt-2 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 flex items-center space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                  <span className="font-medium">Stock por debajo del mínimo</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer con estadísticas rápidas */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Total: <strong>{inventario.length}</strong> productos</span>
            <span className="text-yellow-600">
              Stock bajo: <strong>{inventario.filter(item => item.stock_bajo).length}</strong>
            </span>
          </div>
          <div className="text-gray-500">
            Última actualización: <span className="font-medium">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};