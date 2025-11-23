import { X } from 'lucide-react';
import { ESTADOS_PEDIDO } from '../../utils/constants';

export const EstadoModal = ({ isOpen, onClose, pedido, onEstadoChange }) => {
  if (!isOpen) return null;

  const estadosPosibles = {
    'pendiente_contacto': ['pendiente_pago', 'cancelado'],
    'pendiente_pago': ['pago_confirmado', 'cancelado'],
    'pago_confirmado': ['empaquetado', 'cancelado'],
    'empaquetado': ['enviado', 'cancelado'],
    'enviado': ['entregado', 'devuelto'],
    'entregado': ['devuelto'],
    'cancelado': [],
    'devuelto': [],
  };

  const estadosDisponibles = estadosPosibles[pedido.estado] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Cambiar Estado del Pedido
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Pedido: <strong>{pedido.numero_pedido}</strong>
            <br />
            Estado actual: <span className={`badge badge-${ESTADOS_PEDIDO[pedido.estado]?.color}`}>
              {ESTADOS_PEDIDO[pedido.estado]?.label}
            </span>
          </p>

          <div className="space-y-2">
            {estadosDisponibles.length > 0 ? (
              estadosDisponibles.map((estado) => (
                <button
                  key={estado}
                  onClick={() => onEstadoChange(estado)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    ESTADOS_PEDIDO[estado]?.color === 'danger'
                      ? 'border-danger-200 hover:bg-danger-50 text-danger-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium">
                    {ESTADOS_PEDIDO[estado]?.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {estado === 'cancelado' 
                      ? 'Cancelar el pedido y liberar stock' 
                      : `Cambiar a ${ESTADOS_PEDIDO[estado]?.label}`
                    }
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay más transiciones disponibles para este estado.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};