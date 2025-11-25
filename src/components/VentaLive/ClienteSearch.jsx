import { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, User, ChevronDown, X, CheckCircle, Globe } from 'lucide-react';
import api from '../../services/api';
import { debounce } from '../../utils/helpers';
import { PLATAFORMAS } from '../../utils/constants';

export const ClienteSearch = ({ value, onChange, onClienteSelect, plataforma, onPlataformaChange }) => {
  const [clientes, setClientes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showPlataformaModal, setShowPlataformaModal] = useState(false);

  // Búsqueda debounced de clientes - MEJORADA
  const debouncedSearch = useCallback(
    debounce(async (search) => {
      if (!search.trim()) {
        setClientes([]);
        return;
      }

      setIsSearching(true);
      try {
        console.log('🔍 Buscando clientes:', search, 'Plataforma:', plataforma);
        
        // Parámetros de búsqueda mejorados
        const params = {
          search: search.trim(),
          limit: 10
        };

        // Si hay plataforma seleccionada, agregarla al filtro
        if (plataforma && plataforma !== 'tiktok') {
          params.plataforma = plataforma;
        }

        const response = await api.clientes.listar(params);
        
        console.log('✅ Respuesta completa:', response);
        
        // CORRECCIÓN: Extraer el array de clientes de response.data
        const clientesData = response?.data || [];
        console.log('✅ Clientes filtrados:', clientesData);
        
        setClientes(clientesData);
      } catch (error) {
        console.error('❌ Error buscando clientes:', error);
        setClientes([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [plataforma]
  );

  useEffect(() => {
    if (showDropdown && searchTerm) {
      debouncedSearch(searchTerm);
    } else if (showDropdown && !searchTerm) {
      setClientes([]);
    }
  }, [searchTerm, showDropdown, debouncedSearch]);

  // Cargar cliente si ya hay uno seleccionado
  useEffect(() => {
    if (value && value !== '') {
      setClienteSeleccionado({ usuario: value });
    }
  }, [value]);

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setSearchTerm('');
    setShowDropdown(false);
    setClientes([]);
    
    if (onChange) onChange(cliente.usuario);
    if (onClienteSelect) onClienteSelect(cliente);
  };

  const crearNuevoCliente = () => {
    if (!searchTerm.trim()) return;
    
    // Si no hay plataforma seleccionada, mostrar modal para seleccionar
    if (!plataforma) {
      setShowPlataformaModal(true);
      return;
    }
    
    const nuevoCliente = {
      usuario: searchTerm.trim(),
      plataforma: plataforma,
      esNuevo: true
    };
    
    seleccionarCliente(nuevoCliente);
  };

  const crearNuevoClienteConPlataforma = (plataformaSeleccionada) => {
    if (!searchTerm.trim()) return;
    
    const nuevoCliente = {
      usuario: searchTerm.trim(),
      plataforma: plataformaSeleccionada,
      esNuevo: true
    };
    
    if (onPlataformaChange) {
      onPlataformaChange(plataformaSeleccionada);
    }
    
    seleccionarCliente(nuevoCliente);
    setShowPlataformaModal(false);
  };

  const limpiarSeleccion = () => {
    setClienteSeleccionado(null);
    setSearchTerm('');
    if (onChange) onChange('');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setSearchTerm('');
      setClientes([]);
    }
  };

  // CORRECCIÓN: Verificar que clientes sea un array antes de usar .some()
  const puedeCrearCliente = searchTerm.trim() && 
    Array.isArray(clientes) && 
    !clientes.some(cliente => 
      cliente.usuario?.toLowerCase() === searchTerm.trim().toLowerCase() &&
      cliente.plataforma === plataforma
    );

  const getPlataformaLabel = (valor) => {
    const plataformaObj = PLATAFORMAS.find(p => p.value === valor);
    return plataformaObj ? plataformaObj.label : valor;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cliente *
      </label>
      
      <div className="relative">
        {clienteSeleccionado ? (
          <div className="flex items-center justify-between p-3 border border-green-300 rounded-lg bg-green-50">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  {clienteSeleccionado.usuario}
                </p>
                {clienteSeleccionado.nombre && (
                  <p className="text-xs text-green-700">
                    {clienteSeleccionado.nombre}
                  </p>
                )}
                <p className="text-xs text-green-600">
                  {clienteSeleccionado.esNuevo ? 'Nuevo cliente' : `Plataforma: ${getPlataformaLabel(clienteSeleccionado.plataforma) || 'No especificada'}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={limpiarSeleccion}
              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-500">
              {plataforma ? `Buscar en ${getPlataformaLabel(plataforma)}...` : 'Buscar cliente por usuario...'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Dropdown de búsqueda */}
        {showDropdown && !clienteSeleccionado && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Header con plataforma */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {plataforma ? `Buscando en ${getPlataformaLabel(plataforma)}` : 'Todas las plataformas'}
                  </span>
                </div>
                {plataforma && (
                  <button
                    onClick={() => onPlataformaChange && onPlataformaChange('')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Cambiar
                  </button>
                )}
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={plataforma ? `Buscar en ${getPlataformaLabel(plataforma)}...` : "Buscar en todas las plataformas..."}
                  autoFocus
                />
              </div>
            </div>

            {/* Resultados */}
            <div className="max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Buscando...</span>
                </div>
              ) : Array.isArray(clientes) && clientes.length > 0 ? (
                <div>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-600">
                      {clientes.length} cliente(s) encontrado(s)
                    </p>
                  </div>
                  {clientes.map((cliente) => (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() => seleccionarCliente(cliente)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {cliente.usuario}
                          </p>
                          {cliente.nombre && (
                            <p className="text-xs text-gray-600 truncate">
                              {cliente.nombre}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {getPlataformaLabel(cliente.plataforma)}
                            </span>
                            {cliente.ultimo_pedido && (
                              <span className="text-xs text-gray-500">
                                Último pedido: {new Date(cliente.ultimo_pedido).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchTerm ? (
                <div>
                  {/* Opción para crear nuevo cliente */}
                  {puedeCrearCliente && (
                    <button
                      type="button"
                      onClick={crearNuevoCliente}
                      className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <UserPlus className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Crear nuevo cliente: "{searchTerm}"
                          </p>
                          <p className="text-xs text-gray-500">
                            {plataforma 
                              ? `En plataforma: ${getPlataformaLabel(plataforma)}`
                              : 'Selecciona una plataforma'
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {/* Mensaje de no resultados */}
                  <div className="px-4 py-6 text-center">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No se encontraron clientes para "{searchTerm}"
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {plataforma 
                        ? `en ${getPlataformaLabel(plataforma)}`
                        : 'en ninguna plataforma'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {plataforma 
                      ? `Escribe para buscar clientes en ${getPlataformaLabel(plataforma)}`
                      : 'Escribe el usuario para buscar clientes'
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Si el cliente no existe, podrás crearlo automáticamente
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal para seleccionar plataforma al crear nuevo cliente */}
        {showPlataformaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Seleccionar Plataforma
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Selecciona la plataforma para el nuevo cliente "{searchTerm}"
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {PLATAFORMAS.map((platform) => (
                  <button
                    key={platform.value}
                    onClick={() => crearNuevoClienteConPlataforma(platform.value)}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                  >
                    <p className="text-sm font-medium text-gray-900">{platform.label}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPlataformaModal(false)}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Overlay para cerrar */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      {/* Información de ayuda */}
      {!clienteSeleccionado && (
        <p className="text-xs text-gray-500 mt-1">
          {plataforma 
            ? `Buscando en ${getPlataformaLabel(plataforma)}. Si no existe, se creará automáticamente.`
            : 'Busca por usuario. Selecciona una plataforma para filtrar.'
          }
        </p>
      )}
    </div>
  );
};