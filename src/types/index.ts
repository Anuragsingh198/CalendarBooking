export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface Call {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM format (24h)
  type: 'onboarding' | 'followup';
  recurring: boolean;
  dayOfWeek?: number; // 0-6 for recurring calls
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  call?: Call;
  conflicted?: boolean;
}

export interface BookingFormData {
  clientId: string;
  callType: 'onboarding' | 'followup';
  date: string;
  time: string;
}

export type Theme = 'light' | 'dark';