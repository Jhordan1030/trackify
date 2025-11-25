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
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
                    <div className="text-center">
                        <p className="text-gray-700 text-base sm:text-lg font-medium">Cargando inventario</p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Espere un momento por favor</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!inventario || inventario.length === 0) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
                <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                        {filtroActivo ? 'No hay productos activos' : 'No hay productos desactivados'}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
                        {filtroActivo 
                            ? 'Comienza agregando tu primer producto al inventario para llevar un control de stock.'
                            : 'Todos los productos están activos en tu inventario.'}
                    </p>
                    {filtroActivo && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button
                                onClick={onCrearProducto}
                                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base font-semibold shadow-lg shadow-blue-500/25"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Crear Producto</span>
                            </button>
                            <button
                                onClick={onImportarExcel}
                                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base font-semibold shadow-sm"
                            >
                                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Importar Excel</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header con Productos y Búsqueda */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
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
                <div className="flex flex-col xs:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-initial lg:w-80">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, SKU, código o categoría..."
                                value={terminoBusqueda}
                                onChange={(e) => setTerminoBusqueda(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-300 bg-white"
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
                    <div className="flex flex-col xs:flex-row gap-2">
                        <button
                            onClick={onImportarExcel}
                            className="px-3 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-medium shadow-sm order-2 xs:order-1 w-full xs:w-auto"
                        >
                            <Upload className="w-3 h-3" />
                            <span>Importar Excel</span>
                        </button>
                        <button
                            onClick={onCrearProducto}
                            className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 flex items-center justify-center space-x-2 text-xs font-medium shadow-lg shadow-blue-500/25 order-1 xs:order-2 w-full xs:w-auto"
                        >
                            <Plus className="w-3 h-3" />
                            <span>Nuevo Producto</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Indicador de Resultados de Búsqueda */}
            {terminoBusqueda && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
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
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        No se encontraron resultados
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base mb-4 max-w-md mx-auto">
                        No hay productos que coincidan con "<strong>{terminoBusqueda}</strong>"
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                            onClick={limpiarBusqueda}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm font-medium"
                        >
                            Limpiar búsqueda
                        </button>
                        <button
                            onClick={onCrearProducto}
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-300 text-sm font-medium"
                        >
                            Crear nuevo producto
                        </button>
                    </div>
                </div>
            )}

            {/* Grid de Productos (solo mostrar si hay resultados) */}
            {(!terminoBusqueda || inventarioFiltrado.length > 0) && (
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
                                className={`bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-4 md:p-6 border-2 ${
                                    !item.activo 
                                        ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-gray-400' 
                                        : tieneAlertaStock 
                                            ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-300' 
                                            : 'border-gray-100 hover:border-blue-200'
                                }`}
                            >
                                {/* Header de la Tarjeta */}
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${
                                            !item.activo 
                                                ? 'bg-gray-300 text-gray-600' 
                                                : tieneAlertaStock 
                                                    ? 'bg-orange-100 text-orange-600' 
                                                    : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg leading-tight truncate">
                                                {item.producto_nombre || 'Sin nombre'}
                                            </h4>
                                            <p className="text-gray-400 text-xs sm:text-sm font-medium truncate mt-0.5 sm:mt-1">
                                                {item.sku_codigo || 'Sin SKU'}
                                            </p>
                                            {!item.activo && (
                                                <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold mt-1">
                                                    🔴 DESACTIVADO
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1.5 sm:space-y-2 ml-2 sm:ml-3">
                                        {tieneAlertaStock && item.activo && (
                                            <div className="bg-orange-100 text-orange-600 p-1 sm:p-1.5 rounded-lg">
                                                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </div>
                                        )}
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => onEditarProducto(item)}
                                                className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                title="Editar producto"
                                            >
                                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                            {item.activo ? (
                                                <button
                                                    onClick={() => handleDesactivarClick(item)}
                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                                    title="Desactivar producto"
                                                >
                                                    <PowerOff className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleReactivarClick(item)}
                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                                    title="Reactivar producto"
                                                >
                                                    <Power className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Producto */}
                                <div className="space-y-3 sm:space-y-4">
                                    {/* Categoría y Variaciones */}
                                    <div className="text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2">
                                        {item.categoria && (
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-gray-700 min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm">Categoría:</span>
                                                <span className="truncate bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm">{item.categoria}</span>
                                            </div>
                                        )}
                                        {item.variacion && Object.keys(item.variacion).length > 0 && (
                                            <div className="flex items-start space-x-2">
                                                <span className="font-semibold text-gray-700 min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm mt-0.5 sm:mt-1">Variación:</span>
                                                <div className="flex flex-wrap gap-1 flex-1">
                                                    {Object.entries(item.variacion).map(([tipo, valores]) => (
                                                        <span key={tipo} className="inline-block bg-blue-50 text-blue-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium border border-blue-200">
                                                            {tipo}: {Array.isArray(valores) ? valores.slice(0, 2).join(', ') : valores}
                                                            {Array.isArray(valores) && valores.length > 2 && '...'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grid de Stock MEJORADO - 3 columnas */}
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                        {/* Stock Disponible */}
                                        <div className={`text-center p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 ${
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
                                                <p className={`font-semibold text-xs ${
                                                    !item.activo ? 'text-gray-500' : 'text-gray-500'
                                                }`}>DISPONIBLE</p>
                                            </div>
                                            <p className={`font-bold text-base sm:text-lg ${
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
                                        <div className={`text-center p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 ${
                                            !item.activo
                                                ? 'bg-gray-200 border-gray-300'
                                                : 'bg-blue-50 border-blue-200'
                                        }`}>
                                            <div className="flex items-center justify-center space-x-1 mb-1">
                                                <ShieldAlert className={`w-3 h-3 ${
                                                    !item.activo ? 'text-gray-500' : 'text-blue-600'
                                                }`} />
                                                <p className={`font-semibold text-xs ${
                                                    !item.activo ? 'text-gray-500' : 'text-gray-500'
                                                }`}>RESERVADO</p>
                                            </div>
                                            <p className={`font-bold text-base sm:text-lg ${
                                                !item.activo ? 'text-gray-600' : 'text-blue-600'
                                            }`}>
                                                {stockReservado}
                                            </p>
                                        </div>

                                        {/* Stock Mínimo */}
                                        <div className={`text-center p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 ${
                                            !item.activo
                                                ? 'bg-gray-200 border-gray-300'
                                                : 'bg-purple-50 border-purple-200'
                                        }`}>
                                            <div className="flex items-center justify-center space-x-1 mb-1">
                                                <AlertTriangle className={`w-3 h-3 ${
                                                    !item.activo ? 'text-gray-500' : 'text-purple-600'
                                                }`} />
                                                <p className={`font-semibold text-xs ${
                                                    !item.activo ? 'text-gray-500' : 'text-gray-500'
                                                }`}>MÍNIMO</p>
                                            </div>
                                            <p className={`font-bold text-base sm:text-lg ${
                                                !item.activo ? 'text-gray-600' : 'text-purple-600'
                                            }`}>
                                                {stockMinimo}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Información adicional de stock */}
                                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div className="text-center">
                                                <span className="font-semibold">Stock Total:</span>
                                                <p className={`font-bold ${!item.activo ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {stockActual}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <span className="font-semibold">En Pedidos:</span>
                                                <p className={`font-bold ${!item.activo ? 'text-gray-600' : 'text-blue-600'}`}>
                                                    {stockReservado}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Precio y Acciones */}
                                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                                        <div className="flex-1 min-w-0">
                                            <span className={`font-bold text-base sm:text-lg md:text-xl truncate block ${
                                                !item.activo ? 'text-gray-500' : 'text-gray-900'
                                            }`}>
                                                {formatCurrency(item.precio_venta || 0)}
                                            </span>
                                            <p className={`text-xs mt-0.5 sm:mt-1 ${
                                                !item.activo ? 'text-gray-400' : 'text-gray-400'
                                            }`}>Precio de venta</p>
                                        </div>
                                        <div className="flex space-x-1.5 sm:space-x-2 ml-2 sm:ml-4">
                                            {item.activo && (
                                                <>
                                                    <button
                                                        onClick={() => onAjustarStock(item.id, 'entrada_compra')}
                                                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-semibold shadow-lg shadow-green-500/25"
                                                        title="Agregar stock"
                                                    >
                                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="hidden xs:inline">Agregar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => onAjustarStock(item.id, 'salida_ajuste')}
                                                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg sm:rounded-xl hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-semibold shadow-lg shadow-gray-500/25"
                                                        title="Reducir stock"
                                                    >
                                                        <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
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
                                                <div className="mt-2 p-2 sm:p-3 bg-gradient-to-r from-red-50 to-rose-100 border border-red-200 rounded-lg sm:rounded-xl text-xs sm:text-sm text-red-800 flex items-center space-x-2 sm:space-x-3">
                                                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                                                    <span className="font-semibold">¡Sin stock disponible!</span>
                                                </div>
                                            )}

                                            {tieneAlertaStock && stockDisponible > 0 && (
                                                <div className="mt-2 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-amber-100 border border-orange-200 rounded-lg sm:rounded-xl text-xs sm:text-sm text-orange-800 flex items-center space-x-2 sm:space-x-3">
                                                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                                                    <span className="font-semibold">Stock por debajo del mínimo</span>
                                                </div>
                                            )}

                                            {stockReservado > 0 && (
                                                <div className="mt-2 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-sky-100 border border-blue-200 rounded-lg sm:rounded-xl text-xs sm:text-sm text-blue-800 flex items-center space-x-2 sm:space-x-3">
                                                    <ShieldAlert className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                                                    <span className="font-semibold">{stockReservado} unidades reservadas en pedidos</span>
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

            {/* Modal de Confirmación de Desactivación/Reactivación */}
            {productoAProcesar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 mx-auto shadow-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className={`p-2 rounded-lg ${
                                accion === 'desactivar' ? 'bg-orange-100' : 'bg-green-100'
                            }`}>
                                {accion === 'desactivar' ? (
                                    <PowerOff className="w-6 h-6 text-orange-600" />
                                ) : (
                                    <Power className="w-6 h-6 text-green-600" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                    {accion === 'desactivar' ? 'Desactivar Producto' : 'Reactivar Producto'}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {accion === 'desactivar' 
                                        ? 'El producto dejará de estar disponible para ventas' 
                                        : 'El producto volverá a estar disponible para ventas'}
                                </p>
                            </div>
                        </div>

                        <div className={`border rounded-lg p-4 mb-6 ${
                            accion === 'desactivar' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
                        }`}>
                            <p className={`text-sm font-semibold ${
                                accion === 'desactivar' ? 'text-orange-800' : 'text-green-800'
                            }`}>
                                {accion === 'desactivar' 
                                    ? '¿Estás seguro de que quieres desactivar este producto?'
                                    : '¿Estás seguro de que quieres reactivar este producto?'}
                            </p>
                            <p className={`text-sm mt-2 ${
                                accion === 'desactivar' ? 'text-orange-700' : 'text-green-700'
                            }`}>
                                <strong>Producto:</strong> {productoAProcesar.producto_nombre}
                            </p>
                            <p className={`text-sm ${
                                accion === 'desactivar' ? 'text-orange-700' : 'text-green-700'
                            }`}>
                                <strong>SKU:</strong> {productoAProcesar.sku_codigo}
                            </p>
                            {accion === 'desactivar' && (
                                <p className="text-orange-600 text-xs mt-2">
                                    El producto no aparecerá en las listas de ventas, pero mantendrá su historial.
                                </p>
                            )}
                            {accion === 'reactivar' && (
                                <p className="text-green-600 text-xs mt-2">
                                    El producto volverá a estar disponible para ventas y ajustes de stock.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={cancelarAccion}
                                className="px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarAccion}
                                className={`px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base font-semibold shadow-lg ${
                                    accion === 'desactivar' 
                                        ? 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:ring-orange-500/20 shadow-orange-500/25'
                                        : 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500/20 shadow-green-500/25'
                                }`}
                            >
                                {accion === 'desactivar' ? 'Sí, Desactivar' : 'Sí, Reactivar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer con estadísticas */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6">
                        <span className="text-gray-600">
                            {terminoBusqueda ? 'Resultados:' : 'Total:'} 
                            <strong className="text-gray-900"> {inventarioFiltrado.length}</strong> 
                            {terminoBusqueda && (
                                <span className="text-gray-500"> de {inventario.length}</span>
                            )} productos
                        </span>
                        {filtroActivo && (
                            <>
                                <span className="text-orange-600">
                                    Stock bajo: <strong>{inventarioFiltrado.filter(item => calcularStockDisponible(item) <= (item.stock_minimo || 0)).length}</strong>
                                </span>
                                <span className="text-red-600">
                                    Sin stock: <strong>{inventarioFiltrado.filter(item => calcularStockDisponible(item) === 0).length}</strong>
                                </span>
                            </>
                        )}
                    </div>
                    <div className="text-gray-500 mt-2 xs:mt-0">
                        Estado: <span className={`font-semibold ${filtroActivo ? 'text-green-600' : 'text-orange-600'}`}>
                            {filtroActivo ? '🟢 Activos' : '🔴 Desactivados'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};