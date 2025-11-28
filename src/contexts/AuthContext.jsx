// src/contexts/AuthContext.jsx - DEMO VERSION
// BYPASSES AUTHENTICATION - AUTO LOGINS AS SUPER ADMIN

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-login for demo
  useEffect(() => {
    const initDemo = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Get mock profile
        const response = await authAPI.getProfile();
        if (response.success) {
          console.log('🚀 Demo Mode: Auto-logged in as', response.data.nombre);
          setUser(response.data);
        }
      } catch (err) {
        console.error('Demo init error:', err);
        setError('Error iniciando modo demo');
      } finally {
        setLoading(false);
      }
    };

    initDemo();
  }, []);

  const login = async (email, password) => {
    // Always succeed in demo
    const response = await authAPI.login(email, password);
    if (response.success) {
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    }
    return response;
  };

  const logout = async () => {
    // Reload page to reset demo state
    window.location.reload();
  };

  const refreshUser = async () => {
    const response = await authAPI.getProfile();
    if (response.success) {
      setUser(response.data);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    refreshUser,
    isAuthenticated: !!user, // Simple check for demo
    isSuperAdmin: user?.rol === 'super_admin',
    isAdmin: user?.rol === 'admin' || user?.rol === 'super_admin',
    empresaId: user?.empresaId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};