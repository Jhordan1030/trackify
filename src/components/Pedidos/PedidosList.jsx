// src/components/Pedidos/PedidosList.jsx
import { ShoppingCart, Filter } from 'lucide-react';
import { PedidoCard } from './PedidoCard';
import { useState } from 'react';
import { ESTADOS_PEDIDO } from '../../utils/constants';

export const PedidosList = ({ pedidos, loading, onActualizarEstado }) => {
    const [filtroEstado, setFiltroEstado] = useState('todos');

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando pedidos...</span>
                </div>
            </div>
        );
    }

    if (!pedidos || pedidos.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
                    <p className="text-gray-500">Los pedidos aparecerán aquí cuando se registren ventas.</p>
                </div>
            </div>
        );
    }

    const pedidosFiltrados = filtroEstado === 'todos'
        ? pedidos
        : pedidos.filter(pedido => pedido.estado === filtroEstado);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Pedidos ({pedidosFiltrados.length})
                    {pedidosFiltrados.length !== pedidos.length && ` de ${pedidos.length}`}
                </h3>

                <div className="flex items-center space-x-4">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pedidosFiltrados.map((pedido) => (
                    <PedidoCard
                        key={pedido.id}
                        pedido={pedido}
                        onActualizarEstado={onActualizarEstado}
                    />
                ))}
            </div>

            {pedidosFiltrados.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No hay pedidos con el estado seleccionado.</p>
                </div>
            )}
        </div>
    );
};