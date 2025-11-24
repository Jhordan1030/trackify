// src/components/Inventario/CrearProductoModal.jsx - CON VARIACIONES MEJORADO
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ChevronDown, Upload } from 'lucide-react';

const CrearProductoModal = ({ isOpen, onClose, onCrearProducto, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo_producto: '',
    categoria: '',
    descripcion: '',
    precio_venta: '',
    stock_minimo: '5',
    stock_inicial: '0'
  });

  const [showCategoriasDropdown, setShowCategoriasDropdown] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarInputNuevaCategoria, setMostrarInputNuevaCategoria] = useState(false);
  const [errorDetallado, setErrorDetallado] = useState('');
  const [variaciones, setVariaciones] = useState([]);
  const [mostrarVariaciones, setMostrarVariaciones] = useState(false);

  // Lista de categorías predefinidas con IDs exactos y configuración de variaciones
  const categorias = [
    { id: 1, nombre: 'Ropa', necesitaVariaciones: true, tiposVariacion: ['Talla', 'Color'] },
    { id: 2, nombre: 'Calzado', necesitaVariaciones: true, tiposVariacion: ['Talla'] },
    { id: 3, nombre: 'Accesorios', necesitaVariaciones: true, tiposVariacion: ['Color', 'Material'] },
    { id: 4, nombre: 'Electrónicos', necesitaVariaciones: false },
    { id: 5, nombre: 'Hogar', necesitaVariaciones: false },
    { id: 6, nombre: 'Belleza', necesitaVariaciones: false },
    { id: 7, nombre: 'Deportes', necesitaVariaciones: true, tiposVariacion: ['Talla', 'Color'] },
    { id: 8, nombre: 'Juguetes', necesitaVariaciones: false },
    { id: 9, nombre: 'Libros', necesitaVariaciones: false },
    { id: 10, nombre: 'Otros', necesitaVariaciones: false }
  ];

  // Mapeo de categorías a IDs
  const categoriasMap = {
    'Ropa': 1,
    'Calzado': 2,
    'Accesorios': 3,
    'Electrónicos': 4,
    'Hogar': 5,
    'Belleza': 6,
    'Deportes': 7,
    'Juguetes': 8,
    'Libros': 9,
    'Otros': 10
  };

  // Valores predefinidos para variaciones comunes
  const valoresPredefinidos = {
    'Talla': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'Talla Calzado': ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    'Color': ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Rosa', 'Morado', 'Gris', 'Beige', 'Marrón'],
    'Material': ['Algodón', 'Poliéster', 'Lino', 'Seda', 'Cuero', 'Jean', 'Lana', 'Sintético'],
    'Modelo': ['Básico', 'Premium', 'Deportivo', 'Elegante', 'Casual', 'Formal']
  };

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombre: '',
        codigo_producto: '',
        categoria: '',
        descripcion: '',
        precio_venta: '',
        stock_minimo: '5',
        stock_inicial: '0'
      });
      setNuevaCategoria('');
      setMostrarInputNuevaCategoria(false);
      setShowCategoriasDropdown(false);
      setErrorDetallado('');
      setVariaciones([]);
      setMostrarVariaciones(false);
    }
  }, [isOpen]);

  // Efecto para mostrar/ocultar sección de variaciones según categoría
  useEffect(() => {
    if (formData.categoria) {
      const categoriaSeleccionada = categorias.find(cat => cat.nombre === formData.categoria);
      setMostrarVariaciones(categoriaSeleccionada?.necesitaVariaciones || false);
      
      // Si la categoría necesita variaciones, agregar variaciones por defecto
      if (categoriaSeleccionada?.necesitaVariaciones && variaciones.length === 0) {
        const variacionesIniciales = [];
        
        if (formData.categoria === 'Ropa' || formData.categoria === 'Deportes') {
          variacionesIniciales.push(
            { 
              tipo: 'Talla', 
              valores: ['S', 'M', 'L', 'XL'],
              valoresPredefinidos: valoresPredefinidos['Talla']
            },
            { 
              tipo: 'Color', 
              valores: ['Negro', 'Blanco'],
              valoresPredefinidos: valoresPredefinidos['Color']
            }
          );
        } else if (formData.categoria === 'Calzado') {
          variacionesIniciales.push(
            { 
              tipo: 'Talla', 
              valores: ['38', '39', '40', '41', '42'],
              valoresPredefinidos: valoresPredefinidos['Talla Calzado']
            }
          );
        } else if (formData.categoria === 'Accesorios') {
          variacionesIniciales.push(
            { 
              tipo: 'Color', 
              valores: ['Negro', 'Blanco', 'Rojo'],
              valoresPredefinidos: valoresPredefinidos['Color']
            }
          );
        }
        
        setVariaciones(variacionesIniciales);
      }
    }
  }, [formData.categoria]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoriaSelect = (categoriaNombre) => {
    console.log('🎯 Categoría seleccionada:', categoriaNombre);
    console.log('🔢 ID mapeado:', categoriasMap[categoriaNombre]);
    
    setFormData(prev => ({
      ...prev,
      categoria: categoriaNombre
    }));
    setShowCategoriasDropdown(false);
    setMostrarInputNuevaCategoria(false);
  };

  const handleAgregarNuevaCategoria = () => {
    if (nuevaCategoria.trim()) {
      setFormData(prev => ({
        ...prev,
        categoria: nuevaCategoria.trim()
      }));
      setNuevaCategoria('');
      setMostrarInputNuevaCategoria(false);
      setShowCategoriasDropdown(false);
    }
  };

  // Manejo de variaciones
  const agregarVariacion = () => {
    setVariaciones(prev => [...prev, { tipo: '', valores: [], valoresPredefinidos: [] }]);
  };

  const eliminarVariacion = (index) => {
    setVariaciones(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariacionChange = (index, field, value) => {
    const updatedVariaciones = [...variaciones];
    
    if (field === 'tipo') {
      updatedVariaciones[index].tipo = value;
      // Cargar valores predefinidos cuando se selecciona un tipo
      if (value && valoresPredefinidos[value]) {
        updatedVariaciones[index].valoresPredefinidos = valoresPredefinidos[value];
      } else {
        updatedVariaciones[index].valoresPredefinidos = [];
      }
    } else if (field === 'valores') {
      // Convertir string separado por comas a array
      updatedVariaciones[index].valores = value.split(',').map(v => v.trim()).filter(v => v);
    }
    
    setVariaciones(updatedVariaciones);
  };

  const agregarValorPredefinido = (variacionIndex, valor) => {
    if (valor.trim() && !variaciones[variacionIndex].valores.includes(valor.trim())) {
      const updatedVariaciones = [...variaciones];
      updatedVariaciones[variacionIndex].valores = [...updatedVariaciones[variacionIndex].valores, valor.trim()];
      setVariaciones(updatedVariaciones);
    }
  };

  const eliminarValorVariacion = (variacionIndex, valorIndex) => {
    const updatedVariaciones = [...variaciones];
    updatedVariaciones[variacionIndex].valores = updatedVariaciones[variacionIndex].valores.filter((_, i) => i !== valorIndex);
    setVariaciones(updatedVariaciones);
  };

  const agregarValorPersonalizado = (variacionIndex, valor) => {
    if (valor.trim() && !variaciones[variacionIndex].valores.includes(valor.trim())) {
      const updatedVariaciones = [...variaciones];
      updatedVariaciones[variacionIndex].valores = [...updatedVariaciones[variacionIndex].valores, valor.trim()];
      setVariaciones(updatedVariaciones);
    }
  };

  const validarFormulario = () => {
    const errores = [];

    if (!formData.nombre.trim()) errores.push('El nombre es obligatorio');
    if (!formData.codigo_producto.trim()) errores.push('El código de producto es obligatorio');
    if (!formData.categoria.trim()) errores.push('La categoría es obligatoria');
    if (!formData.precio_venta || isNaN(parseFloat(formData.precio_venta))) {
      errores.push('El precio de venta debe ser un número válido');
    }
    if (parseFloat(formData.precio_venta) < 0) {
      errores.push('El precio de venta no puede ser negativo');
    }

    // Validar variaciones si la categoría las necesita
    const categoriaSeleccionada = categorias.find(cat => cat.nombre === formData.categoria);
    if (categoriaSeleccionada?.necesitaVariaciones) {
      if (variaciones.length === 0) {
        errores.push('Esta categoría requiere al menos una variación (talla, color, etc.)');
      } else {
        variaciones.forEach((variacion, index) => {
          if (!variacion.tipo.trim()) {
            errores.push(`La variación ${index + 1} necesita un tipo (ej: Talla, Color)`);
          }
          if (variacion.valores.length === 0) {
            errores.push(`La variación ${index + 1} necesita al menos un valor`);
          }
        });
      }
    }

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorDetallado('');
    
    // Validaciones
    const errores = validarFormulario();
    if (errores.length > 0) {
      setErrorDetallado(errores.join('\n'));
      return;
    }

    // Obtener categoriaId del mapeo
    const categoriaId = categoriasMap[formData.categoria];
    
    if (!categoriaId) {
      setErrorDetallado(`Error: No se encontró ID para la categoría "${formData.categoria}"`);
      return;
    }

    // Preparar datos EXACTAMENTE como los espera el backend
    const productoData = {
      categoriaId: categoriaId,
      codigoProducto: formData.codigo_producto.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || '',
      precioVenta: parseFloat(formData.precio_venta),
      stockInicial: parseInt(formData.stock_inicial) || 0,
      stockMinimo: parseInt(formData.stock_minimo) || 5,
    };

    // Incluir variaciones si existen
    if (variaciones.length > 0) {
      productoData.tipoInventario = 'con_variaciones';
      productoData.variacion = variaciones.reduce((acc, variacion) => {
        acc[variacion.tipo.toLowerCase()] = variacion.valores;
        return acc;
      }, {});
    }

    console.log('🔍 VALIDACIÓN FINAL - Datos a enviar:', {
      ...productoData,
      categoriaSeleccionada: formData.categoria,
      categoriaId: categoriaId,
      tipoPrecioVenta: typeof productoData.precioVenta,
      valorPrecioVenta: productoData.precioVenta,
      variaciones: variaciones
    });

    try {
      await onCrearProducto(productoData);
    } catch (error) {
      setErrorDetallado(`Error del servidor: ${error.message}\n\nPor favor, verifica los datos e intenta nuevamente.`);
    }
  };

  const categoriaSeleccionada = categorias.find(cat => cat.nombre === formData.categoria);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Producto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Mensajes de Error */}
            {errorDetallado && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800 text-sm mb-2">
                      Errores encontrados:
                    </h4>
                    <div className="text-red-700 text-sm whitespace-pre-line">
                      {errorDetallado}
                    </div>
                  </div>
                  <button
                    onClick={() => setErrorDetallado('')}
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Información Básica del Producto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Camiseta Básica"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Producto *
                </label>
                <input
                  type="text"
                  name="codigo_producto"
                  value={formData.codigo_producto}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: CAM-BAS-001"
                  required
                />
              </div>

              {/* SELECT DE CATEGORÍA */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategoriasDropdown(!showCategoriasDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
                  >
                    <span className={formData.categoria ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.categoria || 'Seleccionar categoría'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCategoriasDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown de categorías */}
                  {showCategoriasDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {categorias.map((categoria) => (
                        <button
                          key={categoria.id}
                          type="button"
                          onClick={() => handleCategoriaSelect(categoria.nombre)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span>{categoria.nombre}</span>
                              {categoria.necesitaVariaciones && (
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  Tallas/Colores
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              ID: {categoria.id}
                            </span>
                          </div>
                        </button>
                      ))}
                      
                      <div className="border-t border-gray-200"></div>
                      
                      {!mostrarInputNuevaCategoria ? (
                        <button
                          type="button"
                          onClick={() => setMostrarInputNuevaCategoria(true)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 text-blue-600 font-medium"
                        >
                          + Agregar nueva categoría
                        </button>
                      ) : (
                        <div className="p-2 border-t border-gray-200">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={nuevaCategoria}
                              onChange={(e) => setNuevaCategoria(e.target.value)}
                              placeholder="Nueva categoría..."
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={handleAgregarNuevaCategoria}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              OK
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMostrarInputNuevaCategoria(false);
                                setNuevaCategoria('');
                              }}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {formData.categoria && (
                  <p className="text-xs text-gray-500 mt-1">
                    Categoría seleccionada: <span className="font-medium">{formData.categoria}</span>
                    {categoriasMap[formData.categoria] && (
                      <span className="ml-2 text-gray-400">(ID: {categoriasMap[formData.categoria]})</span>
                    )}
                    {categoriaSeleccionada?.necesitaVariaciones && (
                      <span className="ml-2 text-blue-600">• Requiere tallas/colores</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Base ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precio_venta"
                  value={formData.precio_venta}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Inicial
                </label>
                <input
                  type="number"
                  name="stock_inicial"
                  value={formData.stock_inicial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  name="stock_minimo"
                  value={formData.stock_minimo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción del producto..."
              />
            </div>

            {/* Sección de Variaciones */}
            {mostrarVariaciones && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Variaciones</h3>
                    <p className="text-sm text-gray-600">
                      Define las tallas, colores u otras variaciones para este producto
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={agregarVariacion}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Variación</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {variaciones.map((variacion, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Variación {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => eliminarVariacion(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Variación *
                          </label>
                          <select
                            value={variacion.tipo}
                            onChange={(e) => handleVariacionChange(index, 'tipo', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Seleccionar tipo</option>
                            {categoriaSeleccionada?.tiposVariacion?.map(tipo => (
                              <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                            <option value="Talla">Talla</option>
                            <option value="Color">Color</option>
                            <option value="Material">Material</option>
                            <option value="Modelo">Modelo</option>
                            <option value="Estilo">Estilo</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valores (separados por coma) *
                          </label>
                          <input
                            type="text"
                            value={variacion.valores.join(', ')}
                            onChange={(e) => handleVariacionChange(index, 'valores', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: S, M, L, XL o Rojo, Azul, Verde"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Separa los valores con comas
                          </p>
                        </div>
                      </div>

                      {/* Valores Predefinidos */}
                      {variacion.valoresPredefinidos.length > 0 && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valores predefinidos:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {variacion.valoresPredefinidos.map((valor, valorIndex) => (
                              <button
                                key={valorIndex}
                                type="button"
                                onClick={() => agregarValorPredefinido(index, valor)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  variacion.valores.includes(valor)
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                              >
                                {valor} {variacion.valores.includes(valor) && '✓'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Agregar valor personalizado */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Agregar valor personalizado:
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Nuevo valor..."
                            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                agregarValorPersonalizado(index, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.target.previousElementSibling;
                              agregarValorPersonalizado(index, input.value);
                              input.value = '';
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Agregar
                          </button>
                        </div>
                      </div>

                      {/* Mostrar valores actuales */}
                      {variacion.valores.length > 0 && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valores definidos ({variacion.valores.length}):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {variacion.valores.map((valor, valorIndex) => (
                              <span
                                key={valorIndex}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                              >
                                {valor}
                                <button
                                  type="button"
                                  onClick={() => eliminarValorVariacion(index, valorIndex)}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {variaciones.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No hay variaciones definidas. Agrega al menos una variación.</p>
                  </div>
                )}
              </div>
            )}

            {/* Información sobre SKU automático */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 text-sm">
                    SKU Automático
                  </h4>
                  <p className="text-blue-700 text-xs mt-1">
                    El sistema generará automáticamente códigos SKU únicos para cada combinación de variaciones.
                    {mostrarVariaciones && variaciones.length > 0 && (
                      <span className="block mt-1 font-medium">
                        Se crearán SKUs para: {variaciones.map(v => `${v.tipo} (${v.valores.length} opciones)`).join(' + ')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{loading ? 'Creando...' : 'Crear Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearProductoModal;