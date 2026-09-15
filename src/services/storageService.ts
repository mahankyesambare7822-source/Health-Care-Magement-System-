import {
  Patient,
  Doctor,
  Department,
  Appointment,
  Prescription,
  DoctorAvailabilityConfig,
  StaffMember,
  QueueItem,
  HealthReminder,
  MedicationSchedule,
  PatientNotification,
  PatientFeedback,
  DoctorClinicalNote,
  User,
  AppointmentStatus,
  QueueStatus,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_DOCTOR_AVAILABILITY,
  INITIAL_STAFF,
  INITIAL_QUEUE,
  INITIAL_HEALTH_REMINDERS,
  INITIAL_MEDICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FEEDBACK,
  INITIAL_CLINICAL_NOTES,
  DEMO_USERS,
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'hms_clean_v4_current_user',
  PATIENTS: 'hms_clean_v4_patients',
  DOCTORS: 'hms_clean_v4_doctors',
  DEPARTMENTS: 'hms_clean_v4_departments',
  APPOINTMENTS: 'hms_clean_v4_appointments',
  PRESCRIPTIONS: 'hms_clean_v4_prescriptions',
  AVAILABILITY: 'hms_clean_v4_availability',
  STAFF: 'hms_clean_v4_staff',
  QUEUE: 'hms_clean_v4_queue',
  REMINDERS: 'hms_clean_v4_reminders',
  MEDICATIONS: 'hms_clean_v4_medications',
  NOTIFICATIONS: 'hms_clean_v4_notifications',
  FEEDBACK: 'hms_clean_v4_feedback',
  CLINICAL_NOTES: 'hms_clean_v4_clinical_notes',
};

// Purge any legacy demo data from previous sessions to ensure a clean slate
try {
  const legacyPrefixes = ['hms_current_user', 'hms_patients', 'hms_doctors', 'hms_appointments', 'hms_prescriptions', 'hms_staff', 'hms_queue', 'hms_reminders', 'hms_medications', 'hms_notifications', 'hms_feedback', 'hms_clinical_notes'];
  legacyPrefixes.forEach((prefix) => {
    localStorage.removeItem(prefix);
    localStorage.removeItem(`${prefix}_v2`);
    localStorage.removeItem(`${prefix}_v3`);
  });
} catch {
  // Ignore in SSR/test environments
}

// Safe JSON storage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed reading storage key "${key}":`, err);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed writing storage key "${key}":`, err);
  }
}

