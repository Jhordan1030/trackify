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
            
            console.log('✅ Pedidos cargados:', datos);
            setPedidos(Array.isArray(datos) ? datos : []);
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
            
            console.log('✅ Estado actualizado correctamente');
            alert('✅ Estado actualizado correctamente');
            
            // Recargar pedidos
            await cargarPedidos();
        } catch (err) {
            console.error('❌ Error actualizando estado:', err);
            setError(err.message || 'Error al actualizar estado');
            alert('❌ Error al actualizar estado: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Pedidos</h2>
                <p className="text-gray-600">
                    Revisa, actualiza y gestiona el estado de todos los pedidos
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={clearError}
                            className="text-red-500 hover:text-red-700 text-xl font-bold"
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