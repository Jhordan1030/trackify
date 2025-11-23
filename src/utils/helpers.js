import { ESTADOS_PEDIDO } from './constants';

// NUEVA FUNCIÓN AGREGADA - Calcular subtotal de items
export const calculateTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    const cantidad = parseInt(item.cantidad) || 0;
    const precio = parseFloat(item.precioUnitario) || 0;
    return total + (cantidad * precio);
  }, 0);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getEstadoConfig = (estado) => {
  return ESTADOS_PEDIDO[estado] || { label: estado, color: 'gray' };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9+\-\s()]{10,}$/;
  return re.test(phone);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateSkuCode = (baseCode) => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${baseCode}-${random}`;
};