export const StorageService = {
  // Current User / Persona
  getCurrentUser(): User | null {
    return getLocal<User | null>(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  },
  setCurrentUser(user: User | null): void {
    setLocal(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Patients
  getPatients(): Patient[] {
    return getLocal<Patient[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  },
  savePatients(patients: Patient[]): void {
    setLocal(STORAGE_KEYS.PATIENTS, patients);
  },
  addPatient(patientData: Omit<Patient, 'id' | 'patientId'>): Patient {
    const patients = this.getPatients();
    const newSeq = 100 + patients.length + 1;
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      patientId: `PT-2026-${newSeq}`,
    };
    const updated = [newPatient, ...patients];
    this.savePatients(updated);
    return newPatient;
  },
  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const patients = this.getPatients();
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updatedPatient = { ...patients[index], ...updates };
    patients[index] = updatedPatient;
    this.savePatients(patients);
    return updatedPatient;
  },
  getPatientById(id: string): Patient | undefined {
    return this.getPatients().find((p) => p.id === id || p.patientId === id);
  },

  // Doctors
  getDoctors(): Doctor[] {
    return getLocal<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },
  saveDoctors(doctors: Doctor[]): void {
    setLocal(STORAGE_KEYS.DOCTORS, doctors);
  },
  addDoctor(doctorData: Omit<Doctor, 'id'>): Doctor {
    const doctors = this.getDoctors();
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
    };
    const updated = [...doctors, newDoc];
    this.saveDoctors(updated);

    // Sync department stats
    const depts = this.getDepartments();
    const deptIdx = depts.findIndex(
      (d) => d.name.toLowerCase() === newDoc.department.toLowerCase()
    );
    if (deptIdx !== -1) {
      depts[deptIdx].doctorCount = (depts[deptIdx].doctorCount || 0) + 1;
      if (!depts[deptIdx].headDoctor || depts[deptIdx].headDoctor === 'To be assigned') {
        depts[deptIdx].headDoctor = newDoc.name;
      }
      this.saveDepartments(depts);
    }

    return newDoc;
  },
  deleteDoctor(id: string): void {
    const docs = this.getDoctors().filter((d) => d.id !== id);
    this.saveDoctors(docs);
  },
  deletePatient(id: string): void {
    const pats = this.getPatients().filter((p) => p.id !== id);
    this.savePatients(pats);
  },
  updateDoctor(id: string, updates: Partial<Doctor>): Doctor | null {
    const docs = this.getDoctors();
    const index = docs.findIndex((d) => d.id === id);
    if (index === -1) return null;
    docs[index] = { ...docs[index], ...updates };
    this.saveDoctors(docs);
    return docs[index];
  },
  getDoctorById(id: string): Doctor | undefined {
    return this.getDoctors().find((d) => d.id === id);
  },

  // Departments
  getDepartments(): Department[] {
    return getLocal<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },
  saveDepartments(departments: Department[]): void {
    setLocal(STORAGE_KEYS.DEPARTMENTS, departments);
  },

  // Appointments
  getAppointments(): Appointment[] {
    return getLocal<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },
  saveAppointments(appointments: Appointment[]): void {
    setLocal(STORAGE_KEYS.APPOINTMENTS, appointments);
  },
  addAppointment(
    appointmentData: Omit<Appointment, 'id' | 'status'> & { status?: AppointmentStatus }
  ): Appointment {
    const appointments = this.getAppointments();
    const nextNum = appointments.length + 101;
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-2026-${String(nextNum).padStart(5, '0')}`,
      status: appointmentData.status || 'Scheduled',
    };
    const updated = [newAppointment, ...appointments];
    this.saveAppointments(updated);

    // Auto add notification for the patient
    this.addNotification({
      patientId: newAppointment.patientId,
      patientName: newAppointment.patientName,
      title: 'Appointment Confirmed',
      message: `Your appointment with ${newAppointment.doctorName} (${newAppointment.department}) is confirmed for ${newAppointment.date} at ${newAppointment.time}.`,
      channel: 'In-App',
      priority: 'High',
      read: false,
    });

    // Auto create Queue item if scheduled for current/today's date
    const queue = this.getQueue();
    const token = 100 + queue.length + 1;
    this.addQueueItem({
      tokenNumber: token,
      appointmentId: newAppointment.id,
      patientId: newAppointment.patientId,
      patientName: newAppointment.patientName,
      doctorId: newAppointment.doctorId,
      doctorName: newAppointment.doctorName,
      department: newAppointment.department,
      appointmentTime: newAppointment.time,
      status: 'Waiting',
    });

    return newAppointment;
  },
  updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment | null {
    const appointments = this.getAppointments();
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) return null;
    appointments[index].status = status;
    this.saveAppointments(appointments);

    // Also update queue if exists
    const queue = this.getQueue();
    const qIndex = queue.findIndex((q) => q.appointmentId === id);
    if (qIndex !== -1) {
      if (status === 'Completed') {
        queue[qIndex].status = 'Completed';
        this.saveQueue(queue);
      }
    }

    return appointments[index];
  },
  isSlotBooked(doctorId: string, date: string, time: string): boolean {
    const appointments = this.getAppointments();
    return appointments.some(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.time === time &&
        a.status !== 'Cancelled'
    );
  },

  // Prescriptions
  getPrescriptions(): Prescription[] {
    return getLocal<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },
  savePrescriptions(prescriptions: Prescription[]): void {
    setLocal(STORAGE_KEYS.PRESCRIPTIONS, prescriptions);
  },
  addPrescription(prescription: Omit<Prescription, 'id'>): Prescription {
    const list = this.getPrescriptions();
    const newId = `rx-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newPrescription: Prescription = {
      ...prescription,
      id: newId,
    };
    this.savePrescriptions([newPrescription, ...list]);

    // Add reminder for follow-up if date is provided
    if (prescription.followUpDate) {
      this.addReminder({
        patientId: prescription.patientId,
        patientName: prescription.patientName,
        category: 'Follow-up',
        title: `Clinical Follow-up with ${prescription.doctorName}`,
        dueDate: prescription.followUpDate,
        status: 'Pending',
        notes: `Follow-up consultation advised for ${prescription.diagnosis}.`,
      });
    }

    // Add patient notification
    this.addNotification({
      patientId: prescription.patientId,
      patientName: prescription.patientName,
      title: 'New Digital Prescription Available',
      message: `${prescription.doctorName} has issued a prescription with ${prescription.items.length} prescribed medications.`,
      channel: 'In-App',
      priority: 'Medium',
      read: false,
    });

    return newPrescription;
  },

  // Queue Management
  getQueue(): QueueItem[] {
    return getLocal<QueueItem[]>(STORAGE_KEYS.QUEUE, INITIAL_QUEUE);
  },
  saveQueue(queue: QueueItem[]): void {
    setLocal(STORAGE_KEYS.QUEUE, queue);
  },
  addQueueItem(item: QueueItem): void {
    const queue = this.getQueue();
    this.saveQueue([...queue, item]);
  },
  addQueueEntry(entry: Partial<QueueItem>): QueueItem {
    const queue = this.getQueue();
    const token = entry.tokenNumber || `T-${100 + queue.length + 1}`;
    const newEntry: QueueItem = {
      id: entry.id || `q-${Date.now()}`,
      tokenNumber: token,
      appointmentId: entry.appointmentId || `apt-walkin-${Date.now()}`,
      patientId: entry.patientId || '',
      patientName: entry.patientName || '',
      doctorId: entry.doctorId || '',
      doctorName: entry.doctorName || '',
      department: entry.department || 'General OPD',
      appointmentTime: entry.appointmentTime || 'Walk-in',
      status: entry.status || 'Waiting',
      roomNumber: entry.roomNumber || 'Room 101',
      checkInTime: entry.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMins: entry.estimatedWaitMins ?? (queue.filter((q) => q.status === 'Waiting').length * 15),
    };
    this.saveQueue([...queue, newEntry]);
    return newEntry;
  },
  updateQueueStatus(identifier: number | string, status: QueueStatus): QueueItem[] {
    const queue = this.getQueue();
    const updated = queue.map((q) => {
      if (q.tokenNumber === identifier || q.id === identifier || String(q.tokenNumber) === String(identifier)) {
        return { ...q, status };
      }
      return q;
    });
    this.saveQueue(updated);
    return updated;
  },

  // Doctor Availability
  getAvailability(): DoctorAvailabilityConfig[] {
    return getLocal<DoctorAvailabilityConfig[]>(
      STORAGE_KEYS.AVAILABILITY,
      INITIAL_DOCTOR_AVAILABILITY
    );
  },
  saveAvailability(list: DoctorAvailabilityConfig[]): void {
    setLocal(STORAGE_KEYS.AVAILABILITY, list);
  },
  addAvailability(config: Omit<DoctorAvailabilityConfig, 'id'>): DoctorAvailabilityConfig {
    const list = this.getAvailability();
    const newConfig: DoctorAvailabilityConfig = {
      ...config,
      id: `avail-${Date.now()}`,
    };
    this.saveAvailability([...list, newConfig]);
    return newConfig;
  },

  // Staff
  getStaff(): StaffMember[] {
    return getLocal<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  },
  saveStaff(staff: StaffMember[]): void {
    setLocal(STORAGE_KEYS.STAFF, staff);
  },
  addStaff(member: StaffMember): StaffMember[] {
    const list = this.getStaff();
    const updated = [member, ...list];
    this.saveStaff(updated);
    return updated;
  },

  // Health Reminders
  getReminders(): HealthReminder[] {
    return getLocal<HealthReminder[]>(STORAGE_KEYS.REMINDERS, INITIAL_HEALTH_REMINDERS);
  },
  saveReminders(reminders: HealthReminder[]): void {
    setLocal(STORAGE_KEYS.REMINDERS, reminders);
  },
  toggleReminderStatus(id: string): HealthReminder | null {
    const reminders = this.getReminders();
    let updatedItem: HealthReminder | null = null;
    const updated = reminders.map((r) => {
      if (r.id === id) {
        updatedItem = {
          ...r,
          status: r.status === 'Pending' ? ('Sent' as const) : ('Pending' as const),
        };
        return updatedItem;
      }
      return r;
    });
    this.saveReminders(updated);
    return updatedItem;
  },
  addReminder(reminder: Omit<HealthReminder, 'id'>): HealthReminder {
    const list = this.getReminders();
    const newItem: HealthReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
    };
    this.saveReminders([newItem, ...list]);
    return newItem;
  },

  // Medications
  getMedications(): MedicationSchedule[] {
    return getLocal<MedicationSchedule[]>(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS);
  },
  saveMedications(meds: MedicationSchedule[]): void {
    setLocal(STORAGE_KEYS.MEDICATIONS, meds);
  },
  toggleMedicationTaken(id: string): MedicationSchedule | null {
    const meds = this.getMedications();
    let updatedItem: MedicationSchedule | null = null;
    const updated = meds.map((m) => {
      if (m.id === id) {
        updatedItem = { ...m, takenToday: !m.takenToday };
        return updatedItem;
      }
      return m;
    });
    this.saveMedications(updated);
    return updatedItem;
  },

  // Notifications
  getNotifications(): PatientNotification[] {
    return getLocal<PatientNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  saveNotifications(notifs: PatientNotification[]): void {
    setLocal(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  addNotification(notif: Omit<PatientNotification, 'id' | 'timestamp'>): PatientNotification {
    const notifs = this.getNotifications();
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newNotif: PatientNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: timeStr,
    };
    this.saveNotifications([newNotif, ...notifs]);
    return newNotif;
  },
  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
  },
  markNotificationAsRead(id: string): void {
    this.markNotificationRead(id);
  },

  // Feedback
  getFeedback(): PatientFeedback[] {
    return getLocal<PatientFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  },
  addFeedback(feedback: Omit<PatientFeedback, 'id' | 'date'>): PatientFeedback {
    const list = this.getFeedback();
    const newItem: PatientFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setLocal(STORAGE_KEYS.FEEDBACK, [newItem, ...list]);
    return newItem;
  },

  // Clinical Notes
  getClinicalNotes(): DoctorClinicalNote[] {
    return getLocal<DoctorClinicalNote[]>(STORAGE_KEYS.CLINICAL_NOTES, INITIAL_CLINICAL_NOTES);
  },
  addClinicalNote(note: Omit<DoctorClinicalNote, 'id' | 'date'>): DoctorClinicalNote {
    const notes = this.getClinicalNotes();
    const newNote: DoctorClinicalNote = {
      ...note,
      id: `cn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newNote, ...notes];
    setLocal(STORAGE_KEYS.CLINICAL_NOTES, updated);
    return newNote;
  },

  // Complete Reset of Demo Data
  resetAllDemoData(): void {
    setLocal(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
    setLocal(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    setLocal(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    setLocal(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    setLocal(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    setLocal(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    setLocal(STORAGE_KEYS.AVAILABILITY, INITIAL_DOCTOR_AVAILABILITY);
    setLocal(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    setLocal(STORAGE_KEYS.QUEUE, INITIAL_QUEUE);
    setLocal(STORAGE_KEYS.REMINDERS, INITIAL_HEALTH_REMINDERS);
    setLocal(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS);
    setLocal(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setLocal(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    setLocal(STORAGE_KEYS.CLINICAL_NOTES, INITIAL_CLINICAL_NOTES);
  },
  resetToSeed(): void {
    this.resetAllDemoData();
  },
};
