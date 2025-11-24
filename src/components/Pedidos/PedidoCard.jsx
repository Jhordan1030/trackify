// src/components/Pedidos/PedidoCard.jsx
import { useState } from 'react';
import {
    User,
    Calendar,
    Package,
    DollarSign,
    MoreVertical,
    Truck,
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate, getEstadoConfig } from '../../utils/helpers';
import { EstadoModal } from './EstadoModal';
import PedidoDetalleModal from './PedidoDetalleModal';

export const PedidoCard = ({ pedido, onActualizarEstado }) => {
    const [showModal, setShowModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const estadoConfig = getEstadoConfig(pedido.estado);

    const icons = {
        'enviado': Truck,
        'entregado': CheckCircle,
        'cancelado': XCircle,
        'pendiente_contacto': Clock,
        'pendiente_pago': Clock,
        'pago_confirmado': Package,
        'empaquetado': Package
    };

    const EstadoIcon = icons[pedido.estado] || Package;

    const handleEstadoChange = async (nuevoEstado) => {
        console.log('🔄 PedidoCard: Iniciando cambio de estado');
        console.log('📦 Pedido ID:', pedido.id);
        console.log('🎯 Nuevo estado:', nuevoEstado);
        
        await onActualizarEstado(pedido.id, nuevoEstado);
        setShowModal(false);
        setShowMenu(false);
    };

    const handleNextEstado = () => {
        const nextEstado = {
            'pendiente_contacto': 'pendiente_pago',
            'pendiente_pago': 'pago_confirmado',
            'pago_confirmado': 'empaquetado',
            'empaquetado': 'enviado',
            'enviado': 'entregado',
        }[pedido.estado];

        if (nextEstado) {
            console.log('⚡ Avanzando automáticamente a:', nextEstado);
            handleEstadoChange(nextEstado);
        }
    };

    const getColorClass = (color) => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'green': 'bg-green-100 text-green-600',
            'yellow': 'bg-yellow-100 text-yellow-600',
            'red': 'bg-red-100 text-red-600',
            'gray': 'bg-gray-100 text-gray-600',
            'purple': 'bg-purple-100 text-purple-600'
        };
        return colorMap[color] || 'bg-gray-100 text-gray-600';
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

    const nextEstado = {
        'pendiente_contacto': 'pendiente_pago',
        'pendiente_pago': 'pago_confirmado',
        'pago_confirmado': 'empaquetado',
        'empaquetado': 'enviado',
        'enviado': 'entregado',
    }[pedido.estado];

    return (
        <>
            <div 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 cursor-pointer"
                onClick={() => setShowDetalleModal(true)}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getColorClass(estadoConfig.color)}`}>
                            <EstadoIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{pedido.numero_pedido}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="bg-gray-100 p-1 rounded">
                                    <User className="w-3 h-3 text-gray-600" />
                                </div>
                                <span className="text-sm text-gray-600">
                                    {pedido.cliente_usuario} ({pedido.plataforma})
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDetalleModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                                >
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span>Ver Detalles</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cambiar Estado
                                </button>
                                {nextEstado && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNextEstado();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-colors"
                                    >
                                        Avanzar a {nextEstado.replace('_', ' ')}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 p-1 rounded">
                            <Calendar className="w-3 h-3 text-gray-600" />
                        </div>
                        <span className="text-gray-700">{formatDate(pedido.fecha_creacion)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 p-1 rounded">
                            <Package className="w-3 h-3 text-gray-600" />
                        </div>
                        <span className="text-gray-700">{pedido.total_items} items • {pedido.total_unidades} unidades</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColorClass(estadoConfig.color)}`}>
                            {estadoConfig.label}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 p-1 rounded">
                            <DollarSign className="w-3 h-3 text-gray-600" />
                        </div>
                        <span className="font-semibold text-gray-900">
                            {formatCurrency(pedido.total)}
                        </span>
                    </div>
                </div>

                {pedido.numero_guia_envio && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-100 p-1 rounded">
                                <Truck className="w-3 h-3 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-700">
                                <strong>Guía:</strong> {pedido.numero_guia_envio}
                                {pedido.empresa_envio && ` • ${pedido.empresa_envio}`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Cambio de Estado */}
            <EstadoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                pedido={pedido}
                onEstadoChange={handleEstadoChange}
            />

            {/* Modal de Detalle del Pedido */}
            <PedidoDetalleModal
                isOpen={showDetalleModal}
                onClose={() => setShowDetalleModal(false)}
                pedido={pedido}
                onActualizarEstado={onActualizarEstado}
            />
        </>
    );
};