// src/components/Inventario/ImportarExcelModal.jsx
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download, Loader } from 'lucide-react';
import * as XLSX from 'xlsx';

const ImportarExcelModal = ({ isOpen, onClose, onImportarProductos, loading }) => {
  const [archivo, setArchivo] = useState(null);
  const [datosProcesados, setDatosProcesados] = useState([]);
  const [errores, setErrores] = useState([]);
  const [pasoActual, setPasoActual] = useState(1);
  const [procesando, setProcesando] = useState(false);
  const fileInputRef = useRef(null);

  const categoriasDisponibles = [
    'Ropa', 'Calzado', 'Accesorios', 'Electrónicos', 'Hogar', 
    'Belleza', 'Deportes', 'Juguetes', 'Libros', 'Otros'
  ];

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

  const categoriasConVariaciones = ['Ropa', 'Calzado', 'Accesorios', 'Deportes'];

  if (!isOpen) return null;

  const resetModal = () => {
    setArchivo(null);
    setDatosProcesados([]);
    setErrores([]);
    setPasoActual(1);
    setProcesando(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleArchivoSeleccionado = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📁 Archivo seleccionado:', file.name);
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrores(['Por favor, sube un archivo Excel válido (.xlsx o .xls)']);
      return;
    }

    setArchivo(file);
    setProcesando(true);
    
    try {
      await procesarArchivoExcel(file);
    } catch (error) {
      console.error('❌ Error procesando archivo:', error);
      setErrores(['Error al procesar el archivo: ' + error.message]);
    } finally {
      setProcesando(false);
    }
  };

  const procesarVariaciones = (dato) => {
    console.log('🔄 Procesando variaciones para:', dato.nombre);
    
    const variacion = {};
    
    // Procesar tallas
    if (dato.tallas && dato.tallas.toString().trim()) {
      const tallasArray = dato.tallas.toString().split(',').map(t => t.trim()).filter(t => t);
      console.log('📏 Tallas procesadas:', tallasArray);
      if (tallasArray.length > 0) {
        variacion.talla = tallasArray;
      }
    }
    
    // Procesar colores
    if (dato.colores && dato.colores.toString().trim()) {
      const coloresArray = dato.colores.toString().split(',').map(c => c.trim()).filter(c => c);
      console.log('🎨 Colores procesados:', coloresArray);
      if (coloresArray.length > 0) {
        variacion.color = coloresArray;
      }
    }
    
    // Procesar materiales
    if (dato.materiales && dato.materiales.toString().trim()) {
      const materialesArray = dato.materiales.toString().split(',').map(m => m.trim()).filter(m => m);
      if (materialesArray.length > 0) {
        variacion.material = materialesArray;
      }
    }
    
    console.log('✅ Variación final:', variacion);
    return Object.keys(variacion).length > 0 ? variacion : {};
  };

  const procesarArchivoExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log('📊 Iniciando procesamiento de Excel...');
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          console.log('📋 Datos crudos del Excel:', jsonData);
          
          if (jsonData.length < 2) {
            setErrores(['El archivo está vacío o no tiene datos válidos']);
            reject(new Error('Archivo vacío'));
            return;
          }

          const encabezados = jsonData[0].map(h => h?.toString().toLowerCase().trim() || '');
          const filasDatos = jsonData.slice(1).filter(fila => fila.some(cell => cell !== null && cell !== ''));
          
          console.log('📝 Encabezados encontrados:', encabezados);
          console.log('📄 Filas de datos (filtradas):', filasDatos.length);
          
          const { datosValidos, erroresValidacion } = validarYProcesarDatos(encabezados, filasDatos);
          
          console.log('✅ Datos válidos procesados:', datosValidos);
          console.log('❌ Errores encontrados:', erroresValidacion);
          
          setDatosProcesados(datosValidos);
          setErrores(erroresValidacion);
          setPasoActual(2);
          resolve();
          
        } catch (error) {
          console.error('❌ Error procesando archivo:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Error al leer el archivo');
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const validarYProcesarDatos = (encabezados, filasDatos) => {
    const datosValidos = [];
    const erroresValidacion = [];
    
    // Verificar encabezados mínimos requeridos
    const encabezadosRequeridos = ['codigo_producto', 'nombre', 'categoria', 'precio_venta'];
    const encabezadosFaltantes = encabezadosRequeridos.filter(req => 
      !encabezados.includes(req)
    );
    
    if (encabezadosFaltantes.length > 0) {
      erroresValidacion.push(
        `Faltan columnas requeridas: ${encabezadosFaltantes.join(', ')}. Columnas encontradas: ${encabezados.join(', ')}`
      );
      return { datosValidos, erroresValidacion };
    }

    // Procesar cada fila
    filasDatos.forEach((fila, index) => {
      const numeroFila = index + 2;
      const erroresFila = [];
      
      // Crear objeto con los datos mapeados
      const dato = {};
      encabezados.forEach((encabezado, colIndex) => {
        dato[encabezado] = fila[colIndex];
      });

      console.log(`📖 Procesando fila ${numeroFila}:`, dato);

      // Validaciones básicas
      if (!dato.codigo_producto?.toString().trim()) {
        erroresFila.push('Código de producto es requerido');
      }

      if (!dato.nombre?.toString().trim()) {
        erroresFila.push('Nombre es requerido');
      }

      if (!dato.categoria?.toString().trim()) {
        erroresFila.push('Categoría es requerida');
      } else if (!categoriasDisponibles.includes(dato.categoria.toString().trim())) {
        erroresFila.push(`Categoría "${dato.categoria}" no válida. Use: ${categoriasDisponibles.join(', ')}`);
      }

      const precio = parseFloat(dato.precio_venta);
      if (isNaN(precio) || precio < 0) {
        erroresFila.push('Precio de venta debe ser un número válido y mayor o igual a 0');
      }

      const stockInicial = parseInt(dato.stock_inicial) || 0;
      if (stockInicial < 0) {
        erroresFila.push('Stock inicial no puede ser negativo');
      }

      const stockMinimo = parseInt(dato.stock_minimo) || 5;
      if (stockMinimo < 0) {
        erroresFila.push('Stock mínimo no puede ser negativo');
      }

      if (erroresFila.length === 0) {
        // Datos válidos - formatear para la API
        const categoria = dato.categoria.toString().trim();
        const categoriaId = categoriasMap[categoria];
        const variacion = procesarVariaciones(dato);
        
        const productoData = {
          categoriaId: categoriaId,
          codigoProducto: dato.codigo_producto.toString().trim(),
          nombre: dato.nombre.toString().trim(),
          descripcion: dato.descripcion?.toString().trim() || '',
          precioVenta: precio,
          stockInicial: stockInicial,
          stockMinimo: stockMinimo,
        };

        // Solo agregar variacion si hay variaciones
        if (Object.keys(variacion).length > 0) {
          productoData.variacion = variacion;
        }

        console.log(`✅ Fila ${numeroFila} procesada correctamente:`, productoData);
        datosValidos.push(productoData);
      } else {
        console.log(`❌ Errores en fila ${numeroFila}:`, erroresFila);
        erroresValidacion.push(`Fila ${numeroFila}: ${erroresFila.join('; ')}`);
      }
    });

    return { datosValidos, erroresValidacion };
  };

  const handleImportar = async () => {
    if (datosProcesados.length === 0) {
      setErrores(['No hay datos válidos para importar']);
      return;
    }

    console.log('🚀 Iniciando importación de productos:', datosProcesados);
    
    try {
      await onImportarProductos(datosProcesados);
      setPasoActual(3);
    } catch (error) {
      console.error('❌ Error en importación:', error);
      setErrores([...errores, `Error en la importación: ${error.message}`]);
    }
  };

  const descargarPlantilla = () => {
    const datosEjemplo = [
      {
        codigo_producto: 'CAM-BAS-001',
        nombre: 'Camiseta Básica',
        categoria: 'Ropa',
        descripcion: 'Camiseta de algodón 100%',
        precio_venta: 25000,
        stock_inicial: 50,
        stock_minimo: 5,
        tallas: 'S,M,L,XL',
        colores: 'Negro,Blanco,Azul'
      },
      {
        codigo_producto: 'ZAP-DEP-001',
        nombre: 'Zapatos Deportivos',
        categoria: 'Calzado',
        descripcion: 'Zapatos para running',
        precio_venta: 120000,
        stock_inicial: 25,
        stock_minimo: 3,
        tallas: '38,39,40,41,42',
        colores: 'Negro,Blanco'
      },
      {
        codigo_producto: 'LAP-GAM-001',
        nombre: 'Laptop Gaming',
        categoria: 'Electrónicos',
        descripcion: 'Laptop para gaming de alta gama',
        precio_venta: 3500000,
        stock_inicial: 8,
        stock_minimo: 1
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosEjemplo);
    
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'plantilla_importacion_productos.xlsx');
  };

  const renderPasoSubir = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Importar Productos desde Excel</h3>
        <p className="text-gray-600 text-sm">
          Sube un archivo Excel con la información de tus productos
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleArchivoSeleccionado}
          accept=".xlsx,.xls"
          className="hidden"
        />
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Haz clic para subir
          </button>{' '}
          o arrastra tu archivo aquí
        </p>
        <p className="text-gray-500 text-xs">
          Formatos soportados: .xlsx, .xls
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Download className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 text-sm mb-2">
              ¿No tienes una plantilla?
            </h4>
            <button
              onClick={descargarPlantilla}
              className="text-blue-700 hover:text-blue-800 text-sm underline"
            >
              Descargar plantilla de ejemplo
            </button>
            <p className="text-blue-600 text-xs mt-1">
              La plantilla incluye la estructura requerida y ejemplos de datos
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 text-sm mb-2">Estructura requerida:</h4>
        <div className="text-xs text-gray-600 space-y-2">
          <div>
            <p><strong>Columnas obligatorias:</strong> codigo_producto, nombre, categoria, precio_venta</p>
            <p><strong>Columnas opcionales:</strong> descripcion, stock_inicial, stock_minimo, tallas, colores, materiales</p>
          </div>
          <div>
            <p><strong>Categorías válidas:</strong> {categoriasDisponibles.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasoRevision = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revisar Datos a Importar</h3>
          <p className="text-gray-600 text-sm">
            Archivo: <span className="font-medium">{archivo?.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-green-600 text-sm font-medium">Válidos</p>
          <p className="text-green-900 text-xl font-bold">{datosProcesados.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-red-600 text-sm font-medium">Errores</p>
          <p className="text-red-900 text-xl font-bold">{errores.length}</p>
        </div>
      </div>

      {datosProcesados.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-2">
            Vista previa de productos a importar ({datosProcesados.length})
          </h4>
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Código</th>
                  <th className="px-3 py-2 text-left">Nombre</th>
                  <th className="px-3 py-2 text-left">Categoría</th>
                  <th className="px-3 py-2 text-left">Precio</th>
                  <th className="px-3 py-2 text-left">Stock</th>
                  <th className="px-3 py-2 text-left">Variaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {datosProcesados.slice(0, 10).map((producto, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-xs">{producto.codigoProducto}</td>
                    <td className="px-3 py-2">{producto.nombre}</td>
                    <td className="px-3 py-2">
                      {Object.keys(categoriasMap).find(key => categoriasMap[key] === producto.categoriaId)}
                    </td>
                    <td className="px-3 py-2">${producto.precioVenta?.toLocaleString()}</td>
                    <td className="px-3 py-2">{producto.stockInicial}</td>
                    <td className="px-3 py-2">
                      {producto.variacion && Object.keys(producto.variacion).length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(producto.variacion).map(([tipo, valores]) => (
                            <span key={tipo} className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-xs">
                              {tipo}: {valores.slice(0, 2).join(',')}
                              {valores.length > 2 ? '...' : ''}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin variaciones</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {datosProcesados.length > 10 && (
              <div className="bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">
                + {datosProcesados.length - 10} productos más...
              </div>
            )}
          </div>
        </div>
      )}

      {errores.length > 0 && (
        <div>
          <h4 className="font-medium text-red-700 text-sm mb-2 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Errores encontrados ({errores.length})</span>
          </h4>
          <div className="max-h-40 overflow-y-auto border border-red-200 rounded-lg bg-red-50 p-3">
            <ul className="text-xs text-red-700 space-y-1">
              {errores.slice(0, 10).map((error, index) => (
                <li key={index} className="font-mono">• {error}</li>
              ))}
            </ul>
            {errores.length > 10 && (
              <p className="text-red-600 text-xs mt-2">
                + {errores.length - 10} errores más...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderPasoResultado = () => (
    <div className="text-center space-y-4">
      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">¡Importación Completada!</h3>
      <p className="text-gray-600">
        Se importaron <span className="font-bold text-green-600">{datosProcesados.length}</span> productos correctamente.
      </p>
      {errores.length > 0 && (
        <p className="text-yellow-600 text-sm">
          Se encontraron {errores.length} errores durante la importación.
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {pasoActual === 1 && 'Importar desde Excel'}
            {pasoActual === 2 && 'Revisar Importación'}
            {pasoActual === 3 && 'Importación Completada'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading || procesando}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {procesando ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Procesando archivo Excel...</p>
              <p className="text-gray-400 text-sm mt-2">Esto puede tomar unos segundos</p>
            </div>
          ) : (
            <>
              {pasoActual === 1 && renderPasoSubir()}
              {pasoActual === 2 && renderPasoRevision()}
              {pasoActual === 3 && renderPasoResultado()}
            </>
          )}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full ${pasoActual >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${pasoActual >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full ${pasoActual >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          </div>

          <div className="flex space-x-3">
            {pasoActual === 1 && (
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}

            {pasoActual === 2 && (
              <>
                <button
                  onClick={() => setPasoActual(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  onClick={handleImportar}
                  disabled={loading || datosProcesados.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>
                    {loading ? 'Importando...' : `Importar ${datosProcesados.length} productos`}
                  </span>
                </button>
              </>
            )}

            {pasoActual === 3 && (
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportarExcelModal;