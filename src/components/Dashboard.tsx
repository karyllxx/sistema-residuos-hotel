import React from 'react';
import { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BarChart3, PieChart, TrendingUp, Filter, X } from 'lucide-react';
import { WasteRecord } from '../types';
import { formatearFechaLocal } from '../utils/dateUtils'; // <--- AQUÍ AGREGUÉ LA IMPORTACIÓN

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

interface DashboardProps {
  records: WasteRecord[];
}

// Definir TODOS los tipos de residuos disponibles
const ALL_WASTE_TYPES = [
  'Orgánicos',
  'Orgánicos (naranja/limón)',
  'Inorgánicos - no valorizables',
  'Pet',
  'Plástico duro',
  'Emplaye',
  'BOPP (envolturas)',
  'Vidrio',
  'Aluminio',
  'Cartón',
  'Papel, libros, revistas y periódicos',
  'Lata de conserva o latón',
  'Tetrapak',
  'Textiles',
  'Chatarra',
  'Café para composta',
  'Residuos para rancho'
];

// Definir TODAS las ubicaciones disponibles
const ALL_LOCATIONS = [
  'NA (No aplica)',
  'Áreas públicas',
  'Albercas',
  'Almacén',
  'Ama de llaves',
  'Audio visual',
  'Banquetes',
  'Barefoot',
  'Bares',
  'Barracuda',
  'Bodas',
  'Bordeaux',
  'Carpintería',
  'Club Preferred',
  'Cocina central',
  'Coco Café',
  'Comedor empleados',
  'Comisariato',
  'Edificios',
  'El Patio',
  'Entretenimiento',
  'Especialidades',
  'Eventos/Banquetes',
  'Himitsu',
  'Jardinería',
  'Lavandería',
  'Limpieza de playa',
  'Manatees',
  'Mantenimiento',
  'Market',
  'Market Café',
  'Minibares/Servibar',
  'Oceana',
  'Oficinas',
  'Poblado',
  'Portofino',
  'Proveedores',
  'RH',
  'Room Service/IRD',
  'Seaside',
  'Seaside Grill',
  'Seguridad',
  'Sommelier',
  'Spa',
  'Steward',
  'Tiendas',
  'Tiendita colegas',
  'UVC',
  'Chatos'
];

