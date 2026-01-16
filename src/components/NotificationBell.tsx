import React, { useState, useEffect } from 'react';
import { Bell, X, MessageSquare, Clock, User } from 'lucide-react';
import { getOperatorMessages, markMessageAsRead, getUnreadMessagesCount } from '../utils/storage';
import { OperatorMessage } from '../types';

export default function NotificationBell() {
  const [messages, setMessages] = useState<OperatorMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    const loadMessages = () => {
      setMessages(getOperatorMessages());
      setUnreadCount(getUnreadMessagesCount());
    };

    loadMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `hace ${Math.floor(diffInHours)} h`;
    } else {
      return date.toLocaleDateString('es-MX');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMessages(!showMessages)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showMessages && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMessages(false)}
          />
          
          {/* Messages Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Mensajes de Operadores
                </h3>
                <button
                  onClick={() => setShowMessages(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  {unreadCount} mensaje{unreadCount > 1 ? 's' : ''} sin leer
                </p>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No hay mensajes</p>
                  <p className="text-sm">Los mensajes de los operadores aparecerán aquí</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {messages.slice().reverse().map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !message.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => !message.read && handleMarkAsRead(message.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900 text-sm">
                            {message.operatorName}
                          </span>
                          {!message.read && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {message.message}
                      </p>
                      
                      {message.recordId && (
                        <div className="mt-2 text-xs text-gray-500">
                          Relacionado con registro: {message.recordId.slice(-8)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}