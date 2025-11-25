// src/components/Clientes/ClientesList.jsx - FILTROS MEJORADOS
import React, { useState } from 'react';
import { 
  User, Phone, MapPin, ShoppingCart, Edit, Trash2, MoreVertical, 
  Mail, MessageCircle, Filter, Search, UserCheck, UserX
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const ClientesList = ({ clientes, loading, onEditar, onEliminar, onReactivar }) => {
    const [menuAbierto, setMenuAbierto] = useState(null);
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');

    // Filtrar clientes - CORREGIDO para manejar correctamente activo/inactivo
    const clientesFiltrados = clientes.filter(cliente => {
        const coincideBusqueda = cliente.usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
                               cliente.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
                               cliente.telefono?.includes(busqueda);
        
        // CORRECCIÓN: Manejar correctamente el estado activo/inactivo
        const coincideFiltro = 
            filtro === 'todos' ? true :
            filtro === 'activos' ? cliente.activo === true :
            filtro === 'inactivos' ? cliente.activo === false :
            filtro === 'con_pedidos' ? (cliente.total_pedidos || 0) > 0 : true;
        
        return coincideBusqueda && coincideFiltro;
    });

    // Contadores para estadísticas
    const totalClientes = clientes.length;
    const clientesActivos = clientes.filter(c => c.activo === true).length;
    const clientesInactivos = clientes.filter(c => c.activo === false).length;
    const clientesConPedidos = clientes.filter(c => (c.total_pedidos || 0) > 0).length;

    const toggleMenu = (index) => {
        setMenuAbierto(menuAbierto === index ? null : index);
    };

    const handleEditar = (cliente) => {
        setMenuAbierto(null);
        onEditar(cliente);
    };

    const handleEliminar = (cliente) => {
        setMenuAbierto(null);
        if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente ${cliente.usuario}?`)) {
            onEliminar(cliente.id);
        }
    };

    const handleReactivar = (cliente) => {
        setMenuAbierto(null);
        if (window.confirm(`¿Estás seguro de que quieres reactivar al cliente ${cliente.usuario}?`)) {
            onReactivar(cliente.id);
        }
    };

    const getMetodoContactoIcono = (metodo) => {
        switch (metodo) {
            case 'whatsapp': return <MessageCircle className="w-4 h-4 text-green-600" />;
            case 'instagram': return <MessageCircle className="w-4 h-4 text-pink-600" />;
            case 'facebook': return <MessageCircle className="w-4 h-4 text-blue-600" />;
            case 'telefono': return <Phone className="w-4 h-4 text-blue-500" />;
            case 'email': return <Mail className="w-4 h-4 text-gray-600" />;
            default: return <MessageCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getEstadoBadge = (cliente) => {
        if (cliente.activo === false) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <UserX className="w-3 h-3 mr-1" />
                    Inactivo
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Activo
                </span>
            );
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando clientes...</span>
                </div>
            </div>
        );
    }

    if (!clientes || clientes.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
                    <p className="text-gray-500 mb-4">Los clientes aparecerán aquí cuando se registren.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con estadísticas y filtros */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Gestión de Clientes
                        </h3>
                        
                        {/* Estadísticas */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center space-x-1">
                                <span className="font-medium text-gray-900">{totalClientes}</span>
                                <span className="text-gray-600">Total</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <UserCheck className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-700">{clientesActivos}</span>
                                <span className="text-gray-600">Activos</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <UserX className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-700">{clientesInactivos}</span>
                                <span className="text-gray-600">Inactivos</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <ShoppingCart className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-700">{clientesConPedidos}</span>
                                <span className="text-gray-600">Con pedidos</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Búsqueda */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar por usuario, nombre o teléfono..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        {/* Filtros mejorados */}
                        <select
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
                        >
                            <option value="todos">Todos los clientes</option>
                            <option value="activos">Solo activos</option>
                            <option value="inactivos">Solo inactivos</option>
                            <option value="con_pedidos">Con pedidos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Resultados */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">
                        Resultados: {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
                    </h4>
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda('')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>

                {/* Grid de clientes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clientesFiltrados.map((cliente, index) => (
                        <div
                            key={cliente.id}
                            className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 relative border-l-4 ${
                                cliente.activo === false 
                                    ? 'border-l-red-400 opacity-80 bg-gray-50' 
                                    : 'border-l-green-400'
                            }`}
                        >
                            {/* Menu de acciones */}
                            <div className="absolute top-4 right-4">
                                <div className="relative">
                                    <button
                                        onClick={() => toggleMenu(index)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>

                                    {menuAbierto === index && (
                                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                            <button
                                                onClick={() => handleEditar(cliente)}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Editar Cliente</span>
                                            </button>
                                            {cliente.activo === false ? (
                                                <button
                                                    onClick={() => handleReactivar(cliente)}
                                                    className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                    <span>Reactivar Cliente</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEliminar(cliente)}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                    <span>Desactivar Cliente</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Header del card */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${
                                        cliente.activo === false ? 'bg-gray-200' : 'bg-blue-100'
                                    }`}>
                                        <User className={`w-5 h-5 ${
                                            cliente.activo === false ? 'text-gray-500' : 'text-blue-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{cliente.usuario}</h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                {cliente.plataforma}
                                            </span>
                                            {getEstadoBadge(cliente)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información del cliente */}
                            <div className="space-y-2 text-sm text-gray-600">
                                {cliente.nombre_completo && (
                                    <p className="font-medium text-gray-900 truncate">{cliente.nombre_completo}</p>
                                )}
                                
                                {cliente.telefono && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{cliente.telefono}</span>
                                    </div>
                                )}

                                {(cliente.direccion_linea1 || cliente.ciudad) && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">
                                            {cliente.direccion_linea1 && `${cliente.direccion_linea1}`}
                                            {cliente.direccion_linea1 && cliente.ciudad && ', '}
                                            {cliente.ciudad}
                                        </span>
                                    </div>
                                )}

                                {/* Stats del cliente */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                                        <span>{cliente.total_pedidos || 0} pedidos</span>
                                    </div>
                                    <span className="font-semibold text-green-600">
                                        {formatCurrency(cliente.total_gastado || 0)}
                                    </span>
                                </div>

                                {/* Etiquetas adicionales */}
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {(cliente.total_pedidos || 0) > 0 && (
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            Cliente frecuente
                                        </span>
                                    )}
                                    {cliente.direccion_linea1 && (
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            Con dirección
                                        </span>
                                    )}
                                    {cliente.metodo_contacto_preferido && (
                                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                            {cliente.metodo_contacto_preferido}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mensaje si no hay resultados */}
                {clientesFiltrados.length === 0 && clientes.length > 0 && (
                    <div className="text-center py-8">
                        <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
                        <p className="text-gray-500">
                            {busqueda 
                                ? `No hay clientes que coincidan con "${busqueda}"`
                                : `No hay clientes que coincidan con el filtro seleccionado`
                            }
                        </p>
                        <button
                            onClick={() => {
                                setBusqueda('');
                                setFiltro('todos');
                            }}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                            Mostrar todos los clientes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};