import { useState, useEffect } from 'react';
import { InventarioList } from '../components/Inventario/InventarioList';
import { StockAlerts } from '../components/Inventario/StockAlerts';
import CrearProductoModal from '../components/Inventario/CrearProductoModal';
import EditarProductoModal from '../components/Inventario/EditarProductoModal';
import ImportarExcelModal from '../components/Inventario/ImportarExcelModal';
import api from '../services/api';

const Inventario = () => {
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAjusteModal, setShowAjusteModal] = useState(false);
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showImportarModal, setShowImportarModal] = useState(false);
    const [skuSeleccionado, setSkuSeleccionado] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [tipoAjuste, setTipoAjuste] = useState('');
    const [cantidadAjuste, setCantidadAjuste] = useState(1);
    const [motivoAjuste, setMotivoAjuste] = useState('');
    const [filtroActivo, setFiltroActivo] = useState(true); // Nuevo estado para el filtro

    useEffect(() => {
        cargarInventario();
    }, []);

    const cargarInventario = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.inventario.listarSKUs();
            const datos = response.data || [];
            
            setInventario(Array.isArray(datos) ? datos : []);
        } catch (err) {
            setError(err.message || 'Error al cargar inventario');
            setInventario([]);
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN PARA DESACTIVAR PRODUCTO
    const ejecutarDesactivarProducto = async (productoId) => {
        try {
            setLoading(true);
            setError(null);
            
            await api.inventario.desactivarProducto(productoId);
            
            mostrarAlerta('success', '✅ Producto desactivado correctamente');
            
            await cargarInventario();
        } catch (err) {
            setError(err.message || 'Error al desactivar producto');
            
            let mensajeError = 'Error al desactivar producto: ' + err.message;
            
            if (err.message.includes('500')) {
                mensajeError = '❌ Error del servidor (500). No se pudo desactivar el producto.';
            } else if (err.message.includes('404')) {
                mensajeError = '❌ Producto no encontrado.';
            }
            
            mostrarAlerta('error', mensajeError);
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN PARA REACTIVAR PRODUCTO
    const ejecutarReactivarProducto = async (productoId) => {
        try {
            setLoading(true);
            setError(null);
            
            await api.inventario.reactivarProducto(productoId);
            
            mostrarAlerta('success', '✅ Producto reactivado correctamente');
            
            await cargarInventario();
        } catch (err) {
            setError(err.message || 'Error al reactivar producto');
            
            let mensajeError = 'Error al reactivar producto: ' + err.message;
            
            if (err.message.includes('500')) {
                mensajeError = '❌ Error del servidor (500). No se pudo reactivar el producto.';
            } else if (err.message.includes('404')) {
                mensajeError = '❌ Producto no encontrado.';
            }
            
            mostrarAlerta('error', mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const handleAjustarStock = async (skuId, tipo) => {
        setSkuSeleccionado(skuId);
        setTipoAjuste(tipo);
        setCantidadAjuste(1);
        setMotivoAjuste('');
        setShowAjusteModal(true);
    };

    const handleCrearProducto = () => {
        setShowCrearModal(true);
    };

    const handleEditarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setShowEditarModal(true);
    };

    const handleImportarExcel = () => {
        setShowImportarModal(true);
    };

    const ejecutarCrearProducto = async (productoData) => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            try {
                response = await api.inventario.crearProductoDebug(productoData);
            } catch (debugError) {
                response = await api.inventario.crearProducto(productoData);
            }
            
            mostrarAlerta('success', '✅ Producto creado correctamente');
            
            await cargarInventario();
            setShowCrearModal(false);
        } catch (err) {
            setError(err.message || 'Error al crear producto');
            
            let mensajeError = 'Error al crear producto: ' + err.message;
            
            if (err.message.includes('500')) {
                mensajeError = '❌ Error del servidor (500). El backend no pudo procesar la solicitud.';
            } else if (err.message.includes('El código de producto ya existe')) {
                mensajeError = '❌ El código de producto ya existe. Usa un código diferente.';
            } else if (err.message.includes('categoriaId')) {
                mensajeError = '❌ Error: categoriaId es requerido.';
            }
            
            mostrarAlerta('error', mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const ejecutarEditarProducto = async (productoData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.inventario.actualizarProducto(
                productoData.productoId, 
                productoData
            );
            
            mostrarAlerta('success', '✅ Producto actualizado correctamente');
            
            await cargarInventario();
            setShowEditarModal(false);
            setProductoSeleccionado(null);
        } catch (err) {
            let mensajeError = 'Error al actualizar producto: ' + err.message;
            
            if (err.message.includes('500')) {
                mensajeError = '❌ Error del servidor (500). No se pudo actualizar el producto.';
            } else if (err.message.includes('404')) {
                mensajeError = '❌ Producto no encontrado.';
            } else if (err.message.includes('409')) {
                mensajeError = '❌ El código de producto ya existe. Usa un código diferente.';
            }
            
            mostrarAlerta('error', mensajeError);
            setError(err.message || 'Error al actualizar producto');
        } finally {
            setLoading(false);
        }
    };

    const ejecutarImportarProductos = async (productosData) => {
        try {
            setLoading(true);
            setError(null);
            
            const resultados = [];
            const errores = [];
            
            for (let i = 0; i < productosData.length; i++) {
                const productoData = productosData[i];
                
                try {
                    const response = await api.inventario.crearProducto(productoData);
                    
                    resultados.push({
                        producto: productoData.codigoProducto,
                        exito: true,
                        data: response
                    });
                    
                } catch (error) {
                    let mensajeError = error.message;
                    
                    // Detectar tipo específico de error
                    if (error.message.includes('409') || error.message.includes('código de producto ya existe')) {
                        mensajeError = `El código "${productoData.codigoProducto}" ya existe en el sistema`;
                    } else if (error.message.includes('categoriaId')) {
                        mensajeError = `Categoría inválida para "${productoData.codigoProducto}"`;
                    } else if (error.message.includes('400')) {
                        mensajeError = `Datos inválidos para "${productoData.codigoProducto}"`;
                    }
                    
                    errores.push({
                        producto: productoData.codigoProducto,
                        nombre: productoData.nombre,
                        error: mensajeError,
                        datos: productoData
                    });
                }
                
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // Devolver resultados detallados
            return {
                exitosos: resultados.length,
                errores: errores.length,
                detalles: {
                    resultados,
                    errores
                }
            };
            
        } catch (err) {
            throw new Error('Error durante la importación: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const ejecutarAjuste = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const datosAjuste = {
                cantidad: parseInt(cantidadAjuste),
                tipoMovimiento: tipoAjuste,
                motivo: motivoAjuste || 'Ajuste manual'
            };

            await api.inventario.ajustarStock(skuSeleccionado, datosAjuste);
            
            mostrarAlerta('success', '✅ Stock ajustado correctamente');
            
            await cargarInventario();
            setShowAjusteModal(false);
            setSkuSeleccionado(null);
            setTipoAjuste('');
            setCantidadAjuste(1);
            setMotivoAjuste('');
        } catch (err) {
            setError(err.message || 'Error al ajustar stock');
            mostrarAlerta('error', '❌ Error al ajustar stock: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // FUNCIÓN PARA ELIMINAR PRODUCTO (si la necesitas)
    const ejecutarEliminarProducto = async (productoId) => {
        try {
            setLoading(true);
            setError(null);
            
            await api.inventario.eliminarProducto(productoId);
            
            mostrarAlerta('success', '✅ Producto eliminado correctamente');
            
            await cargarInventario();
        } catch (err) {
            setError(err.message || 'Error al eliminar producto');
            
            let mensajeError = 'Error al eliminar producto: ' + err.message;
            
            if (err.message.includes('500')) {
                mensajeError = '❌ Error del servidor (500). No se pudo eliminar el producto.';
            } else if (err.message.includes('404')) {
                mensajeError = '❌ Producto no encontrado.';
            } else if (err.message.includes('409')) {
                mensajeError = '❌ No se puede eliminar el producto porque tiene movimientos de stock asociados.';
            }
            
            mostrarAlerta('error', mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const mostrarAlerta = (tipo, mensaje) => {
        const alertasExistentes = document.querySelectorAll('.custom-alerta');
        alertasExistentes.forEach(alerta => alerta.remove());

        const alerta = document.createElement('div');
        const estilos = {
            success: 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200 text-green-800 border-l-4 border-l-green-500',
            warning: 'bg-gradient-to-r from-orange-50 to-amber-100 border-orange-200 text-orange-800 border-l-4 border-l-orange-500',
            error: 'bg-gradient-to-r from-red-50 to-rose-100 border-red-200 text-red-800 border-l-4 border-l-red-500'
        };

        alerta.className = `custom-alerta fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl max-w-xs sm:max-w-sm w-full transform transition-all duration-500 ${estilos[tipo]}`;
        
        const iconos = {
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        alerta.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 text-base sm:text-lg mr-2 sm:mr-3">
                    ${iconos[tipo]}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs sm:text-sm font-semibold break-words">${mensaje}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 sm:ml-4 text-gray-400 hover:text-gray-600 text-base sm:text-lg font-bold flex-shrink-0">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(alerta);
        
        // Animación de entrada
        setTimeout(() => {
            alerta.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            if (alerta.parentElement) {
                alerta.style.transform = 'translateX(100%)';
                setTimeout(() => alerta.remove(), 300);
            }
        }, 5000);
    };

    const clearError = () => setError(null);

    const obtenerEstadisticas = () => {
        const totalProductos = inventario.length;
        const stockBajo = inventario.filter(item => item.stock_bajo).length;
        const enStock = inventario.filter(item => !item.stock_bajo && item.stock_actual > 0).length;
        const sinStock = inventario.filter(item => item.stock_actual === 0).length;
        
        return { totalProductos, stockBajo, enStock, sinStock };
    };

    const estadisticas = obtenerEstadisticas();

    // Filtrar inventario basado en el estado activo/inactivo
    const inventarioFiltrado = filtroActivo 
        ? inventario.filter(item => item.activo !== false) // Mostrar solo activos
        : inventario.filter(item => item.activo === false); // Mostrar solo inactivos

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="space-y-4 sm:space-y-6">
                {/* Header Principal - Solo estadísticas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                                Gestión de <span className="text-blue-600">Inventario</span>
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl">
                                Controla tu stock, revisa alertas y realiza ajustes de inventario de forma eficiente
                            </p>
                        </div>
                        
                        {/* Filtro de Activos/Inactivos */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFiltroActivo(true)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    filtroActivo 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Activos
                            </button>
                            <button
                                onClick={() => setFiltroActivo(false)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    !filtroActivo 
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Desactivados
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas Rápidas - Mejorado para móviles */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-blue-200 text-center">
                            <p className="text-blue-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">TOTAL</p>
                            <p className="text-blue-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.totalProductos}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-orange-200 text-center">
                            <p className="text-orange-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">STOCK BAJO</p>
                            <p className="text-orange-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.stockBajo}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-green-200 text-center">
                            <p className="text-green-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">EN STOCK</p>
                            <p className="text-green-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.enStock}</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-gray-200 text-center">
                            <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">SIN STOCK</p>
                            <p className="text-gray-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.sinStock}</p>
                        </div>
                    </div>
                </div>

                {/* Mensajes de Error Mejorados para móviles */}
                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-100 rounded-xl sm:rounded-2xl border-l-4 border-l-red-500 p-3 sm:p-4 md:p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4 flex-1">
                                <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                                    <span className="text-red-600 text-base sm:text-lg">⚠️</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-red-800 font-semibold text-sm sm:text-base break-words">{error}</p>
                                </div>
                            </div>
                            <button
                                onClick={clearError}
                                className="text-red-500 hover:text-red-700 text-lg sm:text-xl font-bold ml-2 sm:ml-4 flex-shrink-0 transition-colors p-1 hover:bg-red-50 rounded-lg"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Alertas de Stock */}
                <StockAlerts inventario={inventario} />

                {/* Lista de Inventario */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
                    <InventarioList
                        inventario={inventarioFiltrado} // Usar inventario filtrado
                        loading={loading}
                        onAjustarStock={handleAjustarStock}
                        onCrearProducto={handleCrearProducto}
                        onEditarProducto={handleEditarProducto}
                        onImportarExcel={handleImportarExcel}
                        onDesactivarProducto={ejecutarDesactivarProducto}
                        onReactivarProducto={ejecutarReactivarProducto}
                        filtroActivo={filtroActivo}
                    />
                </div>

                {/* Modal de Ajuste de Stock - Mejorado para móviles */}
                {showAjusteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
                        <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 mx-auto shadow-2xl">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Ajustar Stock</h3>
                                <button
                                    onClick={() => setShowAjusteModal(false)}
                                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors duration-200"
                                    disabled={loading}
                                >
                                    <span className="text-xl text-gray-500 hover:text-gray-700">×</span>
                                </button>
                            </div>
                            
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                SKU ID: <span className="font-mono bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-semibold">{skuSeleccionado}</span> - 
                                <span className={`ml-2 sm:ml-3 font-bold ${
                                    tipoAjuste === 'entrada_compra' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {tipoAjuste === 'entrada_compra' ? 'Agregar' : 'Reducir'} stock
                                </span>
                            </p>

                            <div className="space-y-4 sm:space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                        Cantidad *
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base transition-all duration-300"
                                        placeholder="0"
                                        min="1"
                                        value={cantidadAjuste}
                                        onChange={(e) => setCantidadAjuste(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                        Motivo
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base transition-all duration-300"
                                        placeholder="Ej: Reposición de inventario, Ajuste por conteo..."
                                        value={motivoAjuste}
                                        onChange={(e) => setMotivoAjuste(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowAjusteModal(false)}
                                    className="px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base font-semibold disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={ejecutarAjuste}
                                    className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                                    disabled={loading || !cantidadAjuste || cantidadAjuste < 1}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                            <span className="text-xs sm:text-sm">Aplicando...</span>
                                        </div>
                                    ) : (
                                        'Aplicar Ajuste'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Crear Producto */}
                <CrearProductoModal
                    isOpen={showCrearModal}
                    onClose={() => setShowCrearModal(false)}
                    onCrearProducto={ejecutarCrearProducto}
                    loading={loading}
                />

                {/* Modal de Editar Producto */}
                <EditarProductoModal
                    isOpen={showEditarModal}
                    onClose={() => {
                        setShowEditarModal(false);
                        setProductoSeleccionado(null);
                    }}
                    onEditarProducto={ejecutarEditarProducto}
                    loading={loading}
                    producto={productoSeleccionado}
                />

                {/* Modal de Importar Excel */}
                <ImportarExcelModal
                    isOpen={showImportarModal}
                    onClose={() => setShowImportarModal(false)}
                    onImportarProductos={ejecutarImportarProductos}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Inventario;