// En tu App.jsx, agrega temporalmente:
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Inventario from './pages/Inventario';
import Pedidos from './pages/Pedidos';
import VentaLive from './pages/VentaLive';
import { DebugAPI } from './components/Debug/DebugAPI'; // Agregar esto
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        {/* Agrega temporalmente el debug */}
        <div className="container mx-auto px-4">
          <DebugAPI />
        </div>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/venta-live" element={<VentaLive />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;