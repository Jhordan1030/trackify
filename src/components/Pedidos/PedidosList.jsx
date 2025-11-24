// src/components/Pedidos/PedidosList.jsx
import { ShoppingCart, Filter } from 'lucide-react';
import { PedidoCard } from './PedidoCard';
import { useState } from 'react';
import { ESTADOS_PEDIDO } from '../../utils/constants';

export const PedidosList = ({ pedidos, loading, onActualizarEstado }) => {
    const [filtroEstado, setFiltroEstado] = useState('todos');

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600"></div>
                    <div className="text-center sm:text-left">
                        <p className="text-gray-600 text-sm sm:text-base">Cargando pedidos...</p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Espere un momento por favor</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!pedidos || pedidos.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                <div className="text-center py-8 sm:py-12">
                    <div className="bg-blue-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No hay pedidos</h3>
                    <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-md mx-auto">
                        Los pedidos aparecerán aquí cuando se registren ventas.
                    </p>
                </div>
            </div>
        );
    }

    const pedidosFiltrados = filtroEstado === 'todos'
        ? pedidos
        : pedidos.filter(pedido => pedido.estado === filtroEstado);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header Responsivo Mejorado */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                        Pedidos ({pedidosFiltrados.length})
                        {pedidosFiltrados.length !== pedidos.length && ` de ${pedidos.length}`}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Gestiona y controla el estado de tus pedidos
                    </p>
                </div>

                <div className="flex items-center space-x-4">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {pedidosFiltrados.map((pedido) => (
                    <PedidoCard
                        key={pedido.id}
                        pedido={pedido}
                        onActualizarEstado={onActualizarEstado}
                    />
                ))}
            </div>

            {pedidosFiltrados.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    <div className="text-center py-8 sm:py-12">
                        <div className="bg-orange-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            No se encontraron pedidos
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-md mx-auto">
                            No hay pedidos con el estado seleccionado.
                        </p>
                        <button
                            onClick={() => setFiltroEstado('todos')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base font-medium"
                        >
                            Ver todos los pedidos
                        </button>
                    </div>
                </div>
            )}

            {/* Footer con estadísticas rápidas */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                            Total: <strong>{pedidos.length}</strong> pedidos
                        </span>
                        <span className="text-blue-600">
                            Mostrando: <strong>{pedidosFiltrados.length}</strong>
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