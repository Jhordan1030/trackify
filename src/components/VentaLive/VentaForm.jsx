// src/components/VentaLive/VentaForm.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useInventario } from '../../hooks/useInventario';

export const VentaForm = ({ onRegistrarVenta, loading }) => {
  const { obtenerInventario, inventario } = useInventario();
  const [formData, setFormData] = useState({
    usuario: '',
    plataforma: 'tiktok',
    items: [{ skuId: '', cantidad: 1, precioUnitario: 0 }]
  });

  // Cargar inventario al montar el componente
  useEffect(() => {
    obtenerInventario();
  }, []);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      // Cambio en items
      const updatedItems = [...formData.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      
      // Si cambia el SKU, actualizar el precio automáticamente
      if (name === 'skuId' && value) {
        const skuSeleccionado = inventario.find(sku => sku.id === parseInt(value));
        if (skuSeleccionado) {
          updatedItems[index].precioUnitario = skuSeleccionado.precio_venta;
        }
      }
      
      setFormData(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Cambio en campos principales
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const agregarItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { skuId: '', cantidad: 1, precioUnitario: 0 }]
    }));
  };

  const eliminarItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calcularTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (parseFloat(item.precioUnitario) * parseInt(item.cantidad));
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.usuario || !formData.plataforma) {
      alert('Por favor completa usuario y plataforma');
      return;
    }

    // Validar items
    for (const item of formData.items) {
      if (!item.skuId || item.cantidad < 1 || item.precioUnitario <= 0) {
        alert('Por favor completa todos los campos de los items correctamente');
        return;
      }
    }

    try {
      await onRegistrarVenta(formData);
      // Limpiar formulario después de éxito
      setFormData({
        usuario: '',
        plataforma: 'tiktok',
        items: [{ skuId: '', cantidad: 1, precioUnitario: 0 }]
      });
    } catch (error) {
      // Error manejado por el hook
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Registrar Venta</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario del Cliente *
            </label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="web">Web</option>
            </select>
          </div>
        </div>

        {/* Items de la venta */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Items de la Venta</h4>
            <button
              type="button"
              onClick={agregarItem}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="flex items-end space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Producto *
                  </label>
                  <select
                    name="skuId"
                    value={item.skuId}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    {inventario.map(sku => (
                      <option key={sku.id} value={sku.id}>
                        {sku.producto_nombre} - {sku.sku_codigo} (Stock: {sku.stock_actual})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    value={item.cantidad}
                    onChange={(e) => handleInputChange(e, index)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Unitario *
                  </label>
                  <input
                    type="number"
                    name="precioUnitario"
                    value={item.precioUnitario}
                    onChange={(e) => handleInputChange(e, index)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-20">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtotal
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm font-medium">
                    ${(item.cantidad * item.precioUnitario).toFixed(2)}
                  </div>
                </div>

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarItem(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-green-600">
            ${calcularTotal().toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando Venta...' : 'Registrar Venta'}
        </button>
      </form>
    </div>
  );
};