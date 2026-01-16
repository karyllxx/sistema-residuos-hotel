import React from 'react';
import { LogOut, Trash2, User } from 'lucide-react';
import { clearAuthState } from '../utils/storage';
import NotificationBell from './NotificationBell';

interface LayoutProps {
  user: any;
  children: React.ReactNode;
  onLogout: () => void;
}

export default function Layout({ user, children, onLogout }: LayoutProps) {
  const handleLogout = () => {
    clearAuthState();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 w-10 h-10 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Sistema de Residuos Sólidos
                </h1>
                <p className="text-sm text-gray-600">
                  Secrets Playa Blanca Costa Mujeres
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span>{user?.name || 'Usuario'}</span>
              </div>
              
              {user?.role === 'admin' && <NotificationBell />}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}