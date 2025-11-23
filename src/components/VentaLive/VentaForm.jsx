import { useState } from 'react';
import { Plus, ShoppingCart, User as UserIcon, Truck } from 'lucide-react';
import { PLATAFORMAS } from '../../utils/constants';
import { ItemForm } from './ItemForm';
import { calculateTotal } from '../../utils/helpers';

export const VentaForm = ({ onRegistrarVenta, loading }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    plataforma: 'tiktok',
    items: [{ skuId: '', cantidad: 1, precioUnitario: '' }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { skuId: '', cantidad: 1, precioUnitario: '' }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación mejorada
    const itemsValidos = formData.items.every(
      item => item.skuId && item.cantidad && item.cantidad > 0 && item.precioUnitario && item.precioUnitario > 0
    );

    if (!itemsValidos) {
      alert('Por favor completa todos los campos de los items. Asegúrate de que:\n- Cada item tenga un producto seleccionado\n- La cantidad sea mayor a 0\n- El precio unitario sea mayor a 0');
      return;
    }

    if (!formData.usuario.trim()) {
      alert('Por favor ingresa el usuario del cliente');
      return;
    }

    // Preparar datos para enviar
    const ventaData = {
      usuario: formData.usuario.trim(),
      plataforma: formData.plataforma,
      items: formData.items.map(item => ({
        skuId: parseInt(item.skuId),
        cantidad: parseInt(item.cantidad),
        precioUnitario: parseFloat(item.precioUnitario),
      })),
    };

    console.log('📤 Enviando venta:', ventaData);

    await onRegistrarVenta(ventaData);

    // Reset form
    setFormData({
      usuario: '',
      plataforma: 'tiktok',
      items: [{ skuId: '', cantidad: 1, precioUnitario: '' }],
    });
  };

  const subtotal = calculateTotal(formData.items);
  const costoEnvio = 2.5; // Costo fijo
  const total = subtotal + costoEnvio;

  // Verificar si el formulario puede enviarse
  const canSubmit = formData.usuario.trim() && 
    formData.items.every(item => item.skuId && item.cantidad > 0 && item.precioUnitario > 0);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 md:p-3 bg-green-100 rounded-lg">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">Registrar Nueva Venta</h3>
          <p className="text-xs md:text-sm text-gray-500">Completa los datos de la venta en vivo</p>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="border-t border-gray-200 pt-4 md:pt-6">
        <h4 className="font-medium text-gray-900 mb-3 md:mb-4 flex items-center text-sm md:text-base">
          <UserIcon className="w-4 h-4 mr-2" />
          Información del Cliente
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario *
            </label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="ej: maria_tiktok"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plataforma *
            </label>
            <select
              name="plataforma"
              value={formData.plataforma}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              {PLATAFORMAS.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="border-t border-gray-200 pt-4 md:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h4 className="font-medium text-gray-900 text-sm md:text-base">Productos</h4>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <ItemForm
              key={index}
              item={item}
              index={index}
              onChange={handleItemChange}
              onRemove={removeItem}
              canRemove={formData.items.length > 1}
            />
          ))}
        </div>
      </div>

      {/* Costo de Envío - SOLO INFORMATIVO */}
      <div className="border-t border-gray-200 pt-4 md:pt-6">
        <h4 className="font-medium text-gray-900 mb-3 md:mb-4 flex items-center text-sm md:text-base">
          <Truck className="w-4 h-4 mr-2" />
          Envío
        </h4>
        
        <div className="w-full max-w-xs">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Costo de envío:</strong> $2.50
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Este costo ya está incluido automáticamente en el total del pedido
            </p>
          </div>
        </div>
      </div>

      {/* Resumen y Total */}
      <div className="border-t border-gray-200 pt-4 md:pt-6">
        <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Costo de Envío:</span>
            <span className="font-medium text-gray-900">$2.50</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-base md:text-lg font-medium text-gray-700">Total:</span>
              <span className="text-xl md:text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className={`w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm md:text-base ${
            (loading || !canSubmit) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Procesando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Registrar Venta (${total.toFixed(2)})
            </div>
          )}
        </button>

        {/* Indicador de estado del formulario */}
        {!canSubmit && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 text-center">
              Completa todos los campos obligatorios para registrar la venta
            </p>
          </div>
        )}
      </div>
    </form>
  );
};