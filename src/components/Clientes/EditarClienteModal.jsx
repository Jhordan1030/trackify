// src/components/Clientes/EditarClienteModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, MapPin, Mail, MessageCircle, AlertCircle } from 'lucide-react';

const EditarClienteModal = ({ cliente, onClose, onActualizar, loading }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    plataforma: '',
    nombre_completo: '',
    telefono: '',
    direccion_linea1: '',
    direccion_linea2: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: 'Ecuador',
    metodo_contacto_preferido: '',
    notas: '',
    activo: true
  });

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // EFECTO CRÍTICO - CARGA CORRECTA DE DATOS
  useEffect(() => {
    if (cliente) {
      console.log('🎯 === MODAL ABIERTO ===');
      console.log('📥 Cliente recibido en modal:', cliente);
      console.log('📍 Verificación de dirección en modal:', {
        direccion_linea1: cliente.direccion_linea1,
        direccion_linea2: cliente.direccion_linea2,
        ciudad: cliente.ciudad,
        provincia: cliente.provincia,
        codigo_postal: cliente.codigo_postal,
        pais: cliente.pais
      });

      // CARGAR DIRECTAMENTE LOS DATOS DEL CLIENTE SIN MODIFICACIONES
      const datosIniciales = {
        usuario: cliente.usuario || '',
        plataforma: cliente.plataforma || '',
        nombre_completo: cliente.nombre_completo || '',
        telefono: cliente.telefono || '',
        direccion_linea1: cliente.direccion_linea1 || '',
        direccion_linea2: cliente.direccion_linea2 || '',
        ciudad: cliente.ciudad || '',
        provincia: cliente.provincia || '',
        codigo_postal: cliente.codigo_postal || '',
        pais: cliente.pais || 'Ecuador',
        metodo_contacto_preferido: cliente.metodo_contacto_preferido || '',
        notas: cliente.notas || '',
        activo: cliente.activo !== undefined ? cliente.activo : true
      };

      console.log('🔄 Datos iniciales del formulario:', datosIniciales);
      setFormData(datosIniciales);
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.usuario.trim()) {
      nuevosErrores.usuario = 'El usuario es requerido';
    }

    if (!formData.nombre_completo.trim()) {
      nuevosErrores.nombre_completo = 'El nombre completo es requerido';
    }

    if (formData.telefono && !/^[\d\s+\-()]{10,15}$/.test(formData.telefono)) {
      nuevosErrores.telefono = 'Teléfono inválido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔄 Iniciando envío del formulario...');
    console.log('📋 Datos actuales del formulario:', formData);
    
    // Validar formulario antes de enviar
    if (!validarFormulario()) {
      console.log('❌ Validación fallida:', errores);
      return;
    }

    setEnviando(true);
    
    try {
      // Limpiar datos antes de enviar - mantener valores reales
      const datosLimpiados = {
        usuario: formData.usuario.trim(),
        plataforma: formData.plataforma || null,
        nombre_completo: formData.nombre_completo.trim(),
        telefono: formData.telefono?.trim() || null,
        direccion_linea1: formData.direccion_linea1?.trim() || null,
        direccion_linea2: formData.direccion_linea2?.trim() || null,
        ciudad: formData.ciudad?.trim() || null,
        provincia: formData.provincia?.trim() || null,
        codigo_postal: formData.codigo_postal?.trim() || null,
        pais: formData.pais?.trim() || 'Ecuador',
        metodo_contacto_preferido: formData.metodo_contacto_preferido || null,
        notas: formData.notas?.trim() || null,
        activo: Boolean(formData.activo)
      };

      console.log('📤 Enviando datos LIMPIOS al backend:', datosLimpiados);
      
      await onActualizar(cliente.id, datosLimpiados);
      
    } catch (error) {
      console.error('❌ Error en el modal:', error);
    } finally {
      setEnviando(false);
    }
  };

  if (!cliente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editar Cliente</h2>
              <p className="text-sm text-gray-500">{cliente.usuario}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.usuario ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                  maxLength={100}
                />
                {errores.usuario && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errores.usuario}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataforma
                </label>
                <select
                  name="plataforma"
                  value={formData.plataforma}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar plataforma</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="tiktok">TikTok</option>
                  <option value="web">Web</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.nombre_completo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                  maxLength={255}
                />
                {errores.nombre_completo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errores.nombre_completo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errores.telefono ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={20}
                  placeholder="0987654321"
                />
                {errores.telefono && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errores.telefono}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  Método de Contacto Preferido
                </label>
                <select
                  name="metodo_contacto_preferido"
                  value={formData.metodo_contacto_preferido}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No especificado</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="telefono">Teléfono</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            {/* Columna 2 - DIRECCIÓN */}
            <div className="space-y-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Dirección Línea 1
                </label>
                <input
                  type="text"
                  name="direccion_linea1"
                  value={formData.direccion_linea1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Av. Principal 123"
                />
                {formData.direccion_linea1 && (
                  <p className="mt-1 text-xs text-green-600">✓ Dato cargado correctamente</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección Línea 2
                </label>
                <input
                  type="text"
                  name="direccion_linea2"
                  value={formData.direccion_linea2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sector, referencia adicional..."
                />
                {formData.direccion_linea2 && (
                  <p className="mt-1 text-xs text-green-600">✓ Dato cargado correctamente</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ibarra"
                  maxLength={100}
                />
                {formData.ciudad && (
                  <p className="mt-1 text-xs text-green-600">✓ Dato cargado correctamente</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Imbabura"
                  maxLength={100}
                />
                {formData.provincia && (
                  <p className="mt-1 text-xs text-green-600">✓ Dato cargado correctamente</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="100101"
                  maxLength={20}
                />
                {formData.codigo_postal && (
                  <p className="mt-1 text-xs text-green-600">✓ Dato cargado correctamente</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Campos full width */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Notas
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notas adicionales sobre el cliente..."
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Cliente Activo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {(enviando || loading) ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{(enviando || loading) ? 'Guardando...' : 'Actualizar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarClienteModal;