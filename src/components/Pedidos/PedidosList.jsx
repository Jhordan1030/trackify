// src/components/Pedidos/PedidosList.jsx
import { ShoppingCart, Filter, Download } from 'lucide-react';
import { PedidoCard } from './PedidoCard';
import { useState } from 'react';
import { ESTADOS_PEDIDO } from '../../utils/constants';

export const PedidosList = ({ pedidos, loading, onActualizarEstado }) => {
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    // Filtrar pedidos basado en estado y búsqueda
    const pedidosFiltrados = pedidos.filter(pedido => {
        const coincideEstado = filtroEstado === 'todos' || pedido.estado === filtroEstado;
        const coincideBusqueda = !terminoBusqueda || 
            pedido.numero_pedido?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            pedido.cliente_usuario?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            pedido.cliente_nombre?.toLowerCase().includes(terminoBusqueda.toLowerCase());
        
        return coincideEstado && coincideBusqueda;
    });

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                    <div className="text-center">
                        <p className="text-gray-700 text-sm font-medium">Cargando pedidos</p>
                        <p className="text-gray-400 text-xs mt-1">Espere un momento por favor</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!pedidos || pedidos.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No hay pedidos</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                        Los pedidos aparecerán aquí cuando se registren ventas.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header con Búsqueda y Filtros */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Pedidos <span className="text-blue-600">({pedidosFiltrados.length})</span>
                        {terminoBusqueda && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                de {pedidos.length} totales
                            </span>
                        )}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Gestiona y controla el estado de tus pedidos
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Barra de Búsqueda */}
                    <div className="relative flex-1 lg:flex-initial lg:w-80">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por número, cliente..."
                                value={terminoBusqueda}
                                onChange={(e) => setTerminoBusqueda(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                            />
                            {terminoBusqueda && (
                                <button
                                    onClick={() => setTerminoBusqueda('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtro por Estado */}
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        <div className="bg-blue-100 p-1.5 rounded-lg">
                            <Filter className="w-4 h-4 text-blue-600" />
                        </div>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 focus:outline-none cursor-pointer"
                        >
                            <option value="todos">Todos los estados</option>
                            {Object.entries(ESTADOS_PEDIDO).map(([key, config]) => (
                                <option key={key} value={key}>
                                    {config.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Indicador de Resultados de Búsqueda */}
            {terminoBusqueda && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm font-medium">
                                Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-blue-700 text-sm">
                                Búsqueda: "{terminoBusqueda}"
                            </span>
                            <button
                                onClick={() => setTerminoBusqueda('')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
                            >
                                <span>Limpiar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid de Pedidos - Responsivo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {pedidosFiltrados.map((pedido) => (
                    <PedidoCard
                        key={pedido.id}
                        pedido={pedido}
                        onActualizarEstado={onActualizarEstado}
                    />
                ))}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {pedidosFiltrados.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        No se encontraron pedidos
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
                        {terminoBusqueda 
                            ? `No hay pedidos que coincidan con "${terminoBusqueda}"`
                            : 'No hay pedidos con el estado seleccionado.'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                            onClick={() => {
                                setTerminoBusqueda('');
                                setFiltroEstado('todos');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm font-medium"
                        >
                            Ver todos los pedidos
                        </button>
                    </div>
                </div>
            )}

            {/* Footer con estadísticas */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-600">
                            {terminoBusqueda ? 'Resultados:' : 'Total:'} 
                            <strong className="text-gray-900"> {pedidosFiltrados.length}</strong> 
                            {terminoBusqueda && (
                                <span className="text-gray-500"> de {pedidos.length}</span>
                            )} pedidos
                        </span>
                        {filtroEstado !== 'todos' && (
                            <span className="text-orange-600">
                                Filtrado por: <strong>{ESTADOS_PEDIDO[filtroEstado]?.label || filtroEstado}</strong>
                            </span>
                        )}
                    </div>
                    <div className="text-gray-500">
                        Última actualización: <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};