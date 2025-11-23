// src/components/Clientes/ClientesList.jsx
import React, { useState } from 'react';
import { User, Phone, MapPin, ShoppingCart, Edit, Trash2, MoreVertical } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const ClientesList = ({ clientes, loading, onEditar, onEliminar }) => {
    const [menuAbierto, setMenuAbierto] = useState(null);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!clientes || clientes.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
                    <p className="text-gray-500">Los clientes aparecerán aquí cuando se registren.</p>
                </div>
            </div>
        );
    }

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

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Lista de Clientes ({clientes.length})
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientes.map((cliente, index) => (
                    <div
                        key={cliente.id}
                        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 relative"
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
                                        <button
                                            onClick={() => handleEliminar(cliente)}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Eliminar Cliente</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{cliente.usuario}</h4>
                                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                        {cliente.plataforma}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            {cliente.nombre_completo && (
                                <p className="font-medium text-gray-900">{cliente.nombre_completo}</p>
                            )}
                            
                            {cliente.telefono && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{cliente.telefono}</span>
                                </div>
                            )}

                            {cliente.ciudad && (
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{cliente.ciudad}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                                    <span>{cliente.total_pedidos || 0} pedidos</span>
                                </div>
                                <span className="font-semibold text-green-600">
                                    {formatCurrency(cliente.total_gastado || 0)}
                                </span>
                            </div>

                            {cliente.activo === false && (
                                <div className="mt-2">
                                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                        Inactivo
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};