import { PedidosList } from '../components/Pedidos/PedidosList';
import { usePedidos } from '../hooks/usePedidos';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';

const Pedidos = () => {
    const {
        pedidos,
        loading,
        error,
        actualizarEstado,
        clearError
    } = usePedidos();

    const handleActualizarEstado = async (pedidoId, nuevoEstado) => {
        try {
            await actualizarEstado(pedidoId, nuevoEstado);
        } catch {
            // Error handled by hook
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Pedidos</h2>
                <p className="text-gray-600">
                    Revisa, actualiza y gestiona el estado de todos los pedidos
                </p>
            </div>

            {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <p className="text-danger-700">{error}</p>
                        <button
                            onClick={clearError}
                            className="text-danger-500 hover:text-danger-700"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <PedidosList
                pedidos={pedidos}
                loading={loading}
                onActualizarEstado={handleActualizarEstado}
            />
        </div>
    );
};

export default Pedidos;