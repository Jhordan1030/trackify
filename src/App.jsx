// src/App.jsx - VERSIÓN FUNCIONAL SIN MainLayout SEPARADO
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Video,
  Menu,
  X,
  Building,
  UserCog,
  Shield,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Inventario from './pages/Inventario';
import Pedidos from './pages/Pedidos';
import VentaLive from './pages/VentaLive';
import Login from './pages/Login';
import AdminEmpresas from './pages/admin/Empresas';
import AdminUsuarios from './pages/admin/Usuarios';
import AdminAuditoria from './pages/admin/Auditoria';

// Componente de carga
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando aplicación...</p>
    </div>
  </div>
);

// Protected Route Component simplificado
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - Estado:', {
    loading,
    isAuthenticated,
    user: user?.email,
    hasToken: !!localStorage.getItem('authToken')
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo al login...');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    console.log('❌ Rol insuficiente:', user.rol, 'requerido:', requiredRole);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tiene permisos para acceder a esta página.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Main Layout Component (integrado en App.jsx)
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  console.log('🏠 MainLayout - Usuario:', user?.email);

  // Navigation base para todos los usuarios
  const baseNavigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'usuario'] },
    { name: 'Clientes', path: '/clientes', icon: Users, roles: ['super_admin', 'admin', 'usuario'] },
    { name: 'Inventario', path: '/inventario', icon: Package, roles: ['super_admin', 'admin', 'usuario'] },
    { name: 'Pedidos', path: '/pedidos', icon: ShoppingCart, roles: ['super_admin', 'admin', 'usuario'] },
    { name: 'Venta Live', path: '/venta-live', icon: Video, roles: ['super_admin', 'admin', 'usuario'] },
  ];

  // Navigation solo para super_admin
  const adminNavigation = [
    { name: 'Empresas', path: '/admin/empresas', icon: Building, roles: ['super_admin'] },
    { name: 'Usuarios', path: '/admin/usuarios', icon: UserCog, roles: ['super_admin'] },
    { name: 'Auditoría', path: '/admin/auditoria', icon: Shield, roles: ['super_admin'] },
  ];

  // Filtrar navegación según el rol del usuario
  const getFilteredNavigation = () => {
    if (!user?.rol) return [];
    return baseNavigation.filter(item => item.roles.includes(user.rol));
  };

  const getAdminNavigation = () => {
    if (!user?.rol) return [];
    return adminNavigation.filter(item => item.roles.includes(user.rol));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    console.log('🚪 Iniciando logout...');
    await logout();
  };

  const getUserRoleText = () => {
    const roles = {
      'super_admin': 'Super Administrador',
      'admin': 'Administrador',
      'usuario': 'Usuario'
    };
    return roles[user?.rol] || user?.rol;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Trackify</span>
                <div className="text-xs text-gray-500">{user?.empresaNombre || 'Sistema'}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {/* Navegación principal */}
            {getFilteredNavigation().map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
                    isActive(item.path) 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${
                    isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  {item.name}
                </Link>
              );
            })}

            {/* Separador para admin navigation - SOLO si hay elementos */}
            {getAdminNavigation().length > 0 && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-4 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Administración
                  </span>
                </div>
                {getAdminNavigation().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
                        isActive(item.path) 
                          ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${
                        isActive(item.path) ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.nombre || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {getUserRoleText()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">Trackify</span>
                    <div className="text-xs text-gray-500">{user?.empresaNombre || 'Sistema'}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {getFilteredNavigation().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.path) 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}

                {getAdminNavigation().length > 0 && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="px-4 mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Administración
                      </span>
                    </div>
                    {getAdminNavigation().map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            isActive(item.path) 
                              ? 'bg-purple-50 text-purple-700' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </nav>

              {/* Footer Mobile */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</p>
                      <p className="text-xs text-gray-500">{getUserRoleText()}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b border-gray-200 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center ml-4 space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Trackify</span>
              <div className="text-xs text-gray-500">{user?.empresaNombre || 'Sistema'}</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

// Componente principal de rutas
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  console.log('🚀 AppRoutes - Estado:', { loading, isAuthenticated });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Ruta de login */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      
      {/* Rutas protegidas dentro del layout principal */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? <AuthenticatedApp /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
}

// Rutas para usuarios autenticados
function AuthenticatedApp() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Routes>
        {/* Rutas principales */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/venta-live" element={<VentaLive />} />
        
        {/* Rutas de administración (solo super_admin) */}
        {user?.rol === 'super_admin' && (
          <>
            <Route path="/admin/empresas" element={<AdminEmpresas />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/auditoria" element={<AdminAuditoria />} />
          </>
        )}
        
        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/empresas" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
}

// App Component Principal
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;