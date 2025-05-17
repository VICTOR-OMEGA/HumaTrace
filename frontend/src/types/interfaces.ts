
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone: string;
  date_of_birth: Date;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: Date;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Issue {
  id: string;
  name: string;
  severity: 'Low' | 'Medium' | 'High';
  created_at: Date;
}

export interface Diagnosis {
  id: string;
  patient_id: string;
  issue_id: string;
  description: string;
  diagnosed_at: Date;
}

export interface Treatment {
  id: string;
  patient_id: string;
  diagnosis_id: string;
  treatment_plan: string;
  started_at: Date;
  ended_at: Date | null;
}

export interface BirthRecord {
  id: string;
  patient_id: string;
  date_of_birth: Date;
  place_of_birth: string;
  delivery_method: string;
  birth_weight: string;
}

export interface PatientVital {
  id: string;
  patient_id: string;
  height_cm: number;
  weight_kg: number;
  blood_pressure: string;
  temperature_celsius: number;
  recorded_at: Date;
}

export interface Medication {
  id: string;
  name: string;
  type: string;
  description: string;
  side_effects: string;
}

export interface MedicationHistory {
  id: string;
  patient_id: string;
  medication_id: string;
  dosage: string;
  start_date: Date;
  end_date: Date | null;
  notes: string;
}

export interface Test {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface TestResult {
  id: string;
  test_id: string;
  patient_id: string;
  result: string;
  taken_at: Date;
}

export interface Session {
  id: string;
  patient_id: string;
  doctor_id: string;
  started_at: Date;
  ended_at: Date | null;
  notes: string;
}
