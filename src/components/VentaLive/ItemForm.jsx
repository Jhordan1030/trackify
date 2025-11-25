import { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, DollarSign, Search, CheckCircle, ChevronDown, X } from 'lucide-react';
import api from '../../services/api';
import { debounce } from '../../utils/helpers';

export const ItemForm = ({ item, index, onChange, onRemove, canRemove }) => {
  const [productos, setProductos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Búsqueda debounced de productos - MEJORADA
  const debouncedSearch = useCallback(
    debounce(async (search) => {
      if (!search.trim()) {
        setProductos([]);
        return;
      }

      setIsSearching(true);
      try {
        console.log('🔍 Buscando productos:', search);
        
        // Parámetros de búsqueda mejorados
        const response = await api.inventario.listarSKUs({
          search: search.trim(),
          limit: 20,
          activo: true // Solo productos activos
        });
        
        console.log('✅ Respuesta completa productos:', response);
        
        // CORRECCIÓN: Extraer el array de productos de response.data
        const productosData = response?.data || [];
        
        // FILTRADO ADICIONAL EN FRONTEND (por si el backend no filtra bien)
        const productosFiltrados = productosData.filter(producto => {
          const termino = search.toLowerCase();
          return (
            producto.producto_nombre?.toLowerCase().includes(termino) ||
            producto.sku_codigo?.toLowerCase().includes(termino) ||
            producto.categoria?.toLowerCase().includes(termino) ||
            formatVariacion(producto.variacion)?.toLowerCase().includes(termino)
          );
        });
        
        console.log('✅ Productos filtrados:', productosFiltrados);
        setProductos(productosFiltrados);
      } catch (error) {
        console.error('❌ Error buscando productos:', error);
        setProductos([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  // Efecto para búsqueda
  useEffect(() => {
    if (showDropdown && searchTerm) {
      debouncedSearch(searchTerm);
    } else if (showDropdown && !searchTerm) {
      setProductos([]);
    }
  }, [searchTerm, showDropdown, debouncedSearch]);

  // Cargar producto seleccionado - CORREGIDO
  useEffect(() => {
    const loadSelectedProduct = async () => {
      if (item.skuId && item.skuId !== '') {
        try {
          console.log('🔄 Cargando producto seleccionado:', item.skuId);
          const response = await api.inventario.obtenerSKU(item.skuId);
          console.log('✅ Respuesta producto seleccionado:', response);
          
          // CORRECCIÓN: Extraer datos de response si es necesario
          const productoData = response?.data || response;
          setSelectedProduct(productoData);
        } catch (error) {
          console.error('Error cargando producto:', error);
          setSelectedProduct(null);
        }
      } else {
        setSelectedProduct(null);
      }
    };

    loadSelectedProduct();
  }, [item.skuId]);

  const handleChange = useCallback((field, value) => {
    onChange(index, field, value);
  }, [index, onChange]);

  const formatVariacion = (variacion) => {
    if (!variacion) return '';
    if (typeof variacion === 'string') return variacion;
    if (typeof variacion === 'object') {
      return Object.entries(variacion)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return String(variacion);
  };

  const getPrecioSeguro = (sku) => {
    const precio = sku.precio_venta || sku.precio_base;
    return parseFloat(precio) || 0;
  };

  const selectProduct = (sku) => {
    const precio = getPrecioSeguro(sku);
    
    handleChange('skuId', sku.id);
    handleChange('precioUnitario', precio);
    
    if (!item.cantidad || item.cantidad < 1) {
      handleChange('cantidad', 1);
    }
    
    setSelectedProduct(sku);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const clearSelection = () => {
    handleChange('skuId', '');
    handleChange('precioUnitario', '');
    setSelectedProduct(null);
    setSearchTerm('');
  };

  const handleDropdownToggle = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);
    if (newState) {
      setSearchTerm('');
      setProductos([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getSelectedProductDisplay = () => {
    if (!selectedProduct) return 'Buscar producto...';
    
    const variacionTexto = formatVariacion(selectedProduct.variacion);
    const baseText = selectedProduct.producto_nombre || 'Producto';
    
    return variacionTexto 
      ? `${baseText} - ${variacionTexto}`
      : baseText;
  };

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
            <button
              type="button"
              onClick={handleDropdownToggle}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className={`truncate ${!selectedProduct ? 'text-gray-500' : 'text-gray-900'}`}>
                {getSelectedProductDisplay()}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                {/* Barra de búsqueda */}
                <div className="p-3 border-b border-gray-200 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Buscar por nombre, SKU, categoría..."
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Busca por nombre, código SKU, categoría o variación
                  </p>
                </div>

                {/* Lista de resultados */}
                <div className="max-h-64 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm text-gray-500">Buscando productos...</p>
                    </div>
                  ) : Array.isArray(productos) && productos.length > 0 ? (
                    <div>
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-xs font-medium text-gray-600">
                          {productos.length} producto(s) encontrado(s) para "{searchTerm}"
                        </p>
                      </div>
                      {productos.map((sku) => {
                        const variacionTexto = formatVariacion(sku.variacion);
                        const precio = getPrecioSeguro(sku);
                        const isSelected = item.skuId === sku.id;
                        const hasStock = sku.stock_disponible > 0;
                        
                        return (
                          <button
                            key={sku.id}
                            type="button"
                            onClick={() => selectProduct(sku)}
                            disabled={!hasStock}
                            className={`w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 transition-colors ${
                              isSelected 
                                ? 'bg-blue-100 border-blue-200' 
                                : hasStock 
                                  ? 'hover:bg-blue-50' 
                                  : 'bg-gray-100 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start space-x-2">
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${
                                      isSelected ? 'text-blue-900' : 'text-gray-900'
                                    }`}>
                                      {sku.producto_nombre || 'Sin nombre'}
                                    </p>
                                    {sku.sku_codigo && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        SKU: {sku.sku_codigo}
                                      </p>
                                    )}
                                    {variacionTexto && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {variacionTexto}
                                      </p>
                                    )}
                                  </div>
                                  {isSelected && (
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    hasStock 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    Stock: {sku.stock_disponible || 0}
                                  </span>
                                  {sku.categoria && (
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                                      {sku.categoria}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-3 flex-shrink-0">
                                <p className="text-sm font-semibold text-gray-900">
                                  ${precio.toFixed(2)}
                                </p>
                                {!hasStock && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Sin stock
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : searchTerm ? (
                    <div className="px-4 py-8 text-center">
                      <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No se encontraron productos para "{searchTerm}"
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Intenta con otros términos de búsqueda
                      </p>
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Escribe en la barra de búsqueda para encontrar productos
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Overlay para cerrar */}
            {showDropdown && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDropdown(false)}
              />
            )}
          </div>

          {/* Información del producto seleccionado */}
          {hasProduct && selectedProduct && (
            <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 mb-1">
                    ✅ Producto seleccionado
                  </p>
                  <p className="text-xs text-green-700">
                    {selectedProduct.producto_nombre || 'Producto sin nombre'}
                    {selectedProduct.variacion && (
                      <span className="text-green-600">
                        {' '}({formatVariacion(selectedProduct.variacion)})
                      </span>
                    )}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-green-600">
                      SKU: {selectedProduct.sku_codigo || 'N/A'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      (selectedProduct.stock_disponible || 0) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Stock: {selectedProduct.stock_disponible || 0}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="ml-2 text-xs text-red-600 hover:text-red-800 whitespace-nowrap border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cantidad y Precio */}
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
        </div>
      </div>

      {/* Subtotal del item */}
      {hasProduct && (
        <div className="mt-3 p-2 bg-white rounded border border-gray-200">
          <p className="text-sm text-gray-600">
            Subtotal del item: <strong className="text-gray-900">
              ${((item.cantidad || 0) * (item.precioUnitario || 0)).toFixed(2)}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
};