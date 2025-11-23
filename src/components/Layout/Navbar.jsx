import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Bienvenido a Trackify
          </h2>
          <p className="text-sm text-gray-600">
            Sistema de gestión de ventas en vivo
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Administrador</p>
            <p className="text-xs text-gray-500">En línea</p>
          </div>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;