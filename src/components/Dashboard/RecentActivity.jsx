// src/components/Dashboard/RecentActivity.jsx
import { Clock, ShoppingCart, Package, User, Truck, CheckCircle, XCircle } from 'lucide-react';
import { formatDate, getEstadoConfig, formatCurrency } from '../../utils/helpers';

export const RecentActivity = ({ pedidos, loading }) => {
    const recentActivities = pedidos?.slice(0, 6) || [];

    const getActivityIcon = (estado) => {
        switch (estado) {
            case 'pendiente_contacto':
                return User;
            case 'enviado':
                return Truck;
            case 'entregado':
                return CheckCircle;
            case 'cancelado':
                return XCircle;
            default:
                return Package;
        }
    };

    const getActivityColor = (estado) => {
        const config = getEstadoConfig(estado);
        return `text-${config.color}-600 bg-${config.color}-50 border-${config.color}-200`;
    };

    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card group">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {recentActivities.length} actividades
                </span>
            </div>

            <div className="space-y-3">
                {recentActivities.length === 0 ? (
                    <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No hay actividad reciente</p>
                        <p className="text-sm text-gray-400">Los pedidos aparecerán aquí</p>
                    </div>
                ) : (
                    recentActivities.map((pedido, index) => {
                        const Icon = getActivityIcon(pedido.estado);
                        const estadoConfig = getEstadoConfig(pedido.estado);

                        return (
                            <div
                                key={pedido.id}
                                className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 animate-fade-in-up group-hover:scale-[1.02]"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`p-2 rounded-lg ${getActivityColor(pedido.estado)}`}>
                                    <Icon className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {pedido.cliente_usuario || 'Cliente'}
                                        </p>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 capitalize">{pedido.plataforma || 'web'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatDate(pedido.fecha_creacion || pedido.created_at)}</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                        {formatCurrency(pedido.total || 0)}
                                    </p>
                                    <span className={`badge badge-${estadoConfig.color} text-xs`}>
                                        {estadoConfig.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {recentActivities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                        Ver todos los pedidos →
                    </button>
                </div>
            )}
        </div>
    );
};