export default function Dashboard({ records }: DashboardProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as string[],
    locations: [] as string[],
    startDate: '',
    endDate: '',
    minWeight: '',
    maxWeight: '',
    startTime: '',
    endTime: ''
  });

  // Apply filters to records - Multi-select support
  const filteredRecords = records.filter(record => {
    // Multi-select: if array has items, record must be in the array
    if (filters.types.length > 0 && !filters.types.includes(record.type)) return false;
    if (filters.locations.length > 0 && !filters.locations.includes(record.location)) return false;
    if (filters.startDate && record.date < filters.startDate) return false;
    if (filters.endDate && record.date > filters.endDate) return false;
    if (filters.minWeight && record.weight < parseFloat(filters.minWeight)) return false;
    if (filters.maxWeight && record.weight > parseFloat(filters.maxWeight)) return false;
    if (filters.startTime && record.time < filters.startTime) return false;
    if (filters.endTime && record.time > filters.endTime) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      types: [],
      locations: [],
      startDate: '',
      endDate: '',
      minWeight: '',
      maxWeight: '',
      startTime: '',
      endTime: ''
    });
  };

  const hasActiveFilters = filters.types.length > 0 || filters.locations.length > 0 ||
    Object.entries(filters).some(([key, value]) =>
      key !== 'types' && key !== 'locations' && value !== ''
    );

  // Toggle functions for multi-select
  const toggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const toggleLocation = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  // Determinar qué elementos mostrar en las gráficas
  // Si hay filtros activos, mostrar SOLO los seleccionados
  // Si NO hay filtros, mostrar TODOS los disponibles
  const typesToShow = filters.types.length > 0 ? filters.types : ALL_WASTE_TYPES;
  const locationsToShow = filters.locations.length > 0 ? filters.locations : ALL_LOCATIONS;

  // Process data for charts - Inicializar solo los elementos que se van a mostrar
  const wasteByType = typesToShow.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<string, number>);

  // Sumar los pesos de los registros filtrados
  filteredRecords.forEach(record => {
    if (wasteByType[record.type] !== undefined) {
      wasteByType[record.type] += record.weight;
    }
  });

  const wasteByLocation = locationsToShow.reduce((acc, location) => {
    acc[location] = 0;
    return acc;
  }, {} as Record<string, number>);

  // Sumar los pesos de los registros filtrados
  filteredRecords.forEach(record => {
    if (wasteByLocation[record.location] !== undefined) {
      wasteByLocation[record.location] += record.weight;
    }
  });

  const wasteByDate = filteredRecords.reduce((acc, record) => {
    const date = record.date;
    acc[date] = (acc[date] || 0) + record.weight;
    return acc;
  }, {} as Record<string, number>);

  // Para los filtros, siempre mostrar TODOS los elementos disponibles
  const wasteTypes = ALL_WASTE_TYPES;
  const locations = ALL_LOCATIONS;

  // Generate color palettes with good contrast for large datasets
  const generateBlueShades = (count: number) => {
    // Base colors alternating for better visibility
    const baseColors = [
      '#1E3A8A', '#2563EB', '#3B82F6', '#1E40AF', '#60A5FA',
      '#0C4A6E', '#0369A1', '#0284C7', '#0891B2', '#06B6D4'
    ];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const generateOrangeShades = (count: number) => {
    // Base colors alternating for better visibility
    const baseColors = [
      '#7C2D12', '#C2410C', '#EA580C', '#F97316', '#9A3412',
      '#B45309', '#D97706', '#F59E0B', '#92400E', '#78350F'
    ];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const generateGreenShades = (count: number) => {
    // Softer greens with good contrast
    const baseColors = [
      '#065F46', '#047857', '#059669', '#10B981', '#064E3B',
      '#14B8A6', '#0D9488', '#15803D', '#16A34A', '#22C55E'
    ];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  // Bar Chart Data - Ordenado de mayor a menor
  const sortedWasteByType = Object.entries(wasteByType)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const barData = {
    labels: Object.keys(sortedWasteByType),
    datasets: [
      {
        label: 'Peso (kg)',
        data: Object.values(sortedWasteByType),
        backgroundColor: generateBlueShades(Object.keys(sortedWasteByType).length),
        borderColor: generateBlueShades(Object.keys(sortedWasteByType).length),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Pie Chart Data - Con tonos verdes
  const pieData = {
    labels: Object.keys(wasteByType),
    datasets: [
      {
        data: Object.values(wasteByType),
        backgroundColor: generateGreenShades(Object.keys(wasteByType).length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Line Chart Data
  const sortedDates = Object.keys(wasteByDate).sort();
  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Peso Total por Día (kg)',
        data: sortedDates.map(date => wasteByDate[date]),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  };

  // Location Chart Data - Ordenado de mayor a menor
  const sortedWasteByLocation = Object.entries(wasteByLocation)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const locationData = {
    labels: Object.keys(sortedWasteByLocation),
    datasets: [
      {
        label: 'Peso por Ubicación (kg)',
        data: Object.values(sortedWasteByLocation),
        backgroundColor: generateOrangeShades(Object.keys(sortedWasteByLocation).length),
        borderColor: generateOrangeShades(Object.keys(sortedWasteByLocation).length),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      datalabels: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value.toFixed(1)} kg (${percentage}%)`;
          }
        }
      },
      datalabels: {
        display: true,
        color: (context: any) => {
          // Use white for dark colors, dark text for light colors
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = (value / total) * 100;
          // Only show label if slice is large enough (>5%)
          return percentage > 5 ? '#FFFFFF' : 'transparent';
        },
        font: {
          weight: 'bold' as const,
          size: 11
        },
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowBlur: 4,
        formatter: function(value: number, context: any) {
          const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          // Only show if >5%
          if (parseFloat(percentage) <= 5) return '';
          return `${value.toFixed(1)}kg\n${percentage}%`;
        }
      }
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard de Residuos</h2>
          
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && (
                <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                  Activos
                </span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros Comparativos (Multi-selección)</h3>

            {/* Multi-select Type Filter - Lista Visual */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipos de Residuo ({filters.types.length} seleccionado{filters.types.length !== 1 ? 's' : ''}):
              </label>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                {wasteTypes.map((type, index) => (
                  <div
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                      filters.types.includes(type)
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    } ${index !== wasteTypes.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      filters.types.includes(type)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {filters.types.includes(type) && (
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${
                      filters.types.includes(type) ? 'font-medium text-blue-900' : 'text-gray-700'
                    }`}>
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-select Location Filter - Lista Visual */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ubicaciones ({filters.locations.length} seleccionada{filters.locations.length !== 1 ? 's' : ''}):
              </label>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                {locations.map((location, index) => (
                  <div
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                      filters.locations.includes(location)
                        ? 'bg-orange-50 border-l-4 border-l-orange-600'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    } ${index !== locations.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      filters.locations.includes(location)
                        ? 'bg-orange-600 border-orange-600'
                        : 'border-gray-300'
                    }`}>
                      {filters.locations.includes(location) && (
                        <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${
                      filters.locations.includes(location) ? 'font-medium text-orange-900' : 'text-gray-700'
                    }`}>
                      {location}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio:
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin:
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso Mínimo (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.minWeight}
                  onChange={(e) => setFilters(prev => ({ ...prev, minWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso Máximo (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.maxWeight}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio:
                </label>
                <input
                  type="time"
                  value={filters.startTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin:
                </label>
                <input
                  type="time"
                  value={filters.endTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredRecords.length} de {records.length} registros
            </div>
          </div>
        )}

        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">
              {records.length === 0 ? 'No hay datos registrados' : 'No hay registros que coincidan con los filtros'}
            </p>
            <p className="text-sm text-gray-400">
              {records.length === 0 
                ? 'Los gráficos aparecerán cuando registres residuos'
                : 'Ajusta los filtros para ver más resultados'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="bg-gray-50 rounded-lg p-4 w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Residuos por Tipo
              </h3>
              <div className="h-80">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>

            {/* Location Chart */}
            <div className="bg-gray-50 rounded-lg p-4 w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Residuos por Ubicación
              </h3>
              <div className="h-80">
                <Bar data={locationData} options={chartOptions} />
              </div>
            </div>

            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  Distribución
                </h3>
                <div className="h-64">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Tendencia Temporal
                </h3>
                <div className="h-64">
                  <Line data={lineData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Records Table */}
      {filteredRecords.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {hasActiveFilters ? 'Registros Filtrados' : 'Registros Recientes'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ubicación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Peso (kg)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Notas</th>
                </tr>
              </thead>
              <tbody>
                {(hasActiveFilters ? filteredRecords : filteredRecords.slice(-10)).reverse().map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {record.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {record.weight.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {/* AQUÍ ESTÁ LA CORRECCIÓN APLICADA: */}
                      {formatearFechaLocal(`${record.date}T${record.time}Z`)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}