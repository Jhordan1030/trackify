// src/pages/Clientes.jsx - CON FILTROS MEJORADOS
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
  const [success, setSuccess] = useState(null);

  // Cargar TODOS los clientes (activos e inactivos)
  useEffect(() => {
    cargarTodosLosClientes();
  }, []);

  const cargarTodosLosClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Cargando TODOS los clientes (activos e inactivos)...');
      
      // Primero intentamos cargar todos los clientes sin filtros
      const response = await api.clientes.listar();
      console.log('✅ Respuesta completa:', response);
      
      let datos = [];
      if (response && response.success !== false) {
        if (response.data && Array.isArray(response.data.clientes)) {
          datos = response.data.clientes;
        } else if (response.data && Array.isArray(response.data)) {
          datos = response.data;
        } else if (Array.isArray(response.clientes)) {
          datos = response.clientes;
        } else if (Array.isArray(response)) {
          datos = response;
        }
      }
      
      console.log('✅ Clientes cargados:', datos.length);
      
      // Verificar si hay clientes inactivos
      const clientesInactivos = datos.filter(cliente => cliente.activo === false);
      console.log('🔍 Clientes inactivos encontrados:', clientesInactivos.length);
      
      setClientes(datos);
      
    } catch (err) {
      console.error('❌ Error cargando clientes:', err);
      setError(err.message || 'Error al cargar clientes');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (mensaje, tipo = 'success') => {
    if (tipo === 'success') {
      setSuccess(mensaje);
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(mensaje);
      setSuccess(null);
    }
  };

  const handleBuscarCliente = async (usuario, plataforma) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.clientes.buscarOCrear(usuario, plataforma);
      console.log('✅ Respuesta búsqueda:', response);
      
      if (response && response.data) {
        mostrarMensaje(`Cliente ${usuario} procesado correctamente`, 'success');
        await cargarTodosLosClientes();
      }
    } catch (err) {
      console.error('❌ Error buscando cliente:', err);
      mostrarMensaje(err.message || 'Error al buscar cliente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCliente = async (datosCliente) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 Creando cliente:', datosCliente);
      await api.clientes.crear(datosCliente);
      
      mostrarMensaje('✅ Cliente creado correctamente', 'success');
      await cargarTodosLosClientes();
      
    } catch (err) {
      console.error('❌ Error creando cliente:', err);
      mostrarMensaje(err.message || 'Error al crear cliente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarCliente = (cliente) => {
    console.log('✏️ Abriendo modal para editar:', cliente);
    setClienteEditando(cliente);
    setMostrarModal(true);
  };

  const handleActualizarCliente = async (id, datos) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Actualizando cliente ID:', id);
      await api.clientes.actualizar(id, datos);
      
      mostrarMensaje('✅ Cliente actualizado correctamente', 'success');
      await cargarTodosLosClientes();
      
      setMostrarModal(false);
      setClienteEditando(null);
      
    } catch (err) {
      console.error('❌ Error actualizando cliente:', err);
      mostrarMensaje(err.message || 'Error al actualizar cliente', 'error');
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
      
      mostrarMensaje('✅ Cliente eliminado correctamente', 'success');
      await cargarTodosLosClientes();
      
    } catch (err) {
      console.error('❌ Error eliminando cliente:', err);
      mostrarMensaje(err.message || 'Error al eliminar cliente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivarCliente = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Reactivando cliente:', id);
      await api.clientes.reactivar(id);
      
      mostrarMensaje('✅ Cliente reactivado correctamente', 'success');
      await cargarTodosLosClientes();
      
    } catch (err) {
      console.error('❌ Error reactivando cliente:', err);
      mostrarMensaje(err.message || 'Error al reactivar cliente', 'error');
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
          Busca, crea y gestiona todos los clientes (activos e inactivos)
        </p>
      </div>
      
      {/* Mensajes */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700 font-bold">
              ×
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex justify-between items-center">
            <span>Error: {error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <ClienteForm 
        onBuscarCliente={handleBuscarCliente}
        onCrearCliente={handleCrearCliente}
        loading={loading}
        error={error}
      />

      {/* Lista de TODOS los clientes */}
      <ClientesList
        clientes={clientes}
        loading={loading}
        onEditar={handleEditarCliente}
        onEliminar={handleEliminarCliente}
        onReactivar={handleReactivarCliente}
      />

      {/* Modal de edición */}
      {mostrarModal && clienteEditando && (
        <EditarClienteModal
          cliente={clienteEditando}
          onClose={cerrarModal}
          onActualizar={handleActualizarCliente}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Clientes;