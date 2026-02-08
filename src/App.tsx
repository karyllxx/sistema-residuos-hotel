import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, FileText, Settings } from 'lucide-react';
import Login from './components/Login';
import Layout from './components/Layout';
import WasteForm from './components/WasteForm';
import TabletWasteForm from './components/TabletWasteForm';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Configuration from './components/Configuration';
import { WasteRecord } from './types';
import { apiClient } from './utils/api'; // <--- Importante para la URL de Render

type ActiveTab = 'capture' | 'dashboard' | 'reports' | 'configuration';

function App() {
  // 1. Recuperar sesión persistente del LocalStorage
  const storedAuth = localStorage.getItem('auth_storage');
  const initialAuth = storedAuth ? JSON.parse(storedAuth).state : { isAuthenticated: false, user: null };

  const [authState, setAuthState] = useState(initialAuth);
  const [activeTab, setActiveTab] = useState<ActiveTab>('capture');
  const [records, setRecords] = useState<WasteRecord[]>([]);

  // --- SINCRONIZADOR MAESTRO (POLLING) ---
  // Mantiene los datos actualizados en todos los dispositivos cada 30 segundos
  useEffect(() => {
    const fetchRecords = async () => {
      if (!authState.isAuthenticated) return;

      try {
        console.log("🔄 Sincronizando registros con la base de datos...");
        // Usamos el apiClient que ya tiene configurado el 'auth_token' y la URL de Render
        const data = await apiClient.getWasteRecords();
        setRecords(data); 
        console.log("✅ Datos actualizados correctamente");
      } catch (error: any) {
        console.error("Error de sincronización:", error);
        // Si el servidor rechaza la llave (Error 401), cerramos sesión por seguridad
        if (error.message.includes('401')) {
          handleLogout();
        }
      }
    };

    // Carga inmediata al entrar o cambiar de pestaña
    fetchRecords();

    // Configurar el reloj de actualización (30 segundos)
    const interval = setInterval(fetchRecords, 30000); 

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, activeTab]); 
  // ---------------------------------------

  const handleLogin = (user: any) => {
    // La sesión ya fue guardada en Login.tsx, aquí solo activamos el estado
    setAuthState({ isAuthenticated: true, user });
  };

  const handleLogout = () => {
    console.log("🚪 Limpiando sesión y tokens...");
    // Borramos todos los posibles nombres de token para evitar conflictos
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_storage');
    localStorage.removeItem('token');
    
    setAuthState({ isAuthenticated: false, user: null });
    setActiveTab('capture');
    setRecords([]); 
  };

  const handleRecordAdded = (record: WasteRecord) => {
    // Actualización visual instantánea tras capturar
    setRecords(prev => [record, ...prev]);
  };

  const handleRecordDeleted = async () => {
    // Tras borrar un registro, pedimos la lista actualizada al servidor
    try {
      const data = await apiClient.getWasteRecords();
      setRecords(data);
    } catch (error) {
      console.error("Error al refrescar tras borrar:", error);
    }
  };

  if (!authState.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Definir pestañas según el rol (Operador o Administrador)
  const tabs = authState.user?.role === 'operator' ? [
    {
      id: 'capture' as const,
      name: 'Captura de Residuos',
      icon: Plus,
      color: 'text-green-600 bg-green-100'
    }
  ] : [
    {
      id: 'capture' as const,
      name: 'Captura de Información',
      icon: Plus,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'dashboard' as const,
      name: 'Dashboard',
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'reports' as const,
      name: 'Reportes',
      icon: FileText,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'configuration' as const,
      name: 'Configuración',
      icon: Settings,
      color: 'text-gray-600 bg-gray-100'
    }
  ];

  return (
    <Layout user={authState.user} onLogout={handleLogout}>
      {/* Navegación Principal */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mr-3 ${
                    isActive ? tab.color : 'text-gray-400 bg-gray-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Renderizado de Vistas */}
      <div>
        {activeTab === 'capture' && (
          authState.user?.role === 'operator' ? (
            <TabletWasteForm user={authState.user} onRecordAdded={handleRecordAdded} />
          ) : (
            <WasteForm user={authState.user} onRecordAdded={handleRecordAdded} />
          )
        )}
        {activeTab === 'dashboard' && (
          <Dashboard records={records} />
        )}
        {activeTab === 'reports' && (
          <Reports records={records} onRecordDeleted={handleRecordDeleted} />
        )}
        {activeTab === 'configuration' && (
          <Configuration />
        )}
      </div>
    </Layout>
  );
}

export default App;