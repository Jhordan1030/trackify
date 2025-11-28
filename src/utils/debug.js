// src/utils/debug.js - ARCHIVO TEMPORAL PARA DEBUG
export const debugAuth = {
  log: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${message}`, data || '');
    }
  },
  
  checkToken: () => {
    const token = localStorage.getItem('authToken');
    console.log('🔍 Debug - Token en localStorage:', token ? `SÍ (${token.length} chars)` : 'NO');
    return !!token;
  },
  
  clearToken: () => {
    localStorage.removeItem('authToken');
    console.log('🔍 Debug - Token eliminado');
  }
};

export default debugAuth;
