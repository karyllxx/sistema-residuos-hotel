import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, FileText, Settings } from 'lucide-react';
import Login from './components/Login';
import Layout from './components/Layout';
import WasteForm from './components/WasteForm';
import TabletWasteForm from './components/TabletWasteForm';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Configuration from './components/Configuration';
// import { initializeStorage, getAuthState, getWasteRecords } from './utils/storage'; // YA NO USAMOS ESTO
import { WasteRecord } from './types';

type ActiveTab = 'capture' | 'dashboard' | 'reports' | 'configuration';

function App() {
  // Intentamos recuperar la sesión si existe, si no, null
  const storedAuth = localStorage.getItem('auth_storage');
  const initialAuth = storedAuth ? JSON.parse(storedAuth).state : { isAuthenticated: false, user: null };

  const [authState, setAuthState] = useState(initialAuth);
  const [activeTab, setActiveTab] = useState<ActiveTab>('capture');
  const [records, setRecords] = useState<WasteRecord[]>([]);

  // --- AQUÍ ESTÁ EL CAMBIO: CARGAR DATOS REALES DE LA BASE DE DATOS ---
  useEffect(() => {
    const fetchRecords = async () => {
      // Solo intentamos cargar si el usuario está logueado
      if (!authState.isAuthenticated) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        console.log("🔄 Cargando registros desde la Base de Datos...");
        
        const response = await fetch('/api/waste-records', {
          headers: {
            'Authorization': `Bearer ${token}` // Usamos tu llave real
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Registros cargados:", data.length);
          setRecords(data); // ¡Aquí actualizamos con la verdad!
        } else {
          console.error("Error al cargar registros");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchRecords();
  }, [authState.isAuthenticated, activeTab]); // Se recarga al entrar o al cambiar de pestaña
  // ---------------------------------------------------------------------

  const handleLogin = (user: any) => {
    setAuthState({ isAuthenticated: true, user });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_storage');
    setAuthState({ isAuthenticated: false, user: null });
    setActiveTab('capture');
    setRecords([]); // Limpiamos los datos al salir
  };

  const handleRecordAdded = (record: WasteRecord) => {
    // Agregamos el nuevo registro a la lista visualmente (sin recargar todo)
    setRecords(prev => [record, ...prev]);
  };

  const handleRecordDeleted = () => {
    // Si borras algo, recargamos la lista del servidor para estar seguros
    // (Podrías optimizarlo filtrando el array local, pero esto es más seguro)
    const token = localStorage.getItem('token');
    if(token) {
        fetch('/api/waste-records', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setRecords(data));
    }
  };

  if (!authState.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Definir pestañas según el rol
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
      {/* Tab Navigation */}
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

      {/* Tab Content */}
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