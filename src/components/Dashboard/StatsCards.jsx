// src/components/Dashboard/StatsCards.jsx
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export const StatsCards = ({ stats, loading }) => {
    const cards = [
        {
            title: 'Ventas Totales',
            value: stats?.ventas_totales ? `$${parseFloat(stats.ventas_totales).toFixed(2)}` : '$0.00',
            icon: DollarSign,
            color: 'blue',
            trend: '+12.5%',
            trendUp: true
        },
        {
            title: 'Pedidos',
            value: stats?.total_pedidos || '0',
            icon: ShoppingBag,
            color: 'green',
            trend: '+5.2%',
            trendUp: true
        },
        {
            title: 'Clientes',
            value: stats?.total_clientes || '0',
            icon: Users,
            color: 'yellow',
            trend: '+2.4%',
            trendUp: true
        },
        {
            title: 'Ticket Promedio',
            value: stats?.ticket_promedio ? `$${parseFloat(stats.ticket_promedio).toFixed(2)}` : '$0.00',
            icon: TrendingUp,
            color: 'purple',
            trend: '+3.1%',
            trendUp: true
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center space-x-1 text-sm font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{card.trend}</span>
                                <TrendingUp className={`w-4 h-4 ${!card.trendUp && 'rotate-180'}`} />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};