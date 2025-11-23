import { useState } from 'react';
import {
    User,
    Calendar,
    Package,
    DollarSign,
    MoreVertical,
    Truck,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { formatCurrency, formatDate, getEstadoConfig } from '../../utils/helpers';
import { EstadoModal } from './EstadoModal';

export const PedidoCard = ({ pedido, onActualizarEstado }) => {
    const [showModal, setShowModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const estadoConfig = getEstadoConfig(pedido.estado);

    const icons = {
        'enviado': Truck,
        'entregado': CheckCircle,
        'cancelado': XCircle,
        'pendiente_contacto': User,
        'pendiente_pago': User,
        'pago_confirmado': Package,
        'empaquetado': Package
    };

    const EstadoIcon = icons[pedido.estado] || Package;

    const handleEstadoChange = async (nuevoEstado) => {
        await onActualizarEstado(pedido.id, nuevoEstado);
        setShowModal(false);
        setShowMenu(false);
    };

    const nextEstado = {
        'pendiente_contacto': 'pendiente_pago',
        'pendiente_pago': 'pago_confirmado',
        'pago_confirmado': 'empaquetado',
        'empaquetado': 'enviado',
        'enviado': 'entregado',
    }[pedido.estado];

    return (
        <>
            <div className="card-hover animate-fade-in-up">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${estadoConfig.color}-100`}>
                            <EstadoIcon className={`w-5 h-5 text-${estadoConfig.color}-600`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{pedido.numero_pedido}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {pedido.cliente_usuario} ({pedido.plataforma})
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cambiar Estado
                                </button>
                                {nextEstado && (
                                    <button
                                        onClick={() => handleEstadoChange(nextEstado)}
                                        className="w-full px-4 py-2 text-left text-sm text-success-600 hover:bg-success-50"
                                    >
                                        Avanzar a {nextEstado}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(pedido.fecha_creacion)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>{pedido.total_items} items • {pedido.total_unidades} unidades</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <span className={`badge badge-${estadoConfig.color}`}>
                            {estadoConfig.label}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                            {formatCurrency(pedido.total)}
                        </span>
                    </div>
                </div>

                {pedido.numero_guia_envio && (
                    <div className="mt-3 p-2 bg-primary-50 rounded-lg">
                        <p className="text-sm text-primary-700">
                            <strong>Guía:</strong> {pedido.numero_guia_envio}
                            {pedido.empresa_envio && ` • ${pedido.empresa_envio}`}
                        </p>
                    </div>
                )}
            </div>

            <EstadoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                pedido={pedido}
                onEstadoChange={handleEstadoChange}
            />
        </>
    );
};