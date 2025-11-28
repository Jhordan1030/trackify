// src/pages/Clientes.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';
import api from '../services/api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.clientes.listar({ limit: 50 });
      
      // DEBUG: Ver la estructura real de la respuesta
      console.log('Respuesta completa de clientes:', response);
      
      // Los clientes están en response.clientes (según el console.log)
      let clientesData = [];
      
      if (response && Array.isArray(response.clientes)) {
        clientesData = response.clientes;
      } else if (Array.isArray(response)) {
        clientesData = response;
      } else if (response && Array.isArray(response.data)) {
        clientesData = response.data;
      } else {
        console.warn('Estructura de respuesta inesperada, usando array vacío');
        clientesData = [];
      }
      
      console.log('Clientes extraídos:', clientesData);
      setClientes(clientesData);
    } catch (err) {
      console.error('Error cargando clientes:', err);
      setError('Error al cargar los clientes');
      setClientes([]); // Asegurar array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Asegurar que siempre trabajamos con un array
  const clientesArray = Array.isArray(clientes) ? clientes : [];
  
  const clientesFiltrados = clientesArray.filter(cliente =>
    (cliente.usuario?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (cliente.nombre_completo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (cliente.plataforma?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (cliente.telefono?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleEliminarCliente = async (clienteId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    try {
      await api.clientes.eliminar(clienteId);
      // Recargar la lista
      cargarClientes();
    } catch (err) {
      console.error('Error eliminando cliente:', err);
      alert('Error al eliminar el cliente');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-500">
              {clientesArray.length} cliente{clientesArray.length !== 1 ? 's' : ''} registrado{clientesArray.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={cargarClientes}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar clientes por nombre, usuario, plataforma o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No hay resultados para "${searchTerm}"`
                  : 'Comienza agregando tu primer cliente'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientesFiltrados.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cliente.usuario || 'Sin usuario'}</h4>
                      <p className="text-sm text-gray-500">
                        {cliente.nombre_completo && `${cliente.nombre_completo} • `}
                        {cliente.plataforma || 'Sin plataforma'}
                        {cliente.telefono && ` • ${cliente.telefono}`}
                      </p>
                      {cliente.ultimo_pedido && (
                        <p className="text-xs text-gray-400">
                          Último pedido: {new Date(cliente.ultimo_pedido).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEliminarCliente(cliente.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clientes;