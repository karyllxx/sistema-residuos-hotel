// API client para comunicación con backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Autenticación
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Usuarios
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // Registros de residuos
  async getWasteRecords(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/waste-records${queryParams}`);
  }

  async createWasteRecord(recordData: any) {
    return this.request('/waste-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  async updateWasteRecord(id: string, recordData: any) {
    return this.request(`/waste-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recordData),
    });
  }

  async deleteWasteRecord(id: string) {
    return this.request(`/waste-records/${id}`, { method: 'DELETE' });
  }

  // Configuración de emails
  async getEmailConfigs() {
    return this.request('/email-configs');
  }

  async createEmailConfig(emailData: any) {
    return this.request('/email-configs', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }

  async deleteEmailConfig(id: string) {
    return this.request(`/email-configs/${id}`, { method: 'DELETE' });
  }

  // Mensajes de operadores
  async getOperatorMessages() {
    return this.request('/operator-messages');
  }

  async createOperatorMessage(messageData: any) {
    return this.request('/operator-messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(id: string) {
    return this.request(`/operator-messages/${id}/read`, { method: 'PUT' });
  }

  // Reportes
  async generateReport(filters: any, format: 'pdf' | 'excel' | 'csv') {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ ...filters, format }),
    });

    if (!response.ok) {
      throw new Error('Error generating report');
    }

    // Descargar archivo
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const apiClient = new ApiClient();