// src/pages/admin/Empresas.jsx
import React, { useState, useEffect } from 'react';
import { Building, Plus, Users, Settings, Edit, Trash2, RefreshCw, X, Save, LogIn } from 'lucide-react';
import { empresasAPI } from '../../services/api';
import UsuariosEmpresa from './UsuariosEmpresa';

// Modal para crear/editar empresas
const EmpresaModal = ({ isOpen, onClose, empresa, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ruc: '',
    activo: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (empresa) {
      setFormData({
        nombre: empresa.nombre || '',
        email: empresa.email || '',
        telefono: empresa.telefono || '',
        direccion: empresa.direccion || '',
        ruc: empresa.ruc || '',
        activo: empresa.activo !== undefined ? empresa.activo : true
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ruc: '',
        activo: true
      });
    }
    setError('');
  }, [empresa, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (empresa?.id) {
        // Editar empresa existente
        await empresasAPI.updateEmpresa(empresa.id, formData);
      } else {
        // Crear nueva empresa
        await empresasAPI.createEmpresa(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error('Error guardando empresa:', err);
      setError(err.message || 'Error al guardar la empresa');
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {empresa ? 'Editar Empresa' : 'Nueva Empresa'}
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
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa el nombre de la empresa"
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
              placeholder="email@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+593 123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dirección completa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUC
            </label>
            <input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1234567890001"
            />
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
              Empresa activa
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 transition-colors"
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

const AdminEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await empresasAPI.getEmpresas();
      
      // Manejar diferentes estructuras de respuesta
      let empresasData = [];
      if (Array.isArray(response)) {
        empresasData = response;
      } else if (response && Array.isArray(response.data)) {
        empresasData = response.data;
      } else {
        empresasData = response?.data || response?.empresas || [];
      }
      
      console.log('Empresas cargadas:', empresasData);
      setEmpresas(empresasData);
    } catch (err) {
      console.error('Error cargando empresas:', err);
      setError(err.message || 'Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const handleCrearEmpresa = () => {
    setEmpresaEditando(null);
    setModalOpen(true);
  };

  const handleEditarEmpresa = (empresa) => {
    setEmpresaEditando(empresa);
    setModalOpen(true);
  };

  const handleIngresarEmpresa = (empresa) => {
    setEmpresaSeleccionada(empresa);
  };

  const handleGuardarEmpresa = async () => {
    await cargarEmpresas();
  };

  const handleToggleEmpresa = async (empresaId, activoActual) => {
    if (!empresaId) {
      console.error('ID de empresa es undefined');
      alert('Error: ID de empresa no válido');
      return;
    }

    try {
      setToggleLoading(empresaId);
      await empresasAPI.toggleEmpresaStatus(empresaId);
      
      // Actualizar estado local
      setEmpresas(empresas.map(empresa =>
        empresa.id === empresaId 
          ? { ...empresa, activo: !activoActual }
          : empresa
      ));
      
    } catch (err) {
      console.error('Error actualizando empresa:', err);
      alert('Error al actualizar la empresa: ' + err.message);
    } finally {
      setToggleLoading(null);
    }
  };

  // Si hay una empresa seleccionada, mostrar la gestión de usuarios
  if (empresaSeleccionada) {
    return (
      <UsuariosEmpresa 
        empresa={empresaSeleccionada}
        onBack={() => setEmpresaSeleccionada(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando empresas...</p>
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      id: 1,
      icon: Building,
      title: 'Total Empresas',
      value: empresas.length,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 2,
      icon: Users,
      title: 'Empresas Activas',
      value: empresas.filter(e => e.activo).length,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 3,
      icon: Settings,
      title: 'Empresas Inactivas',
      value: empresas.filter(e => !e.activo).length,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
            <p className="text-gray-500">Administra las empresas del sistema</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={cargarEmpresas}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button 
            onClick={handleCrearEmpresa}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Empresa</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={cargarEmpresas}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map(stat => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de empresas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Empresas Registradas ({empresas.length})
          </h2>
        </div>
        
        <div className="p-6">
          {empresas.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empresas registradas</h3>
              <p className="text-gray-500 mb-4">Comienza agregando tu primera empresa al sistema</p>
              <button 
                onClick={handleCrearEmpresa}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Primera Empresa
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{empresa.nombre}</h4>
                      <p className="text-sm text-gray-500">{empresa.email}</p>
                      <p className="text-xs text-gray-400">
                        {empresa.direccion} • {empresa.telefono}
                        {empresa.ruc && ` • RUC: ${empresa.ruc}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      empresa.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {empresa.activo ? 'Activa' : 'Inactiva'}
                    </span>
                    
                    <button 
                      onClick={() => handleIngresarEmpresa(empresa)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                      title="Gestionar usuarios de esta empresa"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Usuarios</span>
                    </button>
                    
                    <button 
                      onClick={() => handleEditarEmpresa(empresa)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar empresa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => handleToggleEmpresa(empresa.id, empresa.activo)}
                      disabled={toggleLoading === empresa.id}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        empresa.activo
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={empresa.activo ? 'Desactivar empresa' : 'Activar empresa'}
                    >
                      {toggleLoading === empresa.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : empresa.activo ? (
                        'Desactivar'
                      ) : (
                        'Activar'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar */}
      <EmpresaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        empresa={empresaEditando}
        onSave={handleGuardarEmpresa}
      />
    </div>
  );
};

export default AdminEmpresas;