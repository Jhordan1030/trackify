// src/hooks/useClientes.js
import { useApi } from './useApi';
import { useState } from 'react';

const BASE_URL = 'https://trackify-backend-lake.vercel.app/api/v1';

export const useClientes = () => {
  const { callApi, loading, error, clearError } = useApi();
  const [clientes, setClientes] = useState([]);

  const obtenerClientes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/clientes`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      const clientesData = result.data || [];
      setClientes(clientesData);
      return clientesData;
    } catch (err) {
      console.error('Error obteniendo clientes:', err);
      throw err;
    }
  };

  const actualizarCliente = async (id, datos) => {
    try {
      const response = await fetch(`${BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      
      // Actualizar la lista de clientes después de la actualización
      await obtenerClientes();
      
      return result.data;
    } catch (err) {
      console.error('Error actualizando cliente:', err);
      throw err;
    }
  };

  const crearCliente = async (datos) => {
    try {
      const response = await fetch(`${BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      
      // Actualizar la lista de clientes después de crear
      await obtenerClientes();
      
      return result.data;
    } catch (err) {
      console.error('Error creando cliente:', err);
      throw err;
    }
  };

  const buscarOCrearCliente = async (usuario, plataforma) => {
    try {
      const response = await fetch(`${BASE_URL}/clientes/buscar?usuario=${encodeURIComponent(usuario)}&plataforma=${encodeURIComponent(plataforma)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Error buscando/creando cliente:', err);
      throw err;
    }
  };

  const eliminarCliente = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/clientes/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      
      // Actualizar la lista de clientes después de eliminar
      await obtenerClientes();
      
      return result.data;
    } catch (err) {
      console.error('Error eliminando cliente:', err);
      throw err;
    }
  };

  return {
    clientes, // ✅ Ahora devolvemos el estado actualizado
    actualizarCliente,
    obtenerClientes,
    crearCliente,
    buscarOCrearCliente,
    eliminarCliente,
    loading,
    error,
    clearError
  };
};