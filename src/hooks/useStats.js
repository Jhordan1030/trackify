// src/hooks/useStats.js
import { useApi } from './useApi';
import { useState } from 'react';

const BASE_URL = 'https://trackify-backend-lake.vercel.app/api/v1';

export const useStats = () => {
  const { callApi, loading, error, clearError } = useApi();
  const [stats, setStats] = useState({});

  const obtenerEstadisticas = async () => {
    try {
      const response = await fetch(`${BASE_URL}/pedidos/estadisticas`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      const statsData = result.data || {};
      setStats(statsData);
      return statsData;
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      throw err;
    }
  };

  return {
    stats, // ✅ Ahora devolvemos el estado actualizado
    loading,
    error,
    obtenerEstadisticas,
    clearError
  };
};