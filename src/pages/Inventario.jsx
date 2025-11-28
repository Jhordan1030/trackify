// src/pages/Inventario.jsx
import React, { useState, useEffect } from 'react';
import { Package, Plus, Upload, Edit, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarInventario = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.inventario.getInventario();

      let inventarioData = [];
      if (Array.isArray(response)) {
        inventarioData = response;
      } else if (response && Array.isArray(response.data)) {
        inventarioData = response.data;
      } else {
        inventarioData = response?.data || [];
      }

      setInventario(inventarioData);
    } catch (err) {
      console.error('Error cargando inventario:', err);
      setError(err.message || 'Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const productosConStockBajo = inventario.filter(
    producto => (producto.stock_disponible || producto.stock) <= (producto.stock_minimo || 5)
  );

  const handleEliminarProducto = async (productoId) => {
    if (!window.confirm('¿Estás seguro de que quieres desactivar este producto?')) {
      return;
    }

    try {
      await api.inventario.deleteProducto(productoId);
      cargarInventario();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('Error al desactivar el producto: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando inventario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
            <p className="text-gray-500">
              {inventario.length} producto{inventario.length !== 1 ? 's' : ''} en stock
            </p>
          </div>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>
          <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={cargarInventario}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {productosConStockBajo.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <h4 className="font-semibold text-orange-800">Stock Bajo</h4>
              <p className="text-orange-700 text-sm">
                {productosConStockBajo.length} producto{productosConStockBajo.length !== 1 ? 's' : ''} con stock por debajo del mínimo
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
            <button
              onClick={cargarInventario}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {inventario.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
              <p className="text-gray-500 mb-4">Comienza agregando tu primer producto al inventario</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Crear Primer Producto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventario.map((producto) => (
                <div key={producto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 truncate pr-2">
                      {producto.nombre || producto.producto_nombre}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${producto.activo !== false
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {producto.activo !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    SKU: {producto.sku || producto.sku_codigo || producto.codigo}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {producto.categoria || 'Sin categoría'}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        ${(producto.precio_venta || producto.precio)?.toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${(producto.stock_disponible || producto.stock) <= (producto.stock_minimo || 5)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                      }`}>
                      Stock: {producto.stock_disponible || producto.stock}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center space-x-1">
                      <Edit className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleEliminarProducto(producto.id || producto.producto_id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventario;