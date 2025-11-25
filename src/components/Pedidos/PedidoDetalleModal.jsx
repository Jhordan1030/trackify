// src/components/Pedidos/PedidoDetalleModal.jsx (versión responsive)
import React from 'react';
import { 
  X, User, Package, Truck, 
  MapPin, Phone, ShoppingCart, CheckCircle,
  Clock, AlertCircle, Printer
} from 'lucide-react';
import { formatCurrency, formatDate, getEstadoConfig } from '../../utils/helpers';

const PedidoDetalleModal = ({ isOpen, onClose, pedido }) => {
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
          @media (max-width: 768px) {
            .info-grid { grid-template-columns: 1fr; }
            .items-table { font-size: 12px; }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className={`p-1.5 sm:p-2 rounded-lg ${getColorClass(estadoConfig.color)} flex-shrink-0`}>
              <EstadoIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                Pedido {renderSafeText(pedido.numero_pedido)}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Creado el {formatDate(pedido.fecha_creacion)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Contenido - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            {/* Información General - Grid responsive */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Columna 1 - Información del Pedido */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  Información del Pedido
                </h3>
                
                <div className="space-y-2 sm:space-y-3 bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Estado</span>
                    <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getColorClass(estadoConfig.color)}`}>
                      {renderSafeText(estadoConfig.label)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Total</span>
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                      {formatCurrency(pedido.total || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Subtotal</span>
                    <span className="text-xs sm:text-sm text-gray-700">
                      {formatCurrency(pedido.subtotal || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Envío</span>
                    <span className="text-xs sm:text-sm text-gray-700">
                      {formatCurrency(pedido.costo_envio || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Items</span>
                    <span className="text-xs sm:text-sm text-gray-700">
                      {renderSafeText(pedido.total_items, '0')} productos
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Unidades</span>
                    <span className="text-xs sm:text-sm text-gray-700">
                      {renderSafeText(pedido.total_unidades, '0')} unidades
                    </span>
                  </div>
                </div>
              </div>

              {/* Columna 2 - Información del Cliente */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  Información del Cliente
                </h3>
                
                <div className="space-y-2 sm:space-y-3 bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-gray-100 p-1.5 rounded-lg flex-shrink-0">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                        {renderSafeText(pedido.cliente_usuario)}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {renderSafeText(pedido.plataforma)}
                      </p>
                    </div>
                  </div>

                  {pedido.cliente_nombre && (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-gray-100 p-1.5 rounded-lg flex-shrink-0">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 truncate flex-1">
                        {renderSafeText(pedido.cliente_nombre)}
                      </span>
                    </div>
                  )}

                  {pedido.cliente_telefono && (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-gray-100 p-1.5 rounded-lg flex-shrink-0">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 truncate flex-1">
                        {renderSafeText(pedido.cliente_telefono)}
                      </span>
                    </div>
                  )}

                  {/* Dirección si está disponible */}
                  {(pedido.direccion_linea1 || pedido.ciudad) && (
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="bg-gray-100 p-1.5 rounded-lg mt-0.5 flex-shrink-0">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 min-w-0 flex-1">
                        {pedido.direccion_linea1 && (
                          <p className="truncate">{renderSafeText(pedido.direccion_linea1)}</p>
                        )}
                        {pedido.direccion_linea2 && (
                          <p className="truncate">{renderSafeText(pedido.direccion_linea2)}</p>
                        )}
                        {(pedido.ciudad || pedido.provincia) && (
                          <p className="truncate">
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2 text-sm sm:text-base">
                  <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <span>Información de Envío</span>
                </h4>
                <div className="space-y-1 text-xs sm:text-sm text-blue-700">
                  <p className="break-all"><strong>Guía:</strong> {renderSafeText(pedido.numero_guia_envio)}</p>
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
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Productos del Pedido
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                {pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {pedido.items.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-gray-200 gap-2 sm:gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {renderSafeText(item.producto_nombre || `SKU: ${item.sku_codigo}`)}
                          </p>
                          {item.variacion && (
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              Variación: {renderSafeText(item.variacion)}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            Código: {renderSafeText(item.sku_codigo)}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {renderSafeText(item.cantidad, '0')} × {formatCurrency(item.precio_unitario || 0)}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-700">
                            {formatCurrency((item.cantidad || 0) * (item.precio_unitario || 0))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-gray-100 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">No hay información detallada de productos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Estados si está disponible */}
            {pedido.historial_estados && Array.isArray(pedido.historial_estados) && pedido.historial_estados.length > 0 && (
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Historial de Estados
                </h3>
                <div className="space-y-2">
                  {pedido.historial_estados.map((historial, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="bg-gray-100 p-1.5 rounded-lg flex-shrink-0">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
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
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={imprimirComprobante}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto order-2 sm:order-1 text-sm sm:text-base"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Comprobante</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 w-full sm:w-auto order-1 sm:order-2 text-sm sm:text-base"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PedidoDetalleModal;