// src/pages/Pedidos.jsx
import { useState, useEffect } from 'react';
import { PedidosList } from '../components/Pedidos/PedidosList';
import api from '../services/api';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('📥 Cargando pedidos...');
            const response = await api.pedidos.listar();
            const datos = response.data || [];
            
            console.log('✅ Pedidos cargados:', datos.length);
            
            const pedidosCompletos = await Promise.all(
                datos.map(async (pedido) => {
                    try {
                        const pedidoCompleto = await api.pedidos.obtener(pedido.id);
                        return pedidoCompleto.data || pedido;
                    } catch (err) {
                        console.warn(`⚠️ No se pudo cargar detalle del pedido ${pedido.id}:`, err.message);
                        return pedido;
                    }
                })
            );
            
            setPedidos(pedidosCompletos);
        } catch (err) {
            console.error('❌ Error cargando pedidos:', err);
            setError(err.message || 'Error al cargar pedidos');
            setPedidos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleActualizarEstado = async (pedidoId, nuevoEstado) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Actualizando estado:', pedidoId, nuevoEstado);
            await api.pedidos.actualizarEstado(pedidoId, nuevoEstado);
            
            mostrarAlerta('success', '✅ Estado actualizado correctamente');
            
            await cargarPedidos();
        } catch (err) {
            console.error('❌ Error actualizando estado:', err);
            const mensajeError = err.message || 'Error al actualizar estado';
            setError(mensajeError);
            mostrarAlerta('error', `❌ ${mensajeError}`);
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

    // Función para obtener estadísticas de pedidos
    const obtenerEstadisticas = () => {
        const totalPedidos = pedidos.length;
        const pendientes = pedidos.filter(p => p.estado === 'pendiente_contacto' || p.estado === 'pendiente_pago').length;
        const confirmados = pedidos.filter(p => p.estado === 'pago_confirmado').length;
        const enviados = pedidos.filter(p => p.estado === 'enviado').length;
        const entregados = pedidos.filter(p => p.estado === 'entregado').length;
        const cancelados = pedidos.filter(p => p.estado === 'cancelado').length;
        
        return { totalPedidos, pendientes, confirmados, enviados, entregados, cancelados };
    };

    const estadisticas = obtenerEstadisticas();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="space-y-4 sm:space-y-6">
                {/* Header Principal - Mismo diseño que Inventario */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                                Gestión de <span className="text-blue-600">Pedidos</span>
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl">
                                Controla, gestiona y realiza seguimiento a todos tus pedidos de forma eficiente
                            </p>
                        </div>
                    </div>

                    {/* Estadísticas Rápidas - Mismo diseño que Inventario */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-blue-200 text-center">
                            <p className="text-blue-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">TOTAL</p>
                            <p className="text-blue-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.totalPedidos}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-orange-200 text-center">
                            <p className="text-orange-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">PENDIENTES</p>
                            <p className="text-orange-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.pendientes}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-green-200 text-center">
                            <p className="text-green-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">CONFIRMADOS</p>
                            <p className="text-green-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.confirmados}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-indigo-200 text-center">
                            <p className="text-indigo-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">ENVIADOS</p>
                            <p className="text-indigo-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.enviados}</p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-emerald-200 text-center">
                            <p className="text-emerald-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">ENTREGADOS</p>
                            <p className="text-emerald-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.entregados}</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-red-200 text-center">
                            <p className="text-red-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">CANCELADOS</p>
                            <p className="text-red-900 text-lg sm:text-xl md:text-2xl font-bold">{estadisticas.cancelados}</p>
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

                {/* Lista de Pedidos */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
                    <PedidosList
                        pedidos={pedidos}
                        loading={loading}
                        onActualizarEstado={handleActualizarEstado}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pedidos;