import { Plus, ShoppingCart, Package, User, RefreshCw } from 'lucide-react';

export const QuickActions = ({ onAction }) => {
  const actions = [
    {
      label: 'Nueva Venta',
      description: 'Registrar venta rápida',
      icon: ShoppingCart,
      color: 'success',
      action: 'venta-rapida'
    },
    {
      label: 'Agregar Producto',
      description: 'Añadir al inventario',
      icon: Plus,
      color: 'primary',
      action: 'agregar-producto'
    },
    {
      label: 'Buscar Cliente',
      description: 'Encontrar o crear',
      icon: User,
      color: 'warning',
      action: 'buscar-cliente'
    },
    {
      label: 'Actualizar',
      description: 'Refrescar datos',
      icon: RefreshCw,
      color: 'gray',
      action: 'actualizar'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.action}
              onClick={() => onAction(action.action)}
              className={`p-4 rounded-xl border-2 border-${action.color}-100 bg-${action.color}-50 hover:bg-${action.color}-100 hover:border-${action.color}-200 transition-all duration-200 group animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${action.color}-500 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};