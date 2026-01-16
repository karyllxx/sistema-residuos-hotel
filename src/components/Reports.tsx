import React, { useState } from 'react';
import { FileText, Download, Calendar, Trash2, Mail, Filter, Send, FileSpreadsheet } from 'lucide-react';
import { WasteRecord } from '../types';
import { deleteWasteRecord, getEmailConfigs, addEmailConfig, deleteEmailConfig } from '../utils/storage';
import { formatearFechaLocal } from '../utils/dateUtils'; // <--- 1. IMPORTACIÓN AGREGADA

interface ReportsProps {
  records: WasteRecord[];
  onRecordDeleted: () => void;
}

type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

export default function Reports({ records, onRecordDeleted }: ReportsProps) {
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'weight'>('date');
  const [filterType, setFilterType] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newEmailName, setNewEmailName] = useState('');
  const [emailConfigs, setEmailConfigs] = useState(getEmailConfigs());

  const [downloadFormat, setDownloadFormat] = useState<'json' | 'csv' | 'pdf'>('csv');

  // Get date range based on period
  // CORRECCIÓN: Aseguramos que las fechas cubran el día completo (00:00 a 23:59)
  const getDateRange = () => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (reportPeriod) {
      case 'daily':
        start = new Date(today);
        start.setHours(0, 0, 0, 0); // Inicio del día
        end = new Date(today);
        end.setHours(23, 59, 59, 999); // Fin del día
        break;
      case 'weekly':
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        start = oneWeekAgo;
        start.setHours(0, 0, 0, 0);
        end = new Date(today);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        // CORRECCIÓN: Fecha usando las partes (año, mes, día)
        // TIEMPO LOCAL (Cancún), no UTC.
        if (startDate) {
          const [year, month, day] = startDate.split('-').map(Number);
          start = new Date(year, month - 1, day); 
          start.setHours(0, 0, 0, 0);
        }
        
        if (endDate) {
          const [year, month, day] = endDate.split('-').map(Number);
          end = new Date(year, month - 1, day);
          end.setHours(23, 59, 59, 999);
        }
        break;
    }

    return { start, end };
  };

  const { start: dateStart, end: dateEnd } = getDateRange();

  // Filter and sort records
  const filteredRecords = records
    .filter(record => !filterType || record.type === filterType)
    .filter(record => !filterLocation || record.location === filterLocation)
    .filter(record => {
      // CORRECCIÓN IMPORTANTE:
      // Al compararla con dateStart (que es hora local del navegador), la conversión es automática y correcta.
      const recordDate = new Date(`${record.date}T${record.time}Z`);
      return recordDate >= dateStart && recordDate <= dateEnd;
    })
    .sort((a, b) => {
      // Ordenamiento para usar la fecha completa UTC
      const dateA = new Date(`${a.date}T${a.time}Z`).getTime();
      const dateB = new Date(`${b.date}T${b.time}Z`).getTime();
      
      switch (sortBy) {
        case 'date':
          return dateB - dateA;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'weight':
          return b.weight - a.weight;
        default:
          return 0;
      }
    });

  const wasteTypes = Array.from(new Set(records.map(record => record.type)));
  const locations = Array.from(new Set(records.map(record => record.location)));
  const totalWeight = filteredRecords.reduce((sum, record) => sum + record.weight, 0);
  const averageWeight = filteredRecords.length > 0 ? totalWeight / filteredRecords.length : 0;

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
      deleteWasteRecord(id);
      onRecordDeleted();
    }
  };

  const handleAddEmail = () => {
    if (newEmail && newEmailName) {
      const emailConfig = addEmailConfig({
        email: newEmail,
        name: newEmailName,
        active: true
      });
      setEmailConfigs([...emailConfigs, emailConfig]);
      setNewEmail('');
      setNewEmailName('');
    }
  };

  const handleDeleteEmail = (id: string) => {
    deleteEmailConfig(id);
    setEmailConfigs(emailConfigs.filter(email => email.id !== id));
  };

  const sendReport = () => {
    const activeEmails = emailConfigs.filter(config => config.active);
    if (activeEmails.length === 0) {
      alert('No hay correos configurados para enviar el reporte');
      return;
    }

    // Simulate sending email
    alert(`Reporte enviado a ${activeEmails.length} destinatario(s): ${activeEmails.map(e => e.email).join(', ')}`);
  };

  const generateCSVReport = () => {
    const periodText = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      custom: 'Personalizado'
    };

    // CSV Headers
    const headers = [
      'Tipo de Residuo',
      'Ubicación',
      'Peso (kg)',
      'Fecha y Hora', // Combinamos columna para simplificar
      'Notas',
      'Creado por'
    ];

    // CSV Data
    const csvData = filteredRecords.map(record => [
      record.type,
      record.location,
      record.weight.toString(),
      // CORRECCIÓN: Función para que el Excel salga con la hora correcta
      formatearFechaLocal(`${record.date}T${record.time}Z`), 
      record.notes || '',
      record.createdBy
    ]);

    // Create CSV content
    const csvContent = [
      [`Reporte ${periodText[reportPeriod]} de Residuos Sólidos`],
      [`Hotel: Secrets Playa Blanca Costa Mujeres`],
      [`Fecha de generación: ${new Date().toLocaleString('es-MX')}`],
      [`Período: ${dateStart.toLocaleDateString('es-MX')} - ${dateEnd.toLocaleDateString('es-MX')}`],
      [`Total de registros: ${filteredRecords.length}`],
      [`Peso total: ${totalWeight.toFixed(2)} kg`],
      [],
      headers,
      ...csvData
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${reportPeriod}-${dateStart.toISOString().split('T')[0]}-${dateEnd.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateJSONReport = () => {
    const periodText = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      custom: 'Personalizado'
    };

    const reportData = {
      titulo: `Reporte ${periodText[reportPeriod]} de Residuos Sólidos`,
      hotel: 'Secrets Playa Blanca Costa Mujeres',
      fechaGeneracion: new Date().toLocaleString('es-MX'),
      periodo: {
        tipo: periodText[reportPeriod],
        fechaInicio: dateStart.toLocaleDateString('es-MX'),
        fechaFin: dateEnd.toLocaleDateString('es-MX')
      },
      estadisticas: {
        totalRegistros: filteredRecords.length,
        pesoTotal: totalWeight.toFixed(2) + ' kg',
        pesoPromedio: averageWeight.toFixed(2) + ' kg',
        tiposResiduos: wasteTypes.length,
        ubicaciones: locations.length
      },
      registros: filteredRecords.map(r => ({
          ...r,
          // Campo formateado al JSON 
          formattedDate: formatearFechaLocal(`${r.date}T${r.time}Z`)
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${reportPeriod}-${dateStart.toISOString().split('T')[0]}-${dateEnd.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDFReport = () => {
    // For PDF generation, we'll create an HTML version that can be printed as PDF
    const periodText = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      custom: 'Personalizado'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Residuos Sólidos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte ${periodText[reportPeriod]} de Residuos Sólidos</h1>
          <h2>Secrets Playa Blanca Costa Mujeres</h2>
          <p>Fecha de generación: ${new Date().toLocaleString('es-MX')}</p>
          <p>Período: ${dateStart.toLocaleDateString('es-MX')} - ${dateEnd.toLocaleDateString('es-MX')}</p>
        </div>
        
        <div class="stats">
          <div class="stat">
            <h3>${filteredRecords.length}</h3>
            <p>Total Registros</p>
          </div>
          <div class="stat">
            <h3>${totalWeight.toFixed(2)} kg</h3>
            <p>Peso Total</p>
          </div>
          <div class="stat">
            <h3>${averageWeight.toFixed(2)} kg</h3>
            <p>Peso Promedio</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Peso (kg)</th>
              <th>Fecha y Hora</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map(record => `
              <tr>
                <td>${record.type}</td>
                <td>${record.location}</td>
                <td>${record.weight.toFixed(1)}</td>
                <td>${formatearFechaLocal(`${record.date}T${record.time}Z`)}</td>
                <td>${record.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Generado automáticamente por el Sistema de Gestión de Residuos Sólidos</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
          URL.revokeObjectURL(url);
        }, 500);
      };
    }
  };

  const handleDownload = () => {
    switch (downloadFormat) {
      case 'csv':
        generateCSVReport();
        break;
      case 'json':
        generateJSONReport();
        break;
      case 'pdf':
        generatePDFReport();
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Reportes y Registros</h2>
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="csv">Excel/CSV</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <button
              onClick={() => setShowEmailConfig(!showEmailConfig)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Mail className="w-4 h-4" />
              Emails
            </button>
            <button
              onClick={sendReport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              {downloadFormat === 'csv' ? (
                <FileSpreadsheet className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Descargar
            </button>
          </div>
        </div>

        {/* Email Configuration */}
        {showEmailConfig && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Correos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre"
                value={newEmailName}
                onChange={(e) => setNewEmailName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agregar
              </button>
            </div>

            <div className="space-y-2">
              {emailConfigs.map((config) => (
                <div key={config.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{config.name}</span>
                    <span className="text-gray-600 ml-2">({config.email})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEmail(config.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Period Selection */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            Filtros de Reporte
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período:
              </label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value as ReportPeriod)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            {reportPeriod === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Registros</span>
            </div>
            <span className="text-2xl font-bold text-blue-900">{filteredRecords.length}</span>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Peso Total</span>
            </div>
            <span className="text-2xl font-bold text-green-900">{totalWeight.toFixed(1)} kg</span>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Promedio</span>
            </div>
            <span className="text-2xl font-bold text-yellow-900">{averageWeight.toFixed(1)} kg</span>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Ubicaciones</span>
            </div>
            <span className="text-2xl font-bold text-purple-900">{locations.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Fecha</option>
              <option value="type">Tipo</option>
              <option value="weight">Peso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por tipo:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por ubicación:
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las ubicaciones</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Records Table */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No hay registros disponibles</p>
            <p className="text-sm text-gray-400">
              {filterType || filterLocation ? 'No se encontraron registros para los filtros seleccionados' : 'Comienza agregando registros de residuos'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ubicación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Peso (kg)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha y Hora</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Notas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
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
                      {/* CORRECCIÓN FINAL EN LA TABLA VISUAL */}
                      {formatearFechaLocal(`${record.date}T${record.time}Z`)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs">
                      <div className="truncate" title={record.notes}>
                        {record.notes || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}