import React, { useState } from 'react';
import { Settings, Users, Mail, Key, Image, Plus, Trash2, CreditCard as Edit2, Save, X } from 'lucide-react';
import { getUsers, getEmailConfigs, addEmailConfig, deleteEmailConfig } from '../utils/storage';
import { User, EmailConfig } from '../types';

export default function Configuration() {
  const [activeSection, setActiveSection] = useState<'users' | 'emails' | 'login'>('users');
  const [users] = useState<User[]>(getUsers());
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>(getEmailConfigs());
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState({ email: '', name: '' });
  const [showAddEmail, setShowAddEmail] = useState(false);

  const handleAddEmail = () => {
    if (newEmail.email && newEmail.name) {
      const emailConfig = addEmailConfig({
        email: newEmail.email,
        name: newEmail.name,
        active: true
      });
      setEmailConfigs([...emailConfigs, emailConfig]);
      setNewEmail({ email: '', name: '' });
      setShowAddEmail(false);
    }
  };

  const handleDeleteEmail = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este correo?')) {
      deleteEmailConfig(id);
      setEmailConfigs(emailConfigs.filter(email => email.id !== id));
    }
  };

  const sections = [
    { id: 'users' as const, name: 'Usuarios', icon: Users },
    { id: 'emails' as const, name: 'Correos', icon: Mail },
    { id: 'login' as const, name: 'Login', icon: Image }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Configuración del Sistema</h2>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Usuario
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.username}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'operator'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 
                           user.role === 'operator' ? 'Operador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(user.id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Editar usuario"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Emails Section */}
        {activeSection === 'emails' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Correos de Contacto</h3>
              <button
                onClick={() => setShowAddEmail(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Correo
              </button>
            </div>

            {showAddEmail && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Nuevo Correo de Contacto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newEmail.name}
                    onChange={(e) => setNewEmail(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newEmail.email}
                    onChange={(e) => setNewEmail(prev => ({ ...prev, email: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddEmail}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={() => setShowAddEmail(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {emailConfigs.map((config) => (
                <div key={config.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{config.name}</span>
                    <span className="text-gray-600 ml-2">({config.email})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEmail(config.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Eliminar correo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Login Section */}
        {activeSection === 'login' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Personalización del Login</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Credenciales Actuales del Sistema</span>
              </div>
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>Administrador:</strong> admin / admin123</p>
                <p><strong>Operador:</strong> operador / op123</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de Portada del Login
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <p className="text-sm text-gray-500">PNG, JPG hasta 2MB</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Seleccionar Imagen
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Mostrar credenciales por defecto</h4>
                  <p className="text-sm text-gray-600">Ocultar las credenciales de ejemplo en la pantalla de login</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}