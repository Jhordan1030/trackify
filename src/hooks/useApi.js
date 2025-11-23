// Actualiza useApi.js para mejor logging
import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Iniciando llamada API...');
      const result = await apiCall();
      console.log('✅ Llamada API exitosa:', result);
      return result;
    } catch (err) {
      console.error('❌ Error en llamada API:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};