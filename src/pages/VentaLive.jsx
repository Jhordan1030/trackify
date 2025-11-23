import { useState } from 'react';
import { VentaForm } from '../components/VentaLive/VentaForm';
import { usePedidos } from '../hooks/usePedidos';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';

const VentaLive = () => {
    const {
        loading,
        error,
        registrarVenta,
        clearError
    } = usePedidos();

    const [ventaRegistrada, setVentaRegistrada] = useState(null);

    const handleRegistrarVenta = async (ventaData) => {
        try {
            const result = await registrarVenta(ventaData);
            setVentaRegistrada(result.data);

            setTimeout(() => {
                setVentaRegistrada(null);
            }, 5000);
        } catch {
            // Error handled by hook
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Venta en Vivo</h2>
                <p className="text-gray-600">
                    Registra ventas rápidas desde tus transmisiones en vivo
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

            {ventaRegistrada && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                    <h3 className="font-semibold text-success-800 mb-2">✅ Venta Registrada Exitosamente</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Pedido:</strong> {ventaRegistrada.numero_pedido}
                        </div>
                        <div>
                            <strong>Total:</strong> ${parseFloat(ventaRegistrada.total).toFixed(2)}
                        </div>
                        <div>
                            <strong>Estado:</strong> {ventaRegistrada.estado}
                        </div>
                        <div>
                            <strong>ID:</strong> {ventaRegistrada.id}
                        </div>
                    </div>
                </div>
            )}

            <VentaForm
                onRegistrarVenta={handleRegistrarVenta}
                loading={loading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        💡 Consejos para Ventas en Vivo
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Verifica el stock antes de promocionar productos</li>
                        <li>• Usa nombres de usuario consistentes para cada cliente</li>
                        <li>• Confirma los precios antes de registrar la venta</li>
                        <li>• Registra la venta inmediatamente después de la confirmación</li>
                    </ul>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ⚡ Flujo Rápido
                    </h3>
                    <ol className="space-y-2 text-sm text-gray-600">
                        <li>1. Cliente confirma compra en vivo</li>
                        <li>2. Registra usuario y plataforma</li>
                        <li>3. Agrega items con SKU y cantidades</li>
                        <li>4. Verifica total y confirma venta</li>
                        <li>5. ¡Listo! El stock se reserva automáticamente</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default VentaLive;