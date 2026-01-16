export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'operator';
  name: string;
}

export interface WasteRecord {
  id: string;
  type: string;
  location: string;
  weight: number;
  date: string;
  time: string;
  notes?: string;
  createdBy: string;
}

export interface EmailConfig {
  id: string;
  email: string;
  name: string;
  active: boolean;
}

export interface OperatorMessage {
  id: string;
  operatorId: string;
  operatorName: string;
  message: string;
  recordId?: string;
  timestamp: string;
  read: boolean;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'custom';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}