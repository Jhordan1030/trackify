// src/services/auth.js - NUEVO ARCHIVO
import api from './api';

export const authService = {
  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Guardar token
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  // Eliminar token
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Verificar expiración del token (básico)
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error verificando token:', error);
      return true;
    }
  },

  // Obtener datos del usuario desde el token
  getUserFromToken: (token) => {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId,
        email: payload.email,
        rol: payload.rol,
        empresaId: payload.empresaId
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  },

  // Validar formato de email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar fortaleza de contraseña
  isStrongPassword: (password) => {
    return password.length >= 6;
  }
};

export default authService;