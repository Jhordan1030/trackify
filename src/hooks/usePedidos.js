// src/hooks/usePedidos.js
import { useApi } from './useApi';
import { useState } from 'react';

const BASE_URL = 'https://trackify-backend-lake.vercel.app/api/v1';

export const usePedidos = () => {
  const { callApi, loading, error, clearError } = useApi();
  const [pedidos, setPedidos] = useState([]);

  const obtenerPedidos = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.clienteId) params.append('clienteId', filters.clienteId);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await fetch(`${BASE_URL}/pedidos?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      const pedidosData = result.data || [];
      setPedidos(pedidosData);
      return pedidosData;
    } catch (err) {
      console.error('Error obteniendo pedidos:', err);
      throw err;
    }
  };

  const registrarVenta = async (ventaData) => {
    try {
      const response = await fetch(`${BASE_URL}/pedidos/live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      
      // Actualizar la lista de pedidos después de registrar venta
      await obtenerPedidos();
      
      return result;
    } catch (err) {
      console.error('Error registrando venta:', err);
      throw err;
    }
  };

  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevoEstado })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      
      // Actualizar la lista de pedidos después de cambiar estado
      await obtenerPedidos();
      
      return result.data;
    } catch (err) {
      console.error('Error actualizando estado:', err);
      throw err;
    }
  };

  const obtenerPedido = async (pedidoId) => {
    try {
      const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Error obteniendo pedido:', err);
      throw err;
    }
  };

  return {
    pedidos, // ✅ Ahora devolvemos el estado actualizado
    loading,
    error,
    obtenerPedidos,
    registrarVenta,
    actualizarEstado,
    obtenerPedido,
    clearError
  };
};