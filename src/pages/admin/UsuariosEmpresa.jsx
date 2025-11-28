// src/pages/admin/UsuariosEmpresa.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, RefreshCw, X, Save, ArrowLeft, Shield, UserCheck, UserX } from 'lucide-react';
import api from '../../services/api';

// Modal para crear/editar usuarios
const UsuarioModal = ({ isOpen, onClose, usuario, empresaId, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'admin',
    activo: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roles = [
    { value: 'admin', label: 'Administrador', description: 'Acceso completo a todas las funciones' },
    { value: 'vendedor', label: 'Vendedor', description: 'Puede gestionar ventas y clientes' },
    { value: 'inventario', label: 'Encargado de Inventario', description: 'Puede gestionar productos y stock' },
  ];

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '', // No mostrar password existente
        rol: usuario.rol || 'admin',
        activo: usuario.activo !== undefined ? usuario.activo : true
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'admin',
        activo: true
      });
    }
    setError(null);
  }, [usuario, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Preparar datos en el formato correcto
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        activo: formData.activo,
        empresaId: empresaId
      };
      
      await onSave(userData, usuario?.id);
      onClose();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      setError(error.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="usuario@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {usuario ? 'Nueva Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña *'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!usuario}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol *
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {roles.find(r => r.value === formData.rol)?.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Usuario activo
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UsuariosEmpresa = ({ empresa, onBack }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.auth.getUsersByEmpresa(empresa.id);
      
      // Asegurar que siempre sea un array
      let usuariosData = [];
      if (Array.isArray(response)) {
        usuariosData = response;
      } else if (response && Array.isArray(response.data)) {
        usuariosData = response.data;
      } else if (response && Array.isArray(response.usuarios)) {
        usuariosData = response.usuarios;
      } else {
        usuariosData = response?.usuarios || response?.data?.usuarios || [];
      }
      
      console.log('Usuarios cargados:', usuariosData);
      setUsuarios(usuariosData);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empresa?.id) {
      cargarUsuarios();
    }
  }, [empresa]);

  const handleCrearUsuario = () => {
    setUsuarioEditando(null);
    setModalOpen(true);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setModalOpen(true);
  };

  const handleGuardarUsuario = async (formData, usuarioId) => {
    try {
      if (usuarioId) {
        // Editar usuario existente
        const response = await api.auth.updateUser(usuarioId, formData);
        // Actualizar estado local
        setUsuarios(usuarios.map(user => 
          user.id === usuarioId ? { ...user, ...formData } : user
        ));
      } else {
        // Crear nuevo usuario
        const nuevoUsuario = await api.auth.createUser(formData);
        setUsuarios(prev => [...prev, nuevoUsuario.data || nuevoUsuario]);
      }
    } catch (err) {
      console.error('Error guardando usuario:', err);
      throw new Error(err.message || 'Error al guardar el usuario');
    }
  };

  const handleToggleUsuario = async (usuarioId, activoActual) => {
    if (!usuarioId) {
      console.error('ID de usuario es undefined');
      alert('Error: ID de usuario no válido');
      return;
    }

    try {
      setToggleLoading(usuarioId);
      
      await api.auth.toggleUser(usuarioId);
      
      // Actualizar estado local
      setUsuarios(usuarios.map(usuario =>
        usuario.id === usuarioId 
          ? { ...usuario, activo: !activoActual }
          : usuario
      ));
      
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      alert('Error al actualizar el usuario: ' + err.message);
    } finally {
      setToggleLoading(null);
    }
  };

  const handleEliminarUsuario = async (usuarioId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.auth.deleteUser(usuarioId);
      // Recargar la lista
      cargarUsuarios();
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      alert('Error al eliminar el usuario');
    }
  };

  const getRolInfo = (rol) => {
    const roles = {
      admin: { label: 'Administrador', color: 'bg-purple-100 text-purple-800', icon: Shield },
      vendedor: { label: 'Vendedor', color: 'bg-blue-100 text-blue-800', icon: UserCheck },
      inventario: { label: 'Inventario', color: 'bg-green-100 text-green-800', icon: Users },
    };
    return roles[rol] || { label: rol, color: 'bg-gray-100 text-gray-800', icon: Users };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-3 bg-blue-100 rounded-xl">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-500">Empresa: {empresa.nombre}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={cargarUsuarios}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button 
            onClick={handleCrearUsuario}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => u.activo).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => u.rol === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <UserX className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Usuarios Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => !u.activo).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Usuarios de la Empresa ({usuarios.length})
          </h2>
        </div>
        
        <div className="p-6">
          {usuarios.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios registrados</h3>
              <p className="text-gray-500 mb-4">Comienza agregando el primer usuario para esta empresa</p>
              <button 
                onClick={handleCrearUsuario}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Primer Usuario
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {usuarios.map((usuario) => {
                const rolInfo = getRolInfo(usuario.rol);
                const RolIcon = rolInfo.icon;
                
                return (
                  <div key={usuario.id || `usuario-${usuario.email}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <RolIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{usuario.nombre}</h4>
                        <p className="text-sm text-gray-500">{usuario.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${rolInfo.color}`}>
                            {rolInfo.label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usuario.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {usuario.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditarUsuario(usuario)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleToggleUsuario(usuario.id, usuario.activo)}
                        disabled={toggleLoading === usuario.id || !usuario.id}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                          usuario.activo
                            ? 'text-orange-600 hover:bg-orange-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={usuario.activo ? 'Desactivar usuario' : 'Activar usuario'}
                      >
                        {toggleLoading === usuario.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : usuario.activo ? (
                          'Desactivar'
                        ) : (
                          'Activar'
                        )}
                      </button>

                      <button 
                        onClick={() => handleEliminarUsuario(usuario.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar */}
      <UsuarioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={usuarioEditando}
        empresaId={empresa.id}
        onSave={handleGuardarUsuario}
      />
    </div>
  );
};

export default UsuariosEmpresa;