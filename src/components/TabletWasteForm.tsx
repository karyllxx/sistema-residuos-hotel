import React, { useState } from 'react';
import { Save, CheckCircle, Clock, MapPin, Scale, FileText, X, MessageSquare, Send, ArrowDown, Info } from 'lucide-react';
import { WasteRecord } from '../types';

interface TabletWasteFormProps {
  user: any;
  onRecordAdded: (record: WasteRecord) => void;
}

interface SelectedWaste {
  type: string;
  weight: string;
  notes: string;
}

const WASTE_TYPES = [
  { id: 'organicos', name: 'Orgánicos', icon: '/images/residuos/Orgánicos.jpg', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { id: 'organicos-citricos', name: 'Orgánicos (naranja/limón)', icon: '/images/residuos/Naranja-Limon.jpg', color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { id: 'inorganicos', name: 'Inorgánicos - no valorizables', icon: '/images/residuos/inorganico-no-valorizables.png', color: 'from-gray-500 to-slate-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  { id: 'pet', name: 'Pet', icon: '/images/residuos/Pet.jpg', color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'plastico-duro', name: 'Plástico duro', icon: '/images/residuos/Plástico-duro.webp', color: 'from-indigo-500 to-purple-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { id: 'emplaye', name: 'Emplaye', icon: '/images/residuos/Emplaye.jpg', color: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
  { id: 'bopp', name: 'BOPP (envolturas)', icon: '/images/residuos/BOPP.png', color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  { id: 'vidrio', name: 'Vidrio', icon: '/images/residuos/Vidrio.png', color: 'from-teal-500 to-green-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
  { id: 'aluminio', name: 'Aluminio', icon: '/images/residuos/Lata-de-aluminio.webp', color: 'from-slate-500 to-gray-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
  { id: 'carton', name: 'Cartón', icon: '/images/residuos/Cartón.jpg', color: 'from-amber-600 to-orange-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'papel', name: 'Papel, libros, revistas y periódicos', icon: '/images/residuos/Papel-archivo.jpg', color: 'from-yellow-500 to-amber-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  { id: 'lata-conserva', name: 'Lata de conserva o latón', icon: '/images/residuos/laton.jpg', color: 'from-red-500 to-pink-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'tetrapak', name: 'Tetrapak', icon: '/images/residuos/Tetrapack.jpg', color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-200' },
  { id: 'textiles', name: 'Textiles', icon: '/images/residuos/Textiles.jpg', color: 'from-purple-500 to-indigo-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'chatarra', name: 'Chatarra', icon: '/images/residuos/chatarra.jpg', color: 'from-stone-500 to-gray-600', bgColor: 'bg-stone-50', borderColor: 'border-stone-200' },
  { id: 'cafe-composta', name: 'Café para composta', icon: '/images/residuos/cafe-composta.jpg', color: 'from-amber-700 to-yellow-800', bgColor: 'bg-amber-100', borderColor: 'border-amber-400', special: true },
  { id: 'residuos-rancho', name: 'Residuos para rancho', icon: '🏜️', color: 'from-yellow-600 to-amber-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-400', special: true }
];

const HOTEL_AREAS = [
  { id: 'na', name: 'NA (No aplica)', icon: '🚫' }, { id: 'areas-publicas', name: 'Áreas públicas', icon: '🏛️' }, { id: 'albercas', name: 'Albercas', icon: '🏊‍♂️' }, { id: 'almacen', name: 'Almacén', icon: '📦' }, { id: 'ama-llaves', name: 'Ama de llaves', icon: '🔑' }, { id: 'audio-visual', name: 'Audio visual', icon: '🎥' }, { id: 'banquetes', name: 'Banquetes', icon: '🍽️' }, { id: 'barefoot', name: 'Barefoot', icon: '🍽️' }, { id: 'bares', name: 'Bares', icon: '🍹' }, { id: 'barracuda', name: 'Barracuda', icon: '🍽️' }, { id: 'bodas', name: 'Bodas', icon: '💒' }, { id: 'bordeaux', name: 'Bordeaux', icon: '🍽️' }, { id: 'carpinteria', name: 'Carpintería', icon: '🔨' }, { id: 'club-preferred', name: 'Club Preferred', icon: '🍽️' }, { id: 'cocina-central', name: 'Cocina central', icon: '👨‍🍳' }, { id: 'coco-cafe', name: 'Coco Café', icon: '☕' }, { id: 'comedor-empleados', name: 'Comedor empleados', icon: '🍽️' }, { id: 'comisariato', name: 'Comisariato', icon: '🏪' }, { id: 'edificios', name: 'Edificios', icon: '🏢' }, { id: 'el-patio', name: 'El Patio', icon: '🍽️' }, { id: 'entretenimiento', name: 'Entretenimiento', icon: '🎭' }, { id: 'especialidades', name: 'Especialidades', icon: '🍴' }, { id: 'eventos-banquetes', name: 'Eventos/Banquetes', icon: '🎉' }, { id: 'himitsu', name: 'Himitsu', icon: '🍽️' }, { id: 'jardineria', name: 'Jardinería', icon: '🌺' }, { id: 'lavanderia', name: 'Lavandería', icon: '👔' }, { id: 'limpieza-playa', name: 'Limpieza de playa', icon: '🏖️' }, { id: 'manatees', name: 'Manatees', icon: '🍽️' }, { id: 'mantenimiento', name: 'Mantenimiento', icon: '🔧' }, { id: 'market', name: 'Market', icon: '🛒' }, { id: 'market-cafe', name: 'Market Café', icon: '🍽️' }, { id: 'minibares', name: 'Minibares/Servibar', icon: '🍺' }, { id: 'oceana', name: 'Oceana', icon: '🌊' }, { id: 'oficinas', name: 'Oficinas', icon: '🏢' }, { id: 'poblado', name: 'Poblado', icon: '🏘️' }, { id: 'portofino', name: 'Portofino', icon: '🍽️' }, { id: 'proveedores', name: 'Proveedores', icon: '🚚' }, { id: 'rh', name: 'RH', icon: '👥' }, { id: 'room-service', name: 'Room Service/IRD', icon: '🛏️' }, { id: 'seaside', name: 'Seaside', icon: '🍽️' }, { id: 'seaside-grill', name: 'Seaside Grill', icon: '🔥' }, { id: 'seguridad', name: 'Seguridad', icon: '🛡️' }, { id: 'sommelier', name: 'Sommelier', icon: '🍷' }, { id: 'spa', name: 'Spa', icon: '💆‍♀️' }, { id: 'steward', name: 'Steward', icon: '🧹' }, { id: 'tiendas', name: 'Tiendas', icon: '🛍️' }, { id: 'tiendita-colegas', name: 'Tiendita colegas', icon: '🏪' }, { id: 'uvc', name: 'UVC', icon: '💡' }, { id: 'chatos', name: 'Chatos', icon: '🍻' }
];

export default function TabletWasteForm({ user, onRecordAdded }: TabletWasteFormProps) {
  const [selectedWastes, setSelectedWastes] = useState<SelectedWaste[]>([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [lastRecordId, setLastRecordId] = useState<string | null>(null);

  const handleWasteTypeToggle = (wasteType: typeof WASTE_TYPES[0]) => {
    const isSelected = selectedWastes.some(w => w.type === wasteType.name);
    if (isSelected) {
      setSelectedWastes(prev => prev.filter(w => w.type !== wasteType.name));
    } else {
      setSelectedWastes(prev => [...prev, { type: wasteType.name, weight: '', notes: '' }]);
    }
  };

  const updateWasteData = (type: string, field: 'weight' | 'notes', value: string) => {
    setSelectedWastes(prev => prev.map(waste => waste.type === type ? { ...waste, [field]: value } : waste));
  };

  const removeWaste = (type: string) => {
    setSelectedWastes(prev => prev.filter(w => w.type !== type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWastes.length === 0 || !selectedArea) return;

    const invalidWastes = selectedWastes.filter(w => !w.weight || parseFloat(w.weight) <= 0);
    if (invalidWastes.length > 0) {
      alert('Por favor, ingresa el peso para todos los residuos seleccionados');
      return;
    }

    setLoading(true);

    try {
      const selectedAreaName = HOTEL_AREAS.find(area => area.id === selectedArea)?.name || selectedArea;
      
      // Obtener el token de autorización
      const authStorage = JSON.parse(localStorage.getItem('auth_storage') || '{}');
      const token = authStorage.state?.user?.token || localStorage.getItem('token');

      for (const waste of selectedWastes) {
        // CONEXIÓN DIRECTA A RENDER
        const response = await fetch('https://residuos-backend-7v15.onrender.com/api/waste-records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type: waste.type,
            location: selectedAreaName,
            weight: parseFloat(waste.weight),
            notes: waste.notes.trim() || undefined,
            date, // Enviamos la fecha y hora manuales del formulario
            time
          })
        });

        if (!response.ok) throw new Error('Error al guardar en el servidor');

        const record = await response.json();
        onRecordAdded(record);
        setLastRecordId(record.id);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setSelectedWastes([]);
      setSelectedArea('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().split(' ')[0].substring(0, 5));
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert('Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    const authStorage = JSON.parse(localStorage.getItem('auth_storage') || '{}');
    const token = authStorage.state?.user?.token || localStorage.getItem('token');

    try {
      await fetch('https://residuos-backend-7v15.onrender.com/api/operator-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          operatorName: user.name,
          message: messageText.trim(),
          recordId: lastRecordId || undefined
        })
      });

      setMessageText('');
      setShowMessageForm(false);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50';
      successDiv.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="font-medium">Mensaje enviado correctamente</span>`;
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (err) {
      alert("Error al enviar mensaje");
    }
  };

  const canSubmit = selectedWastes.length > 0 && selectedArea && selectedWastes.every(w => w.weight && parseFloat(w.weight) > 0) && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="fixed bottom-6 right-6 z-50">
          <button type="button" onClick={() => setShowMessageForm(!showMessageForm)} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 hover:scale-110" title="Enviar mensaje al administrador">
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🌱 Registro de Residuos</h1>
          </div>
        </div>

        {selectedWastes.length > 0 && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">¡Perfecto! Seleccionaste {selectedWastes.length} tipo{selectedWastes.length > 1 ? 's' : ''} de residuo.</p>
                <p className="text-blue-700 text-sm flex items-center gap-2">Ingresa los pesos abajo <ArrowDown className="w-4 h-4 animate-bounce" /></p>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-pulse">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">¡Registros guardados exitosamente en la base de datos!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg"><Scale className="w-6 h-6 text-green-600" /></div>
              1. Selecciona los tipos de residuos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {WASTE_TYPES.map((type) => {
                const isSelected = selectedWastes.some(w => w.type === type.name);
                return (
                  <button key={type.id} type="button" onClick={() => handleWasteTypeToggle(type)} className={`relative p-4 rounded-2xl border-3 transition-all duration-200 transform hover:scale-105 ${type.special ? 'border-4 border-amber-400 bg-gradient-to-br from-amber-100 to-yellow-100 shadow-lg' : ''} ${isSelected ? `${type.borderColor} bg-gradient-to-br ${type.color} text-white shadow-xl` : `${type.borderColor} ${type.bgColor} hover:shadow-lg`}`}>
                    <div className="text-center">
                      <div className="flex justify-center items-center mb-2">
                        {typeof type.icon === 'string' && (type.icon.startsWith('/') || type.icon.startsWith('./')) ? <img src={encodeURI(type.icon)} alt={type.name} className="object-contain" style={{width: 80, height: 80}} /> : <div className="text-3xl">{type.icon}</div>}
                      </div>
                      <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>{type.name}</h3>
                    </div>
                    {isSelected && <div className="absolute -top-2 -right-2 bg-white rounded-full p-1"><CheckCircle className="w-6 h-6 text-green-500" /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedWastes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg"><FileText className="w-6 h-6 text-blue-600" /></div>
                2. Detalles de peso
              </h2>
              <div className="space-y-4">
                {selectedWastes.map((waste) => {
                  const wasteType = WASTE_TYPES.find(t => t.name === waste.type);
                  return (
                    <div key={waste.type} className={`p-4 rounded-xl border-2 ${wasteType?.borderColor} ${wasteType?.bgColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {wasteType?.icon && typeof wasteType.icon === 'string' && wasteType.icon.includes('/') ? <img src={encodeURI(wasteType.icon)} alt={wasteType.name} className="object-contain" style={{width: 60, height: 60}} /> : <span className="text-2xl">{wasteType?.icon}</span>}
                          <h3 className="font-bold text-lg text-gray-800">{waste.type}</h3>
                        </div>
                        <button type="button" onClick={() => removeWaste(waste.type)} className="text-red-500 hover:text-red-700 p-1"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Peso (kg) *</label>
                          <input type="number" step="0.1" min="0" value={waste.weight} onChange={(e) => updateWasteData(waste.type, 'weight', e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all" placeholder="0.0" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Notas</label>
                          <input type="text" value={waste.notes} onChange={(e) => updateWasteData(waste.type, 'notes', e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all" placeholder="Opcional..." />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedWastes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg"><MapPin className="w-6 h-6 text-orange-600" /></div>
                3. Área del hotel
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {HOTEL_AREAS.map((area) => (
                  <button key={area.id} type="button" onClick={() => setSelectedArea(area.id)} className={`p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${selectedArea === area.id ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg' : 'border-orange-200 bg-orange-50 hover:shadow-md'}`}>
                    <div className="text-center">
                      <div className="text-lg mb-1">{area.icon}</div>
                      <span className={`font-semibold text-xs ${selectedArea === area.id ? 'text-white' : 'text-gray-800'}`}>{area.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedWastes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg"><Clock className="w-6 h-6 text-purple-600" /></div>
                Fecha y Hora
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Fecha</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all" />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Hora</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all" />
                </div>
              </div>
            </div>
          )}

          {selectedWastes.length > 0 && (
            <div className="text-center">
              <button type="submit" disabled={!canSubmit} className={`px-12 py-6 text-2xl font-bold rounded-2xl transition-all duration-200 transform ${canSubmit ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105 shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                {loading ? <div className="flex items-center gap-3"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>Guardando...</div> : <div className="flex items-center gap-3"><Save className="w-8 h-8" />Guardar {selectedWastes.length} Registro{selectedWastes.length > 1 ? 's' : ''}</div>}
              </button>
            </div>
          )}
        </form>

        {showMessageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-blue-600" />Enviar mensaje</h3>
              <div className="space-y-4">
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Escribe tu mensaje aquí..." className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none" rows={4} />
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowMessageForm(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button type="button" onClick={handleSendMessage} disabled={!messageText.trim()} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50">Enviar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}