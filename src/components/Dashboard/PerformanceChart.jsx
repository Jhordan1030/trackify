import { TrendingUp, BarChart3 } from 'lucide-react';

export const PerformanceChart = ({ loading }) => {
    // Datos de ejemplo para el gráfico
    const performanceData = [
        { day: 'Lun', ventas: 12, ingresos: 240 },
        { day: 'Mar', ventas: 8, ingresos: 180 },
        { day: 'Mié', ventas: 15, ingresos: 320 },
        { day: 'Jue', ventas: 10, ingresos: 210 },
        { day: 'Vie', ventas: 18, ingresos: 380 },
        { day: 'Sáb', ventas: 22, ingresos: 450 },
        { day: 'Dom', ventas: 14, ingresos: 290 },
    ];

    const maxVentas = Math.max(...performanceData.map(d => d.ventas));

    if (loading) {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                    Rendimiento Semanal
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-primary-500 rounded"></div>
                        <span className="text-gray-600">Ventas</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {performanceData.map((data, index) => (
                    <div key={data.day} className="flex items-center space-x-3 group">
                        <div className="w-10 text-sm font-medium text-gray-600">{data.day}</div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>{data.ventas} ventas</span>
                                <span>${data.ingresos}</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500 group-hover:from-primary-600 group-hover:to-primary-700"
                                    style={{
                                        width: `${(data.ventas / maxVentas) * 100}%`,
                                        animationDelay: `${index * 100}ms`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Promedio diario</span>
                    <span className="font-semibold text-success-600 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +15% esta semana
                    </span>
                </div>
            </div>
        </div>
    );
};