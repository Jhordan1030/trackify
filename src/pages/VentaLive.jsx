import { useState } from 'react';
import { VentaForm } from '../components/VentaLive/VentaForm';
import api from '../services/api';

const VentaLive = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ventaRegistrada, setVentaRegistrada] = useState(null);

    const handleRegistrarVenta = async (ventaData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('📤 Registrando venta:', ventaData);
            const response = await api.pedidos.registrarVentaLive(ventaData);
            
            console.log('✅ Venta registrada:', response.data);
            setVentaRegistrada(response.data);

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                setVentaRegistrada(null);
            }, 5000);
        } catch (err) {
            console.error('❌ Error registrando venta:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error al registrar venta';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Venta en Vivo</h2>
                <p className="text-sm md:text-base text-gray-600">
                    Registra ventas rápidas desde tus transmisiones en vivo
                </p>
            </div>

            {/* Mensajes de estado */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <p className="text-red-700 text-sm">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-500 hover:text-red-700 ml-2"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {ventaRegistrada && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2 text-sm md:text-base">✅ Venta Registrada Exitosamente</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs md:text-sm">
                        <div>
                            <strong>Pedido:</strong> {ventaRegistrada.numero_pedido}
                        </div>
                        <div>
                            <strong>Subtotal:</strong> ${parseFloat(ventaRegistrada.subtotal).toFixed(2)}
                        </div>
                        <div>
                            <strong>Envío:</strong> ${parseFloat(ventaRegistrada.costo_envio || 2.5).toFixed(2)}
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

            {/* Formulario principal */}
            <VentaForm
                onRegistrarVenta={handleRegistrarVenta}
                loading={loading}
            />

            {/* Paneles de información */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                        💡 Consejos para Ventas en Vivo
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Verifica el stock antes de promocionar productos</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Usa nombres de usuario consistentes para cada cliente</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Confirma los precios antes de registrar la venta</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Registra la venta inmediatamente después de la confirmación</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                        ⚡ Flujo Rápido
                    </h3>
                    <ol className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">1.</span>
                            <span>Cliente confirma compra en vivo</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">2.</span>
                            <span>Registra usuario y plataforma</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">3.</span>
                            <span>Agrega items con SKU y cantidades</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">4.</span>
                            <span>Verifica total y confirma venta</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">5.</span>
                            <span>¡Listo! El stock se reserva automáticamente</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default VentaLive;