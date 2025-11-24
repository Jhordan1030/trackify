// src/components/Clientes/ClienteForm.jsx
import React, { useState } from 'react';
import { Search, UserPlus, AlertCircle } from 'lucide-react';
import { PLATAFORMAS, METODOS_CONTACTO } from '../../utils/constants';

export const ClienteForm = ({ onBuscarCliente, onCrearCliente, loading, error }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    plataforma: 'tiktok',
    nombre_completo: '',
    telefono: '',
    direccion_linea1: '',
    ciudad: '',
    metodo_contacto_preferido: 'whatsapp',
  });

  const [modo, setModo] = useState('buscar');
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.usuario.trim()) {
      nuevosErrores.usuario = 'El usuario es requerido';
    }

    if (modo === 'crear') {
      if (formData.telefono && !/^[\d\s+\-()]{10,15}$/.test(formData.telefono)) {
        nuevosErrores.telefono = 'Teléfono inválido';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    await onBuscarCliente(formData.usuario, formData.plataforma);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    
    await onCrearCliente(formData);
  };

  const limpiarFormulario = () => {
    setFormData({
      usuario: '',
      plataforma: 'tiktok',
      nombre_completo: '',
      telefono: '',
      direccion_linea1: '',
      ciudad: '',
      metodo_contacto_preferido: 'whatsapp',
    });
    setErrores({});
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setErrores({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => cambiarModo('buscar')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
            modo === 'buscar'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar Cliente
        </button>
        <button
          onClick={() => cambiarModo('crear')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
            modo === 'crear'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Crear Cliente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={modo === 'buscar' ? handleBuscar : handleCrear}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario *
            </label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.usuario ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="ej: maria_tiktok"
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
              Plataforma *
            </label>
            <select
              name="plataforma"
              value={formData.plataforma}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PLATAFORMAS.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          {modo === 'crear' && (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="María González"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errores.telefono ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0991234567"
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
                  Método de Contacto Preferido
                </label>
                <select
                  name="metodo_contacto_preferido"
                  value={formData.metodo_contacto_preferido}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {METODOS_CONTACTO.map(metodo => (
                    <option key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Guayaquil"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion_linea1"
                  value={formData.direccion_linea1}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Av. Principal 123"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            type="submit"
            disabled={loading || !formData.usuario.trim()}
            className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
              modo === 'buscar' 
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            } ${
              (loading || !formData.usuario.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : modo === 'buscar' ? (
              <Search className="w-4 h-4 mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {modo === 'buscar' ? 'Buscar Cliente' : 'Crear Cliente'}
          </button>

          {modo === 'crear' && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};