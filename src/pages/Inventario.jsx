// src/pages/Inventario.jsx
import { useState, useEffect } from 'react';
import { InventarioList } from '../components/Inventario/InventarioList';
import { StockAlerts } from '../components/Inventario/StockAlerts';
import api from '../services/api';

const Inventario = () => {
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAjusteModal, setShowAjusteModal] = useState(false);
    const [skuSeleccionado, setSkuSeleccionado] = useState(null);
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
            
            console.log('✅ Inventario cargado:', datos);
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
            alert('✅ Stock ajustado correctamente');
            
            // Recargar inventario
            await cargarInventario();
            
            // Cerrar modal
            setShowAjusteModal(false);
            setSkuSeleccionado(null);
            setTipoAjuste('');
            setCantidadAjuste(1);
            setMotivoAjuste('');
        } catch (err) {
            console.error('❌ Error ajustando stock:', err);
            setError(err.message || 'Error al ajustar stock');
            alert('❌ Error al ajustar stock: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Inventario</h2>
                <p className="text-gray-600">
                    Controla tu stock, revisa alertas y realiza ajustes de inventario
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

            <StockAlerts inventario={inventario} />

            <InventarioList
                inventario={inventario}
                loading={loading}
                onAjustarStock={handleAjustarStock}
            />

            {showAjusteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Ajustar Stock</h3>
                        <p className="text-gray-600 mb-4">
                            SKU ID: {skuSeleccionado} - {tipoAjuste === 'entrada_compra' ? 'Agregar' : 'Reducir'} stock
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cantidad
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="0"
                                    min="1"
                                    value={cantidadAjuste}
                                    onChange={(e) => setCantidadAjuste(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Motivo
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ej: Reposición de inventario"
                                    value={motivoAjuste}
                                    onChange={(e) => setMotivoAjuste(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowAjusteModal(false)}
                                className="btn btn-outline"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={ejecutarAjuste}
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Aplicando...' : 'Aplicar Ajuste'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventario;