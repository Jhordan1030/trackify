// EditarClienteModal.jsx
import React, { useState, useEffect } from 'react';

const EditarClienteModal = ({ cliente, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    plataforma: '',
    nombre_completo: '',
    telefono: '',
    direccion_linea1: '',
    direccion_linea2: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: 'Ecuador',
    metodo_contacto_preferido: '',
    notas: '',
    activo: true
  });

  // Cargar datos del cliente cuando el modal se abre
  useEffect(() => {
    if (cliente) {
      setFormData({
        usuario: cliente.usuario || '',
        plataforma: cliente.plataforma || '',
        nombre_completo: cliente.nombre_completo || '',
        telefono: cliente.telefono || '',
        direccion_linea1: cliente.direccion_linea1 || '',
        direccion_linea2: cliente.direccion_linea2 || '',
        ciudad: cliente.ciudad || '',
        provincia: cliente.provincia || '',
        codigo_postal: cliente.codigo_postal || '',
        pais: cliente.pais || 'Ecuador',
        metodo_contacto_preferido: cliente.metodo_contacto_preferido || '',
        notas: cliente.notas || '',
        activo: cliente.activo !== undefined ? cliente.activo : true
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Limpiar datos antes de enviar (remover campos vacíos)
      const datosLimpiados = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key, 
          value === null || value === undefined ? '' : value
        ])
      );

      console.log('📤 Enviando datos completos al backend:', datosLimpiados);
      
      await onActualizar(cliente.id, datosLimpiados);
      onClose();
    } catch (error) {
      console.error('❌ Error al actualizar cliente:', error);
      alert('Error al actualizar el cliente. Por favor, intenta nuevamente.');
    }
  };

  if (!cliente) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Cliente</h2>
          <button type="button" onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Usuario *</label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Plataforma</label>
              <select
                name="plataforma"
                value={formData.plataforma}
                onChange={handleChange}
              >
                <option value="">Seleccionar plataforma</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="tiktok">TikTok</option>
                <option value="web">Web</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                maxLength={255}
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                maxLength={20}
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección Línea 1</label>
              <input
                type="text"
                name="direccion_linea1"
                value={formData.direccion_linea1}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección Línea 2</label>
              <input
                type="text"
                name="direccion_linea2"
                value={formData.direccion_linea2}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Provincia</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Código Postal</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label>País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Método de Contacto Preferido</label>
              <select
                name="metodo_contacto_preferido"
                value={formData.metodo_contacto_preferido}
                onChange={handleChange}
              >
                <option value="">Seleccionar método</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="telefono">Teléfono</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Notas</label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
                Cliente Activo
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Actualizar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Asegúrate de que tenga export default
export default EditarClienteModal;