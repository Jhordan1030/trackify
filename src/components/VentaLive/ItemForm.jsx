import { Plus, Minus, DollarSign } from 'lucide-react';

export const ItemForm = ({ item, index, onChange, onRemove, canRemove }) => {
  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Item #{index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="btn btn-danger p-2"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU ID *
          </label>
          <input
            type="number"
            value={item.skuId || ''}
            onChange={(e) => handleChange('skuId', parseInt(e.target.value) || '')}
            className="input"
            placeholder="123"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad *
          </label>
          <input
            type="number"
            value={item.cantidad || ''}
            onChange={(e) => handleChange('cantidad', parseInt(e.target.value) || '')}
            className="input"
            placeholder="1"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Unitario *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={item.precioUnitario || ''}
              onChange={(e) => handleChange('precioUnitario', parseFloat(e.target.value) || '')}
              className="input pl-10"
              placeholder="0.00"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      {item.skuId && item.cantidad && item.precioUnitario && (
        <div className="mt-3 p-2 bg-white rounded border">
          <p className="text-sm text-gray-600">
            Subtotal: <strong>${(item.cantidad * item.precioUnitario).toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
};