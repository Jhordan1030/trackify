import { Package, AlertTriangle, TrendingUp, Archive, Plus, Edit, Upload, Trash2, Box, ShieldAlert, Power, PowerOff, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';

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
    onImportarExcel,
    onDesactivarProducto,
    onReactivarProducto,
    filtroActivo
}) => {
    const [productoAProcesar, setProductoAProcesar] = useState(null);
    const [accion, setAccion] = useState(''); // 'desactivar' o 'reactivar'
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    const handleDesactivarClick = (producto) => {
        setProductoAProcesar(producto);
        setAccion('desactivar');
    };

    const handleReactivarClick = (producto) => {
        setProductoAProcesar(producto);
        setAccion('reactivar');
    };

    const confirmarAccion = () => {
        if (productoAProcesar) {
            if (accion === 'desactivar') {
                onDesactivarProducto(productoAProcesar.producto_id);
            } else if (accion === 'reactivar') {
                onReactivarProducto(productoAProcesar.producto_id);
            }
            setProductoAProcesar(null);
            setAccion('');
        }
    };

    const cancelarAccion = () => {
        setProductoAProcesar(null);
        setAccion('');
    };

    // Función para calcular stock disponible (stock actual - stock reservado)
    const calcularStockDisponible = (item) => {
        const stockActual = item.stock_actual || 0;
        const stockReservado = item.stock_reservado || 0;
        return Math.max(0, stockActual - stockReservado);
    };

    // Filtrar inventario basado en el término de búsqueda
    const inventarioFiltrado = useMemo(() => {
        if (!terminoBusqueda.trim()) {
            return inventario;
        }

        const termino = terminoBusqueda.toLowerCase().trim();
        
        return inventario.filter(item => {
            const nombre = item.producto_nombre?.toLowerCase() || '';
            const sku = item.sku_codigo?.toLowerCase() || '';
            const codigoProducto = item.codigo_producto?.toLowerCase() || '';
            const categoria = item.categoria?.toLowerCase() || '';

            return (
                nombre.includes(termino) ||
                sku.includes(termino) ||
                codigoProducto.includes(termino) ||
                categoria.includes(termino)
            );
        });
    }, [inventario, terminoBusqueda]);

    const limpiarBusqueda = () => {
        setTerminoBusqueda('');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                    <div className="text-center">
                        <p className="text-gray-700 text-sm font-medium">Cargando inventario</p>
                        <p className="text-gray-400 text-xs mt-1">Espere un momento por favor</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!inventario || inventario.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {filtroActivo ? 'No hay productos activos' : 'No hay productos desactivados'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                        {filtroActivo 
                            ? 'Comienza agregando tu primer producto al inventario para llevar un control de stock.'
                            : 'Todos los productos están activos en tu inventario.'}
                    </p>
                    {filtroActivo && (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={onCrearProducto}
                                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Crear Producto</span>
                            </button>
                            <button
                                onClick={onImportarExcel}
                                className="px-4 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Importar Excel</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header con Productos y Búsqueda */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        {filtroActivo ? 'Inventario Activo' : 'Productos Desactivados'} 
                        <span className="text-blue-600"> ({inventarioFiltrado.length})</span>
                        {terminoBusqueda && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                de {inventario.length} totales
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        {filtroActivo 
                            ? 'Productos activos en tu inventario' 
                            : 'Productos desactivados (no visibles en ventas)'}
                    </p>
                </div>

                {/* Barra de Búsqueda */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-initial lg:w-80">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, SKU, código o categoría..."
                                value={terminoBusqueda}
                                onChange={(e) => setTerminoBusqueda(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                            />
                            {terminoBusqueda && (
                                <button
                                    onClick={limpiarBusqueda}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Contenedor de Botones */}
                    <div className="flex sm:flex-row gap-2">
                        <button
                            onClick={onImportarExcel}
                            className="flex-1 sm:flex-none px-3 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-medium"
                        >
                            <Upload className="w-3 h-3" />
                            <span>Importar Excel</span>
                        </button>
                        <button
                            onClick={onCrearProducto}
                            className="flex-1 sm:flex-none px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-medium"
                        >
                            <Plus className="w-3 h-3" />
                            <span>Nuevo Producto</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Indicador de Resultados de Búsqueda */}
            {terminoBusqueda && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm font-medium">
                                Mostrando {inventarioFiltrado.length} de {inventario.length} productos
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-blue-700 text-sm">
                                Búsqueda: "{terminoBusqueda}"
                            </span>
                            <button
                                onClick={limpiarBusqueda}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                            >
                                <X className="w-3 h-3" />
                                <span>Limpiar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {terminoBusqueda && inventarioFiltrado.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        No se encontraron resultados
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
                        No hay productos que coincidan con "<strong>{terminoBusqueda}</strong>"
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                            onClick={limpiarBusqueda}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm font-medium"
                        >
                            Limpiar búsqueda
                        </button>
                        <button
                            onClick={onCrearProducto}
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-sm font-medium"
                        >
                            Crear nuevo producto
                        </button>
                    </div>
                </div>
            )}

            {/* Grid de Productos - RESPONSIVE CON 4 COLUMNAS EN XL */}
            {(!terminoBusqueda || inventarioFiltrado.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {inventarioFiltrado.map((item) => {
                        const stockDisponible = calcularStockDisponible(item);
                        const stockReservado = item.stock_reservado || 0;
                        const stockActual = item.stock_actual || 0;
                        const stockMinimo = item.stock_minimo || 0;
                        
                        // Determinar si hay alerta de stock
                        const tieneAlertaStock = stockDisponible <= stockMinimo;
                        const sinStockDisponible = stockDisponible === 0;

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border ${
                                    !item.activo 
                                        ? 'border-gray-300 bg-gray-50' 
                                        : tieneAlertaStock 
                                            ? 'border-orange-200 bg-orange-50' 
                                            : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                {/* Header de la Tarjeta */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                                            !item.activo 
                                                ? 'bg-gray-300 text-gray-600' 
                                                : tieneAlertaStock 
                                                    ? 'bg-orange-100 text-orange-600' 
                                                    : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">
                                                {item.producto_nombre || 'Sin nombre'}
                                            </h4>
                                            <p className="text-gray-400 text-xs font-medium truncate mt-0.5">
                                                {item.sku_codigo || 'Sin SKU'}
                                            </p>
                                            {!item.activo && (
                                                <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold mt-1">
                                                    DESACTIVADO
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1 ml-2">
                                        {tieneAlertaStock && item.activo && (
                                            <div className="bg-orange-100 text-orange-600 p-1 rounded">
                                                <AlertTriangle className="w-3 h-3" />
                                            </div>
                                        )}
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => onEditarProducto(item)}
                                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                                                title="Editar producto"
                                            >
                                                <Edit className="w-3 h-3" />
                                            </button>
                                            {item.activo ? (
                                                <button
                                                    onClick={() => handleDesactivarClick(item)}
                                                    className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-all duration-200"
                                                    title="Desactivar producto"
                                                >
                                                    <PowerOff className="w-3 h-3" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleReactivarClick(item)}
                                                    className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200"
                                                    title="Reactivar producto"
                                                >
                                                    <Power className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Producto */}
                                <div className="space-y-3">
                                    {/* Categoría y Variaciones */}
                                    <div className="text-xs text-gray-600 space-y-1">
                                        {item.categoria && (
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-gray-700 text-xs">Categoría:</span>
                                                <span className="truncate bg-gray-100 px-2 py-1 rounded text-xs">{item.categoria}</span>
                                            </div>
                                        )}
                                        {item.variacion && Object.keys(item.variacion).length > 0 && (
                                            <div className="flex items-start space-x-2">
                                                <span className="font-semibold text-gray-700 text-xs mt-0.5">Variación:</span>
                                                <div className="flex flex-wrap gap-1 flex-1">
                                                    {Object.entries(item.variacion).map(([tipo, valores]) => (
                                                        <span key={tipo} className="inline-block bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-medium border border-blue-200">
                                                            {tipo}: {Array.isArray(valores) ? valores.slice(0, 2).join(', ') : valores}
                                                            {Array.isArray(valores) && valores.length > 2 && '...'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grid de Stock */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Stock Disponible */}
                                        <div className={`text-center p-2 rounded-lg border ${
                                            !item.activo
                                                ? 'bg-gray-200 border-gray-300'
                                                : sinStockDisponible 
                                                    ? 'bg-red-50 border-red-200' 
                                                    : tieneAlertaStock 
                                                        ? 'bg-orange-50 border-orange-200' 
                                                        : 'bg-green-50 border-green-200'
                                        }`}>
                                            <div className="flex items-center justify-center space-x-1 mb-1">
                                                <Box className={`w-3 h-3 ${
                                                    !item.activo
                                                        ? 'text-gray-500'
                                                        : sinStockDisponible 
                                                            ? 'text-red-600' 
                                                            : tieneAlertaStock 
                                                                ? 'text-orange-600' 
                                                                : 'text-green-600'
                                                }`} />
                                                <p className="font-semibold text-xs text-gray-500">DISP.</p>
                                            </div>
                                            <p className={`font-bold text-sm ${
                                                !item.activo
                                                    ? 'text-gray-600'
                                                    : sinStockDisponible 
                                                        ? 'text-red-600' 
                                                        : tieneAlertaStock 
                                                            ? 'text-orange-600' 
                                                            : 'text-green-600'
                                            }`}>
                                                {stockDisponible}
                                            </p>
                                        </div>

                                        {/* Stock Reservado */}
                                        <div className={`text-center p-2 rounded-lg border ${
                                            !item.activo
                                                ? 'bg-gray-200 border-gray-300'
                                                : 'bg-blue-50 border-blue-200'
                                        }`}>
                                            <div className="flex items-center justify-center space-x-1 mb-1">
                                                <ShieldAlert className={`w-3 h-3 ${!item.activo ? 'text-gray-500' : 'text-blue-600'}`} />
                                                <p className="font-semibold text-xs text-gray-500">RES.</p>
                                            </div>
                                            <p className={`font-bold text-sm ${!item.activo ? 'text-gray-600' : 'text-blue-600'}`}>
                                                {stockReservado}
                                            </p>
                                        </div>

                                        {/* Stock Mínimo */}
                                        <div className={`text-center p-2 rounded-lg border ${
                                            !item.activo
                                                ? 'bg-gray-200 border-gray-300'
                                                : 'bg-purple-50 border-purple-200'
                                        }`}>
                                            <div className="flex items-center justify-center space-x-1 mb-1">
                                                <AlertTriangle className={`w-3 h-3 ${!item.activo ? 'text-gray-500' : 'text-purple-600'}`} />
                                                <p className="font-semibold text-xs text-gray-500">MÍN.</p>
                                            </div>
                                            <p className={`font-bold text-sm ${!item.activo ? 'text-gray-600' : 'text-purple-600'}`}>
                                                {stockMinimo}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Información adicional de stock */}
                                    <div className="bg-gray-50 rounded p-2 border border-gray-200">
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div className="text-center">
                                                <span className="font-semibold">Total:</span>
                                                <p className={`font-bold ${!item.activo ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {stockActual}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <span className="font-semibold">Pedidos:</span>
                                                <p className={`font-bold ${!item.activo ? 'text-gray-600' : 'text-blue-600'}`}>
                                                    {stockReservado}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Precio y Acciones */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                        <div className="flex-1 min-w-0">
                                            <span className={`font-bold text-base truncate block ${!item.activo ? 'text-gray-500' : 'text-gray-900'}`}>
                                                {formatCurrency(item.precio_venta || 0)}
                                            </span>
                                            <p className="text-xs mt-0.5 text-gray-400">Precio de venta</p>
                                        </div>
                                        <div className="flex space-x-1 ml-2">
                                            {item.activo && (
                                                <>
                                                    <button
                                                        onClick={() => onAjustarStock(item.id, 'entrada_compra')}
                                                        className="px-2 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 flex items-center space-x-1 text-xs font-medium"
                                                        title="Agregar stock"
                                                    >
                                                        <TrendingUp className="w-3 h-3" />
                                                        <span className="hidden xs:inline">Agregar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => onAjustarStock(item.id, 'salida_ajuste')}
                                                        className="px-2 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 flex items-center space-x-1 text-xs font-medium"
                                                        title="Reducir stock"
                                                    >
                                                        <Archive className="w-3 h-3" />
                                                        <span className="hidden xs:inline">Reducir</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Alertas de Stock - Solo para productos activos */}
                                    {item.activo && (
                                        <>
                                            {sinStockDisponible && (
                                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center space-x-2">
                                                    <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0" />
                                                    <span className="font-semibold">¡Sin stock disponible!</span>
                                                </div>
                                            )}

                                            {tieneAlertaStock && stockDisponible > 0 && (
                                                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-800 flex items-center space-x-2">
                                                    <AlertTriangle className="w-3 h-3 text-orange-600 flex-shrink-0" />
                                                    <span className="font-semibold">Stock bajo mínimo</span>
                                                </div>
                                            )}

                                            {stockReservado > 0 && (
                                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center space-x-2">
                                                    <ShieldAlert className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                                    <span className="font-semibold">{stockReservado} en pedidos</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Confirmación */}
            {productoAProcesar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-sm w-full p-4 mx-auto shadow-xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className={`p-2 rounded-lg ${
                                accion === 'desactivar' ? 'bg-orange-100' : 'bg-green-100'
                            }`}>
                                {accion === 'desactivar' ? (
                                    <PowerOff className="w-5 h-5 text-orange-600" />
                                ) : (
                                    <Power className="w-5 h-5 text-green-600" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    {accion === 'desactivar' ? 'Desactivar Producto' : 'Reactivar Producto'}
                                </h3>
                                <p className="text-gray-600 text-xs mt-1">
                                    {accion === 'desactivar' 
                                        ? 'El producto dejará de estar disponible para ventas' 
                                        : 'El producto volverá a estar disponible para ventas'}
                                </p>
                            </div>
                        </div>

                        <div className={`border rounded-lg p-3 mb-4 ${
                            accion === 'desactivar' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
                        }`}>
                            <p className={`text-sm font-semibold ${
                                accion === 'desactivar' ? 'text-orange-800' : 'text-green-800'
                            }`}>
                                {accion === 'desactivar' 
                                    ? '¿Estás seguro de que quieres desactivar este producto?'
                                    : '¿Estás seguro de que quieres reactivar este producto?'}
                            </p>
                            <p className={`text-xs mt-2 ${
                                accion === 'desactivar' ? 'text-orange-700' : 'text-green-700'
                            }`}>
                                <strong>Producto:</strong> {productoAProcesar.producto_nombre}
                            </p>
                            <p className={`text-xs ${
                                accion === 'desactivar' ? 'text-orange-700' : 'text-green-700'
                            }`}>
                                <strong>SKU:</strong> {productoAProcesar.sku_codigo}
                            </p>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={confirmarAccion}
                                className={`px-4 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 text-sm font-semibold ${
                                    accion === 'desactivar' 
                                        ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500' 
                                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                }`}
                            >
                                {accion === 'desactivar' ? 'Sí, Desactivar' : 'Sí, Reactivar'}
                            </button>
                            <button
                                onClick={cancelarAccion}
                                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-sm font-semibold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer con estadísticas */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-600">
                            {terminoBusqueda ? 'Resultados:' : 'Total:'} 
                            <strong className="text-gray-900"> {inventarioFiltrado.length}</strong> 
                            {terminoBusqueda && (
                                <span className="text-gray-500"> de {inventario.length}</span>
                            )}
                        </span>
                        {filtroActivo && (
                            <>
                                <span className="text-orange-600">
                                    Bajo: <strong>{inventarioFiltrado.filter(item => calcularStockDisponible(item) <= (item.stock_minimo || 0)).length}</strong>
                                </span>
                                <span className="text-red-600">
                                    Sin: <strong>{inventarioFiltrado.filter(item => calcularStockDisponible(item) === 0).length}</strong>
                                </span>
                            </>
                        )}
                    </div>
                    <div className="text-gray-500">
                        Estado: <span className={`font-semibold ${filtroActivo ? 'text-green-600' : 'text-orange-600'}`}>
                            {filtroActivo ? '🟢 Activos' : '🔴 Desactivados'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};