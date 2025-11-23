// src/components/Clientes/ClienteForm.jsx
import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { PLATAFORMAS, METODOS_CONTACTO } from '../../utils/constants';

export const ClienteForm = ({ onBuscarCliente, onCrearCliente, loading }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    plataforma: 'tiktok',
    nombre_completo: '',
    telefono: '',
    direccion_linea1: '',
    ciudad: '',
    metodo_contacto_preferido: 'whatsapp',
  });

  const [modo, setModo] = useState('buscar'); // 'buscar' | 'crear'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!formData.usuario) return;
    
    await onBuscarCliente(formData.usuario, formData.plataforma);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!formData.usuario) return;
    
    await onCrearCliente(formData);
    setFormData({
      usuario: '',
      plataforma: 'tiktok',
      nombre_completo: '',
      telefono: '',
      direccion_linea1: '',
      ciudad: '',
      metodo_contacto_preferido: 'whatsapp',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setModo('buscar')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            modo === 'buscar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Buscar Cliente
        </button>
        <button
          onClick={() => setModo('crear')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            modo === 'crear'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <UserPlus className="w-4 h-4 inline mr-2" />
          Crear Cliente
        </button>
      </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0991234567"
                />
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

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !formData.usuario}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              (loading || !formData.usuario) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
            ) : modo === 'buscar' ? (
              <Search className="w-4 h-4 inline mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 inline mr-2" />
            )}
            {modo === 'buscar' ? 'Buscar Cliente' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};