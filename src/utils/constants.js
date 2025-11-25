// src/utils/constants.js
export const PLATAFORMAS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'otro', label: 'Otro' }
];

export const METODOS_CONTACTO = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'llamada', label: 'Llamada' },
  { value: 'mensaje_plataforma', label: 'Mensaje en Plataforma' },
  { value: 'email', label: 'Email' },
];

export const ESTADOS_PEDIDO = {
  pendiente_contacto: { label: 'Pendiente Contacto', color: 'warning' },
  pendiente_pago: { label: 'Pendiente Pago', color: 'warning' },
  pago_confirmado: { label: 'Pago Confirmado', color: 'success' },
  empaquetado: { label: 'Empaquetado', color: 'info' },
  enviado: { label: 'Enviado', color: 'primary' },
  entregado: { label: 'Entregado', color: 'success' },
  cancelado: { label: 'Cancelado', color: 'danger' },
  devuelto: { label: 'Devuelto', color: 'danger' },
};

export const TIPOS_MOVIMIENTO = {
  entrada_compra: 'Entrada por Compra',
  entrada_devolucion: 'Entrada por Devolución',
  salida_venta: 'Salida por Venta',
  salida_ajuste: 'Salida por Ajuste',
  reserva: 'Reserva',
  liberacion_reserva: 'Liberación de Reserva',
};

export const CATEGORIAS = [
  { id: 1, nombre: 'Ropa' },
  { id: 2, nombre: 'Calzado' },
  { id: 3, nombre: 'Accesorios' },
  { id: 4, nombre: 'Electrónicos' },
  { id: 5, nombre: 'Hogar' },
  { id: 6, nombre: 'Belleza' },
  { id: 7, nombre: 'Deportes' },
];