// src/components/Pedidos/PedidoDetalleModal.jsx (actualizado)
import React from 'react';
import { 
  X, User, Calendar, Package, DollarSign, Truck, 
  MapPin, Phone, MessageCircle, ShoppingCart, CheckCircle,
  Clock, AlertCircle, Printer
} from 'lucide-react';
import { formatCurrency, formatDate, getEstadoConfig } from '../../utils/helpers';

const PedidoDetalleModal = ({ isOpen, onClose, pedido, onActualizarEstado }) => {
  if (!isOpen || !pedido) return null;

  const estadoConfig = getEstadoConfig(pedido.estado);

  // Función para imprimir comprobante
  const imprimirComprobante = () => {
    const ventanaImpresion = window.open('', '_blank');
    
    const contenido = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprobante - ${pedido.numero_pedido}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #333; 
            padding-bottom: 20px; 
            margin-bottom: 20px;
          }
          .info-section { 
            margin-bottom: 20px; 
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 20px;
          }
          .items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
          }
          .items-table th, .items-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
          }
          .items-table th { 
            background-color: #f5f5f5;
          }
          .total-section { 
            text-align: right; 
            margin-top: 20px; 
            font-size: 1.2em; 
            font-weight: bold;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 0.8em; 
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>COMPROBANTE DE PEDIDO</h1>
          <h2>Pedido: ${pedido.numero_pedido}</h2>
          <p>Fecha: ${formatDate(pedido.fecha_creacion)}</p>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <h3>INFORMACIÓN DEL PEDIDO</h3>
            <p><strong>Estado:</strong> ${estadoConfig.label}</p>
            <p><strong>Plataforma:</strong> ${pedido.plataforma}</p>
            <p><strong>Items:</strong> ${pedido.total_items || 0}</p>
            <p><strong>Unidades:</strong> ${pedido.total_unidades || 0}</p>
          </div>

          <div class="info-section">
            <h3>INFORMACIÓN DEL CLIENTE</h3>
            <p><strong>Usuario:</strong> ${pedido.cliente_usuario || 'N/A'}</p>
            <p><strong>Nombre:</strong> ${pedido.cliente_nombre || 'N/A'}</p>
            <p><strong>Teléfono:</strong> ${pedido.cliente_telefono || 'N/A'}</p>
          </div>
        </div>

        ${pedido.direccion_linea1 ? `
        <div class="info-section">
          <h3>DIRECCIÓN DE ENVÍO</h3>
          <p>${pedido.direccion_linea1}</p>
          ${pedido.direccion_linea2 ? `<p>${pedido.direccion_linea2}</p>` : ''}
          <p>${pedido.ciudad || ''}${pedido.ciudad && pedido.provincia ? ', ' : ''}${pedido.provincia || ''}</p>
        </div>
        ` : ''}

        ${pedido.numero_guia_envio ? `
        <div class="info-section">
          <h3>INFORMACIÓN DE ENVÍO</h3>
          <p><strong>Guía:</strong> ${pedido.numero_guia_envio}</p>
          ${pedido.empresa_envio ? `<p><strong>Empresa:</strong> ${pedido.empresa_envio}</p>` : ''}
          ${pedido.fecha_envio ? `<p><strong>Fecha envío:</strong> ${formatDate(pedido.fecha_envio)}</p>` : ''}
        </div>
        ` : ''}

        <div class="info-section">
          <h3>PRODUCTOS</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${pedido.items && Array.isArray(pedido.items) ? pedido.items.map(item => `
                <tr>
                  <td>${item.producto_nombre || 'Producto'}</td>
                  <td>${item.sku_codigo || 'N/A'}</td>
                  <td>${item.cantidad || 0}</td>
                  <td>${formatCurrency(item.precio_unitario || 0)}</td>
                  <td>${formatCurrency((item.cantidad || 0) * (item.precio_unitario || 0))}</td>
                </tr>
              `).join('') : '<tr><td colspan="5">No hay información de productos</td></tr>'}
            </tbody>
          </table>
        </div>

        <div class="total-section">
          <p>Subtotal: ${formatCurrency(pedido.subtotal || 0)}</p>
          <p>Envío: ${formatCurrency(pedido.costo_envio || 0)}</p>
          <p style="font-size: 1.4em; color: #000;">TOTAL: ${formatCurrency(pedido.total || 0)}</p>
        </div>

        <div class="footer">
          <p>Comprobante generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}</p>
          <p>Gracias por su compra</p>
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Imprimir Comprobante
          </button>
        </div>
      </body>
      </html>
    `;

    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close();
  };

  // ... (el resto del código del modal permanece igual)
  const getEstadoIcon = (estado) => {
    const icons = {
      'enviado': Truck,
      'entregado': CheckCircle,
      'cancelado': AlertCircle,
      'pendiente_contacto': Clock,
      'pendiente_pago': Clock,
      'pago_confirmado': CheckCircle,
      'empaquetado': Package
    };
    return icons[estado] || Package;
  };

  const EstadoIcon = getEstadoIcon(pedido.estado);

  const getColorClass = (color) => {
    const colorMap = {
      'warning': 'bg-yellow-100 text-yellow-600 border-yellow-200',
      'success': 'bg-green-100 text-green-600 border-green-200',
      'info': 'bg-blue-100 text-blue-600 border-blue-200',
      'primary': 'bg-indigo-100 text-indigo-600 border-indigo-200',
      'danger': 'bg-red-100 text-red-600 border-red-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const renderSafeText = (text, defaultValue = 'No disponible') => {
    if (!text && text !== 0) return defaultValue;
    if (typeof text === 'object') return JSON.stringify(text);
    return String(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getColorClass(estadoConfig.color)}`}>
              <EstadoIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Pedido {renderSafeText(pedido.numero_pedido)}
              </h2>
              <p className="text-sm text-gray-500">
                Creado el {formatDate(pedido.fecha_creacion)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna 1 - Información del Pedido */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Pedido</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Estado</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClass(estadoConfig.color)}`}>
                      {renderSafeText(estadoConfig.label)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(pedido.total || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Subtotal</span>
                    <span className="text-sm text-gray-700">
                      {formatCurrency(pedido.subtotal || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Envío</span>
                    <span className="text-sm text-gray-700">
                      {formatCurrency(pedido.costo_envio || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Items</span>
                    <span className="text-sm text-gray-700">
                      {renderSafeText(pedido.total_items, '0')} productos
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Unidades</span>
                    <span className="text-sm text-gray-700">
                      {renderSafeText(pedido.total_unidades, '0')} unidades
                    </span>
                  </div>
                </div>
              </div>

              {/* Columna 2 - Información del Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-1.5 rounded-lg">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {renderSafeText(pedido.cliente_usuario)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {renderSafeText(pedido.plataforma)}
                      </p>
                    </div>
                  </div>

                  {pedido.cliente_nombre && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-1.5 rounded-lg">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        {renderSafeText(pedido.cliente_nombre)}
                      </span>
                    </div>
                  )}

                  {pedido.cliente_telefono && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-1.5 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">
                        {renderSafeText(pedido.cliente_telefono)}
                      </span>
                    </div>
                  )}

                  {/* Dirección si está disponible */}
                  {(pedido.direccion_linea1 || pedido.ciudad) && (
                    <div className="flex items-start space-x-3">
                      <div className="bg-gray-100 p-1.5 rounded-lg mt-0.5">
                        <MapPin className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="text-sm text-gray-700">
                        {pedido.direccion_linea1 && <p>{renderSafeText(pedido.direccion_linea1)}</p>}
                        {pedido.direccion_linea2 && <p>{renderSafeText(pedido.direccion_linea2)}</p>}
                        {(pedido.ciudad || pedido.provincia) && (
                          <p>
                            {renderSafeText(pedido.ciudad)}
                            {pedido.ciudad && pedido.provincia && ', '}
                            {renderSafeText(pedido.provincia)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Envío */}
            {pedido.numero_guia_envio && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Información de Envío</span>
                </h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p><strong>Guía:</strong> {renderSafeText(pedido.numero_guia_envio)}</p>
                  {pedido.empresa_envio && (
                    <p><strong>Empresa:</strong> {renderSafeText(pedido.empresa_envio)}</p>
                  )}
                  {pedido.fecha_envio && (
                    <p><strong>Fecha de envío:</strong> {formatDate(pedido.fecha_envio)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Items del Pedido */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos del Pedido</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0 ? (
                  <div className="space-y-3">
                    {pedido.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {renderSafeText(item.producto_nombre || `SKU: ${item.sku_codigo}`)}
                          </p>
                          {item.variacion && (
                            <p className="text-sm text-gray-500">Variación: {renderSafeText(item.variacion)}</p>
                          )}
                          <p className="text-sm text-gray-500">Código: {renderSafeText(item.sku_codigo)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {renderSafeText(item.cantidad, '0')} × {formatCurrency(item.precio_unitario || 0)}
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatCurrency((item.cantidad || 0) * (item.precio_unitario || 0))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ShoppingCart className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No hay información detallada de productos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Estados si está disponible */}
            {pedido.historial_estados && Array.isArray(pedido.historial_estados) && pedido.historial_estados.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h3>
                <div className="space-y-2">
                  {pedido.historial_estados.map((historial, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="bg-gray-100 p-1.5 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {renderSafeText(historial.estado_anterior)} → {renderSafeText(historial.estado_nuevo)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(historial.fecha_cambio)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con botón de imprimir */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={imprimirComprobante}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Comprobante</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cerrar
            </button>
            {onActualizarEstado && (
              <button
                onClick={() => {
                  onClose();
                  // Aquí podrías abrir el modal de cambio de estado
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Cambiar Estado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoDetalleModal;