export const formatearFechaLocal = (fechaISO: string) => {
  if (!fechaISO) return "-";
  
  const fecha = new Date(fechaISO);
  
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Cancun', // Tu zona horaria
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false 
  }).format(fecha);
};