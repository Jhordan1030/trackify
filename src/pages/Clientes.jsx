// src/pages/Clientes.jsx
import React, { useState, useEffect } from "react";
import EditarClienteModal from "../components/Clientes/EditarClienteModal";
import { ClientesList } from "../components/Clientes/ClientesList";
import { ClienteForm } from "../components/Clientes/ClienteForm";
import api from "../services/api";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar clientes al iniciar
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Cargando clientes...');
      
      const response = await api.clientes.listar();
      const datos = response.data || [];
      
      console.log('✅ Clientes cargados:', datos);
      setClientes(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error('❌ Error cargando clientes:', err);
      setError(err.message || 'Error al cargar clientes');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarCliente = async (usuario, plataforma) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.clientes.buscar(usuario, plataforma);
      console.log('✅ Cliente encontrado:', response.data);
      
      // Recargar todos los clientes para actualizar la lista
      await cargarClientes();
    } catch (err) {
      console.error('❌ Error buscando cliente:', err);
      setError(err.message || 'Error al buscar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCliente = async (datosCliente) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Creando cliente:', datosCliente);
      const response = await api.clientes.crear(datosCliente);
      
      console.log('✅ Cliente creado:', response.data);
      alert('✅ Cliente creado correctamente');
      
      // Recargar la lista
      await cargarClientes();
    } catch (err) {
      console.error('❌ Error creando cliente:', err);
      setError(err.message || 'Error al crear cliente');
      alert('❌ Error al crear el cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarModal(true);
  };

  const handleActualizarCliente = async (id, datos) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Actualizando cliente:', id, datos);
      await api.clientes.actualizar(id, datos);
      
      console.log('✅ Cliente actualizado correctamente');
      alert('✅ Cliente actualizado correctamente');
      
      // Recargar la lista
      await cargarClientes();
      
      setMostrarModal(false);
      setClienteEditando(null);
    } catch (err) {
      console.error('❌ Error actualizando cliente:', err);
      setError(err.message || 'Error al actualizar cliente');
      alert('❌ Error al actualizar el cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarCliente = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ Eliminando cliente:', id);
      await api.clientes.eliminar(id);
      
      console.log('✅ Cliente eliminado correctamente');
      alert('✅ Cliente eliminado correctamente');
      
      // Recargar la lista
      await cargarClientes();
    } catch (err) {
      console.error('❌ Error eliminando cliente:', err);
      setError(err.message || 'Error al eliminar cliente');
      alert('❌ Error al eliminar el cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteEditando(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
        <p className="text-gray-600">
          Busca, crea y gestiona los clientes de tu negocio
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex justify-between items-center">
            <span>Error: {error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Formulario de búsqueda/creación */}
      <ClienteForm 
        onBuscarCliente={handleBuscarCliente}
        onCrearCliente={handleCrearCliente}
        loading={loading}
      />

      {/* Lista de clientes */}
      <ClientesList
        clientes={clientes}
        loading={loading}
        onEditar={handleEditarCliente}
        onEliminar={handleEliminarCliente}
      />

      {/* Modal de edición */}
      {mostrarModal && (
        <EditarClienteModal
          cliente={clienteEditando}
          onClose={cerrarModal}
          onActualizar={handleActualizarCliente}
        />
      )}
    </div>
  );
};

export default Clientes;