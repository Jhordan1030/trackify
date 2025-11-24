// src/pages/Inventario.jsx - CORREGIDO Y RESPONSIVO
import { useState, useEffect } from 'react';
import { InventarioList } from '../components/Inventario/InventarioList';
import { StockAlerts } from '../components/Inventario/StockAlerts';
import CrearProductoModal from '../components/Inventario/CrearProductoModal';
import EditarProductoModal from '../components/Inventario/EditarProductoModal';
import api from '../services/api';

const Inventario = () => {
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAjusteModal, setShowAjusteModal] = useState(false);
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [skuSeleccionado, setSkuSeleccionado] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [tipoAjuste, setTipoAjuste] = useState('');
    const [cantidadAjuste, setCantidadAjuste] = useState(1);
    const [motivoAjuste, setMotivoAjuste] = useState('');

    useEffect(() => {
        cargarInventario();
    }, []);

    const cargarInventario = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('📥 Cargando inventario...');
            const response = await api.inventario.listarSKUs();
            const datos = response.data || [];
            
            console.log('✅ Inventario cargado:', datos.length, 'productos');
            setInventario(Array.isArray(datos) ? datos : []);
        } catch (err) {
            console.error('❌ Error cargando inventario:', err);
            setError(err.message || 'Error al cargar inventario');
            setInventario([]);
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
        console.log('✏️ Editando producto:', producto);
        setProductoSeleccionado(producto);
        setShowEditarModal(true);
    };

    const ejecutarCrearProducto = async (productoData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Creando producto:', productoData);
            
            let response;
            try {
                console.log('🔍 Probando con endpoint de debug...');
                response = await api.inventario.crearProductoDebug(productoData);
                console.log('✅ Producto creado con debug:', response);
            } catch (debugError) {
                console.log('⚠️ Endpoint debug falló, intentando endpoint normal...');
                response = await api.inventario.crearProducto(productoData);
                console.log('✅ Producto creado con endpoint normal:', response);
            }
            
            console.log('🎉 Producto creado correctamente:', response);
            
            mostrarAlerta('success', '✅ Producto creado correctamente');
            
            await cargarInventario();
            setShowCrearModal(false);
        } catch (err) {
            console.error('❌ Error completo creando producto:', {
                message: err.message,
                dataEnviada: productoData
            });
            
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
            
            console.log('🔄 Actualizando producto:', productoData);
            
            const response = await api.inventario.actualizarProducto(
                productoData.productoId, 
                productoData
            );
            
            console.log('✅ Producto actualizado correctamente:', response);
            
            mostrarAlerta('success', '✅ Producto actualizado correctamente');
            
            await cargarInventario();
            setShowEditarModal(false);
            setProductoSeleccionado(null);
        } catch (err) {
            console.error('❌ Error actualizando producto:', err);
            
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

    const ejecutarAjuste = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const datosAjuste = {
                cantidad: parseInt(cantidadAjuste),
                tipoMovimiento: tipoAjuste,
                motivo: motivoAjuste || 'Ajuste manual'
            };

            console.log('🔄 Ajustando stock:', skuSeleccionado, datosAjuste);
            await api.inventario.ajustarStock(skuSeleccionado, datosAjuste);
            
            console.log('✅ Stock ajustado correctamente');
            
            mostrarAlerta('success', '✅ Stock ajustado correctamente');
            
            await cargarInventario();
            setShowAjusteModal(false);
            setSkuSeleccionado(null);
            setTipoAjuste('');
            setCantidadAjuste(1);
            setMotivoAjuste('');
        } catch (err) {
            console.error('❌ Error ajustando stock:', err);
            setError(err.message || 'Error al ajustar stock');
            mostrarAlerta('error', '❌ Error al ajustar stock: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const mostrarAlerta = (tipo, mensaje) => {
        const alerta = document.createElement('div');
        alerta.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 ${
            tipo === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
        }`;
        
        alerta.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    ${tipo === 'success' ? '✅' : '❌'}
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm font-medium">${mensaje}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(alerta);
        
        setTimeout(() => {
            if (alerta.parentElement) {
                alerta.remove();
            }
        }, 5000);
    };

    const clearError = () => setError(null);

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Header Responsivo */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Gestión de Inventario
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                                Controla tu stock, revisa alertas y realiza ajustes de inventario de forma eficiente
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleCrearProducto}
                                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base"
                                disabled={loading}
                            >
                                <span>+ Nuevo Producto</span>
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas Rápidas - Mejorado responsivo */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-blue-600 text-xs sm:text-sm font-medium mb-1">Total Productos</p>
                            <p className="text-blue-900 text-lg sm:text-xl md:text-2xl font-bold">{inventario.length}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-yellow-600 text-xs sm:text-sm font-medium mb-1">Stock Bajo</p>
                            <p className="text-yellow-900 text-lg sm:text-xl md:text-2xl font-bold">
                                {inventario.filter(item => item.stock_bajo).length}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-green-600 text-xs sm:text-sm font-medium mb-1">En Stock</p>
                            <p className="text-green-900 text-lg sm:text-xl md:text-2xl font-bold">
                                {inventario.filter(item => !item.stock_bajo).length}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Sin Stock</p>
                            <p className="text-gray-900 text-lg sm:text-xl md:text-2xl font-bold">
                                {inventario.filter(item => item.stock_actual === 0).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mensajes de Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3 flex-1">
                                <div className="flex-shrink-0 text-red-500 mt-0.5">⚠️</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
                                </div>
                            </div>
                            <button
                                onClick={clearError}
                                className="text-red-500 hover:text-red-700 text-lg font-bold ml-4 flex-shrink-0"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Alertas de Stock */}
                <StockAlerts inventario={inventario} />

                {/* Lista de Inventario */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                    <InventarioList
                        inventario={inventario}
                        loading={loading}
                        onAjustarStock={handleAjustarStock}
                        onCrearProducto={handleCrearProducto}
                        onEditarProducto={handleEditarProducto}
                    />
                </div>

                {/* Modal de Ajuste de Stock */}
                {showAjusteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Ajustar Stock</h3>
                                <button
                                    onClick={() => setShowAjusteModal(false)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={loading}
                                >
                                    <span className="text-xl text-gray-500">×</span>
                                </button>
                            </div>
                            
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                SKU ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">{skuSeleccionado}</span> - 
                                <span className={`ml-2 font-medium ${
                                    tipoAjuste === 'entrada_compra' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {tipoAjuste === 'entrada_compra' ? 'Agregar' : 'Reducir'} stock
                                </span>
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cantidad *
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                        placeholder="0"
                                        min="1"
                                        value={cantidadAjuste}
                                        onChange={(e) => setCantidadAjuste(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
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
                                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors w-full sm:w-auto text-sm sm:text-base font-medium"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={ejecutarAjuste}
                                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full sm:w-auto text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading || !cantidadAjuste || cantidadAjuste < 1}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
            </div>
        </div>
    );
};

export default Inventario;