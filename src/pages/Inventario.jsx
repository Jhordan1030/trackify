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
    const [filtroActivo, setFiltroActivo] = useState(true); // Nuevo estado para filtro

    useEffect(() => {
        cargarInventario();
    }, [filtroActivo]); // Recargar cuando cambie el filtro

    const cargarInventario = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.inventario.listarSKUs({ 
                activo: filtroActivo 
            });
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
            } else if (err.message.includes('ya está desactivado')) {
                mensajeError = '❌ El producto ya está desactivado.';
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
            } else if (err.message.includes('ya está activo')) {
                mensajeError = '❌ El producto ya está activo.';
            }
            
            mostrarAlerta('error', mensajeError);
        } finally {
            setLoading(false);
        }
    };

    // ... (las otras funciones se mantienen igual: handleAjustarStock, handleCrearProducto, etc.)

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

    // ... (las otras funciones se mantienen igual)

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

    // ... (las otras funciones se mantienen igual)

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="space-y-4 sm:space-y-6">
                {/* Header Principal - Con filtro de estado */}
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
                        
                        {/* Filtro de Estado */}
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setFiltroActivo(true)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    filtroActivo 
                                        ? 'bg-white text-blue-600 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                🟢 Activos
                            </button>
                            <button
                                onClick={() => setFiltroActivo(false)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    !filtroActivo 
                                        ? 'bg-white text-orange-600 shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                🔴 Desactivados
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas Rápidas */}
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

                {/* Mensajes de Error */}
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

                {/* Lista de Inventario - Pasar las nuevas funciones */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
                    <InventarioList
                        inventario={inventario}
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

                {/* ... (los modales se mantienen igual) */}
            </div>
        </div>
    );
};

export default Inventario;