// src/components/Pedidos/EstadoModal.jsx
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

  const handleEstadoClick = (estado) => {
    console.log('🎯 Cambiando estado a:', estado);
    console.log('📋 Pedido ID:', pedido.id);
    console.log('📊 Estado actual:', pedido.estado);
    console.log('🔄 Nuevo estado:', estado);
    
    onEstadoChange(estado);
  };

  const getBadgeColorClass = (color) => {
    const colorMap = {
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'gray': 'bg-gray-100 text-gray-800 border-gray-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Cambiar Estado del Pedido
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Pedido: <strong>{pedido.numero_pedido}</strong>
            <br />
            Estado actual: <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColorClass(ESTADOS_PEDIDO[pedido.estado]?.color)}`}>
              {ESTADOS_PEDIDO[pedido.estado]?.label}
            </span>
          </p>

          <div className="space-y-2">
            {estadosDisponibles.length > 0 ? (
              estadosDisponibles.map((estado) => (
                <button
                  key={estado}
                  onClick={() => handleEstadoClick(estado)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    ESTADOS_PEDIDO[estado]?.color === 'red' || estado === 'cancelado'
                      ? 'border-red-200 hover:bg-red-50 text-red-700 hover:border-red-300'
                      : ESTADOS_PEDIDO[estado]?.color === 'green'
                      ? 'border-green-200 hover:bg-green-50 text-green-700 hover:border-green-300'
                      : 'border-blue-200 hover:bg-blue-50 text-blue-700 hover:border-blue-300'
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
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};