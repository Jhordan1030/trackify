// src/pages/Clientes.jsx
import React, { useState, useEffect } from "react";
import EditarClienteModal from "../components/Clientes/EditarClienteModal";
import { ClientesList } from "../components/Clientes/ClientesList";
import { ClienteForm } from "../components/Clientes/ClienteForm";
import { useClientes } from "../hooks/useClientes";

const Clientes = () => {
  const { 
    obtenerClientes, 
    actualizarCliente, 
    crearCliente, 
    eliminarCliente,
    loading, 
    error,
    clearError 
  } = useClientes();
  
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Cargar clientes al iniciar
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      console.log('📥 Cargando clientes...');
      const datos = await obtenerClientes();
      console.log('✅ Clientes cargados:', datos);
      
      if (Array.isArray(datos)) {
        setClientes(datos);
      } else {
        console.error('❌ Los datos no son un array:', datos);
        setClientes([]);
      }
    } catch (err) {
      console.error('❌ Error cargando clientes:', err);
      setClientes([]);
    }
  };

  const handleBuscarCliente = async (usuario, plataforma) => {
    try {
      // Por ahora, simplemente recargamos todos los clientes
      // En una implementación real, harías una búsqueda específica
      await cargarClientes();
      setBusquedaRealizada(true);
    } catch (err) {
      console.error('❌ Error buscando cliente:', err);
    }
  };

  const handleCrearCliente = async (datosCliente) => {
    try {
      await crearCliente(datosCliente);
      await cargarClientes(); // Recargar la lista
      alert('✅ Cliente creado correctamente');
    } catch (err) {
      console.error('❌ Error creando cliente:', err);
      alert('❌ Error al crear el cliente: ' + err.message);
    }
  };

  const handleEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarModal(true);
  };

  const handleActualizarCliente = async (id, datos) => {
    try {
      console.log('🔄 Actualizando cliente:', id, datos);
      await actualizarCliente(id, datos);
      await cargarClientes();
      setMostrarModal(false);
      setClienteEditando(null);
      alert('✅ Cliente actualizado correctamente');
    } catch (err) {
      console.error('❌ Error actualizando cliente:', err);
      alert('❌ Error al actualizar el cliente: ' + err.message);
    }
  };

  const handleEliminarCliente = async (id) => {
    try {
      // Por ahora, solo simulamos la eliminación
      // En una implementación real, llamarías a eliminarCliente(id)
      console.log('🗑️ Eliminando cliente:', id);
      alert('Función de eliminar cliente pendiente de implementar');
    } catch (err) {
      console.error('❌ Error eliminando cliente:', err);
      alert('❌ Error al eliminar el cliente: ' + err.message);
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
              onClick={clearError}
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