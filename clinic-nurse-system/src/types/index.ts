// This file exports TypeScript interfaces and types used throughout the application.

export interface DoctorDiagnosis {
  caseId: string;
  idCard: string;
  name: string;
  chief: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    instructions: string; 
  }>;
  notes?: string;
  appointment?: {
    id: string;
    date: string;
    room?: string;
  };
}

export interface Appointment {
  id: string;
  hn: string;
  patient_name?: string;
  name?: string;
  scheduled_at?: string;
  chief?: string;
  chief_complaint?: string;
  flags?: string[];
  room?: string;
}

export interface QueueItem {
  q: string;
  hn: string;
  name: string;
  type: string;
  status: string;
  room: string;
  apptId: string | null;
  triage: string;
}

export interface Patient {
  hn: string;
  name: string;
  phone: string;
  dob: string;
  apptId: string;
  chief: string;
  allergies: string;
  pmh: string;
  meds: string;
  urgency: string;
  idCard?: string;
  prefix?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string;
  province?: string;
  district?: string;
  rights?: string;
  email?: string;
  lineId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  additionalSymptom?: string;
}

export interface Vitals {
  sys: string;
  dia: string;
  hr: string;
  rr: string;
  temp: string;
  spo2: string;
  wt: string;
  ht: string;
}