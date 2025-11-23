import { useState, useEffect } from 'react';
import { Plus, Minus, DollarSign, Search, CheckCircle, ChevronDown } from 'lucide-react';
import api from '../../services/api';

export const ItemForm = ({ item, index, onChange, onRemove, canRemove }) => {
  const [productos, setProductos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  // Función para formatear la variación
  const formatVariacion = (variacion) => {
    if (!variacion) return '';
    
    if (typeof variacion === 'string') {
      return variacion;
    }
    
    if (typeof variacion === 'object') {
      return Object.entries(variacion)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    
    return String(variacion);
  };

  // Función para obtener el precio seguro
  const getPrecioSeguro = (sku) => {
    const precio = sku.precio_venta || sku.precio_base;
    const precioNumero = parseFloat(precio);
    return isNaN(precioNumero) ? 0 : precioNumero;
  };

  // Cargar productos al abrir el dropdown
  const loadProductos = async (search = '') => {
    if (search.length < 2 && search !== '') return;
    
    setIsSearching(true);
    try {
      const response = await api.inventario.listarSKUs({ 
        search: search,
        limit: 20 
      });
      setProductos(response.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProductos([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Cargar productos cuando se abre el dropdown
  useEffect(() => {
    if (showDropdown) {
      loadProductos('');
    }
  }, [showDropdown]);

  // Buscar productos cuando cambia el término
  useEffect(() => {
    if (showDropdown) {
      const timeoutId = setTimeout(() => {
        loadProductos(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, showDropdown]);

  const selectProduct = (sku) => {
    const precio = getPrecioSeguro(sku);
    
    handleChange('skuId', sku.id);
    handleChange('precioUnitario', precio);
    
    if (!item.cantidad || item.cantidad < 1) {
      handleChange('cantidad', 1);
    }
    
    setShowDropdown(false);
    setSearchTerm('');
  };

  const getSelectedProductDisplay = () => {
    if (!item.skuId) return 'Seleccionar producto...';
    
    const selected = productos.find(p => p.id === item.skuId);
    if (!selected) return 'Cargando...';
    
    const variacionTexto = formatVariacion(selected.variacion);
    return variacionTexto 
      ? `${selected.producto_nombre} - ${variacionTexto}`
      : selected.producto_nombre;
  };

  const clearSelection = () => {
    handleChange('skuId', '');
    handleChange('precioUnitario', '');
    setSearchTerm('');
  };

  // Verificar si el item está completo
  const isItemComplete = item.skuId && item.cantidad > 0 && item.precioUnitario > 0;
  const hasProduct = !!item.skuId;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Item #{index + 1}</h4>
        <div className="flex items-center space-x-2">
          {isItemComplete && (
            <span className="flex items-center space-x-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              <CheckCircle className="w-3 h-3" />
              <span>Completo</span>
            </span>
          )}
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Select de Producto con Búsqueda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Producto *
          </label>
          <div className="relative">
            {/* Botón que simula el select */}
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
            >
              <span className={`truncate ${!item.skuId ? 'text-gray-500' : 'text-gray-900'}`}>
                {getSelectedProductDisplay()}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                {/* Barra de búsqueda */}
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Buscar productos..."
                      autoFocus
                    />
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="max-h-48 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : productos.length > 0 ? (
                    productos.map((sku) => {
                      const variacionTexto = formatVariacion(sku.variacion);
                      const precio = getPrecioSeguro(sku);
                      const isSelected = item.skuId === sku.id;
                      
                      return (
                        <button
                          key={sku.id}
                          type="button"
                          onClick={() => selectProduct(sku)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                            isSelected ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${
                                isSelected ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {sku.producto_nombre}
                                {isSelected && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Seleccionado
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                SKU: {sku.sku_codigo} | Código: {sku.codigo_producto}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  sku.stock_disponible > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  Stock: {sku.stock_disponible}
                                </span>
                                {variacionTexto && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                                    {variacionTexto}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                ${precio.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-center">
                      <p className="text-sm text-gray-500">
                        {searchTerm ? 'No se encontraron productos' : 'Escribe para buscar productos'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Overlay para cerrar el dropdown */}
            {showDropdown && (
              <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowDropdown(false)}
              />
            )}
          </div>

          {/* Información del producto seleccionado */}
          {hasProduct && (
            <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Producto seleccionado
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-green-700">
                      {getSelectedProductDisplay()}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="ml-2 text-xs text-red-600 hover:text-red-800 whitespace-nowrap"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}

          {/* Mensaje de ayuda */}
          {!hasProduct && (
            <p className="text-xs text-gray-500 mt-1">
              Haz clic para seleccionar un producto
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad *
          </label>
          <input
            type="number"
            value={item.cantidad || ''}
            onChange={(e) => handleChange('cantidad', Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="1"
            min="1"
            required
          />
          {(!item.cantidad || item.cantidad < 1) && (
            <p className="text-xs text-red-500 mt-1">La cantidad es requerida</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Unitario *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={item.precioUnitario || ''}
              onChange={(e) => handleChange('precioUnitario', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              required
            />
          </div>
          {(!item.precioUnitario || item.precioUnitario <= 0) && (
            <p className="text-xs text-red-500 mt-1">El precio es requerido</p>
          )}
        </div>
      </div>

      {isItemComplete && (
        <div className="mt-3 p-2 bg-white rounded border border-gray-200">
          <p className="text-sm text-gray-600">
            Subtotal: <strong className="text-gray-900">${(item.cantidad * item.precioUnitario).toFixed(2)}</strong>
          </p>
        </div>
      )}

      {/* Indicador de campos faltantes */}
      {!isItemComplete && hasProduct && (
        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-xs text-yellow-700">
            ⚠️ Complete los campos: {[
              !item.cantidad && 'Cantidad', 
              (!item.precioUnitario || item.precioUnitario <= 0) && 'Precio'
            ].filter(Boolean).join(', ')}
          </p>
        </div>
      )}

      {/* Indicador de producto faltante */}
      {!hasProduct && (
        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-xs text-yellow-700">
            ⚠️ Selecciona un producto para continuar
          </p>
        </div>
      )}
    </div>
  );
};