import { useState } from 'react';
import { InventarioList } from '../components/Inventario/InventarioList';
import { StockAlerts } from '../components/Inventario/StockAlerts';
import { useInventario } from '../hooks/useInventario';
import { LoadingSpinner } from '../components/Layout/LoadingSpinner';

const Inventario = () => {
    const {
        inventario,
        loading,
        error,
        ajustarStock,
        clearError
    } = useInventario();

    const [showAjusteModal, setShowAjusteModal] = useState(false);
    const [skuSeleccionado, setSkuSeleccionado] = useState(null);
    const [tipoAjuste, setTipoAjuste] = useState('');

    const handleAjustarStock = async (skuId, tipo) => {
        setSkuSeleccionado(skuId);
        setTipoAjuste(tipo);
        setShowAjusteModal(true);
    };

    const ejecutarAjuste = async (cantidad, motivo) => {
        try {
            await ajustarStock(skuSeleccionado, {
                cantidad: parseInt(cantidad),
                tipoMovimiento: tipoAjuste,
                motivo: motivo || 'Ajuste manual'
            });
            setShowAjusteModal(false);
            setSkuSeleccionado(null);
            setTipoAjuste('');
        } catch {
            // Error handled by hook
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Inventario</h2>
                <p className="text-gray-600">
                    Controla tu stock, revisa alertas y realiza ajustes de inventario
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
                            SKU: {skuSeleccionado} - {tipoAjuste === 'entrada_compra' ? 'Agregar' : 'Reducir'} stock
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
                                    defaultValue="1"
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
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowAjusteModal(false)}
                                className="btn btn-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => ejecutarAjuste(10, 'Ajuste manual')}
                                className="btn btn-primary"
                            >
                                Aplicar Ajuste
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventario;