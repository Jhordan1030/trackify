// src/hooks/useInventario.js
import { useApi } from './useApi';
import { useState } from 'react';

const BASE_URL = 'https://trackify-backend-lake.vercel.app/api/v1';

export const useInventario = () => {
  const { callApi, loading, error, clearError } = useApi();
  const [inventario, setInventario] = useState([]);

  const obtenerInventario = async () => {
    try {
      const response = await fetch(`${BASE_URL}/inventario/skus`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      const inventarioData = result.data || [];
      setInventario(inventarioData);
      return inventarioData;
    } catch (err) {
      console.error('Error obteniendo inventario:', err);
      throw err;
    }
  };

  const obtenerSKUDetalle = async (skuId) => {
    try {
      const response = await fetch(`${BASE_URL}/inventario/sku/${skuId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Error obteniendo SKU detalle:', err);
      throw err;
    }
  };

  const ajustarStock = async (skuId, ajusteData) => {
    try {
      const response = await fetch(`${BASE_URL}/inventario/sku/${skuId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ajusteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      
      // Actualizar el inventario después del ajuste
      await obtenerInventario();
      
      return result.data;
    } catch (err) {
      console.error('Error ajustando stock:', err);
      throw err;
    }
  };

  return {
    inventario, // ✅ Ahora devolvemos el estado actualizado
    loading,
    error,
    obtenerInventario,
    obtenerSKUDetalle,
    ajustarStock,
    clearError
  };
};