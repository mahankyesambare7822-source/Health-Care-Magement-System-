export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  department?: string;
  title: string;
  patientProfileId?: string;
  doctorId?: string;
}

export interface Patient {
  id: string;
  patientId: string; // e.g. "PT-2026-101"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  insuranceId?: string;
  insuranceProvider: string;
  status: 'Active' | 'Discharged' | 'Outpatient';
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  admissionDate: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: string;
    spO2: number;
    weightKg: number;
    bmi: number;
    lastUpdated: string;
  };
  allergies: string[];
  chronicConditions: string[];
  recentNotes: string;
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  type: 'Routine Checkup' | 'Consultation' | 'Follow-up' | 'Lab Review';
  appointmentMode?: 'In-person' | 'Online consultation (demo)';
  status: AppointmentStatus;
  notes?: string;
  room?: string;
  symptoms?: string;
  consultationData?: {
    symptoms: string;
    observations: string;
    assessment: string;
    followUpDate?: string;
    completedAt?: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  qualification: string;
  department: string;
  specialization: string;
  experienceYears: number;
  email: string;
  phone: string;
  room: string;
  availability: string;
  availableDays: string[];
  consultationType: string;
  rating: number;
  reviewCount: number;
  photoUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headDoctor: string;
  doctorCount: number;
  availableSlotInfo: string;
  iconName: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  instructions?: string;
  followUpDate?: string;
}

export type AppointmentMode = 'In-person' | 'Online consultation (demo)' | 'Video Consultation';

export type QueueStatus = 'Waiting' | 'In Consultation' | 'With Doctor' | 'Completed';

export interface QueueItem {
  id?: string;
  tokenNumber: number | string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentTime?: string;
  status: QueueStatus | 'Waiting' | 'With Doctor' | 'Completed';
  roomNumber?: string;
  checkInTime?: string;
  estimatedWaitMins?: number;
}

export type QueueEntry = QueueItem;

export interface DoctorAvailabilityConfig {
  id: string;
  doctorId: string;
  doctorName: string;
  department: string;
  day: string; // e.g. 'Monday'
  startTime: string; // '10:00 AM'
  endTime: string; // '01:00 PM'
  slotDurationMinutes: number; // 30
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Doctor' | 'Receptionist' | 'Administrator' | 'Nurse' | 'Lab Tech';
  department: string;
  email: string;
  phone: string;
  shift: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave' | 'Active';
  joinDate?: string;
}

export interface HealthReminder {
  id: string;
  patientId: string;
  patientName: string;
  category: 'Vaccination' | 'Screening' | 'Lifestyle' | 'Medication' | 'Follow-up';
  title: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Dismissed';
  notes: string;
}

export interface MedicationSchedule {
  id: string;
  patientId: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  takenToday: boolean;
  prescribedBy: string;
}

export interface PatientNotification {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  message: string;
  channel: 'In-App' | 'Simulated SMS' | 'Simulated Email';
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
  read: boolean;
}

export interface PatientFeedback {
  id: string;
  patientName: string;
  patientId?: string;
  doctorId?: string;
  doctorName?: string;
  rating: number; // 1-5
  department: string;
  comment: string;
  date: string;
}

export interface DoctorClinicalNote {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  subject: string;
  assessment: string;
  plan: string;
}

export interface FutureModuleInfo {
  id: string;
  title: string;
  status: 'Coming Soon' | 'Under Development' | 'Planned' | 'Future Enhancement';
  completionPercent: number;
  plannedPhase: string;
  leadResearcher: string;
  description: string;
  technicalPrerequisites: string[];
  architectureOverview: string;
  mockPayloadExample: string;
  riskAssessment: string;
}

