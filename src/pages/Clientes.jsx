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
  const [success, setSuccess] = useState(null);

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
      
      console.log('✅ Clientes cargados:', datos.length);
      if (datos.length > 0) {
        console.log('📍 Ejemplo de cliente con dirección:', {
          usuario: datos[0].usuario,
          direccion_linea1: datos[0].direccion_linea1,
          ciudad: datos[0].ciudad,
          provincia: datos[0].provincia
        });
      }
      
      setClientes(Array.isArray(datos) ? datos : []);
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
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(mensaje);
    }
  };

  const handleBuscarCliente = async (usuario, plataforma) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.clientes.buscar(usuario, plataforma);
      console.log('✅ Cliente encontrado:', response.data);
      
      if (response.data) {
        mostrarMensaje(`Cliente ${usuario} encontrado`, 'success');
        await cargarClientes();
      } else {
        mostrarMensaje(`No se encontró el cliente ${usuario}`, 'error');
      }
    } catch (err) {
      console.error('❌ Error buscando cliente:', err);
      const mensajeError = err.message || 'Error al buscar cliente';
      mostrarMensaje(mensajeError, 'error');
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
      mostrarMensaje('✅ Cliente creado correctamente', 'success');
      
      await cargarClientes();
    } catch (err) {
      console.error('❌ Error creando cliente:', err);
      const mensajeError = err.message || 'Error al crear cliente';
      mostrarMensaje(mensajeError, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarCliente = (cliente) => {
    console.log('✏️ === INICIANDO EDICIÓN ===');
    console.log('📋 Cliente completo recibido:', cliente);
    console.log('📍 Datos de dirección:', {
      direccion_linea1: cliente.direccion_linea1,
      direccion_linea2: cliente.direccion_linea2,
      ciudad: cliente.ciudad,
      provincia: cliente.provincia,
      codigo_postal: cliente.codigo_postal,
      pais: cliente.pais
    });

    // Pasar el cliente directamente sin modificaciones
    setClienteEditando(cliente);
    setMostrarModal(true);
  };

  const handleActualizarCliente = async (id, datos) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Actualizando cliente ID:', id);
      console.log('📤 Datos a enviar:', datos);
      
      await api.clientes.actualizar(id, datos);
      
      console.log('✅ Cliente actualizado correctamente');
      mostrarMensaje('✅ Cliente actualizado correctamente', 'success');
      
      await cargarClientes();
      
      setMostrarModal(false);
      setClienteEditando(null);
    } catch (err) {
      console.error('❌ Error actualizando cliente:', err);
      const mensajeError = err.message || 'Error al actualizar cliente';
      mostrarMensaje(mensajeError, 'error');
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
      mostrarMensaje('✅ Cliente eliminado correctamente', 'success');
      
      await cargarClientes();
    } catch (err) {
      console.error('❌ Error eliminando cliente:', err);
      const mensajeError = err.message || 'Error al eliminar cliente';
      mostrarMensaje(mensajeError, 'error');
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
      
      console.log('✅ Cliente reactivado correctamente');
      mostrarMensaje('✅ Cliente reactivado correctamente', 'success');
      
      await cargarClientes();
    } catch (err) {
      console.error('❌ Error reactivando cliente:', err);
      const mensajeError = err.message || 'Error al reactivar cliente';
      mostrarMensaje(mensajeError, 'error');
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
      
      {/* Mensajes de éxito */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button 
              onClick={() => setSuccess(null)}
              className="text-green-500 hover:text-green-700 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
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
        error={error}
      />

      {/* Lista de clientes */}
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