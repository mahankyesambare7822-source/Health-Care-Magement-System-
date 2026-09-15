import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginView } from './pages/LoginView';
import { PatientRegistrationPage } from './pages/PatientRegistrationPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { PatientAppointmentsPage } from './pages/PatientAppointmentsPage';
import { PatientPrescriptionsPage } from './pages/PatientPrescriptionsPage';
import { PatientMedicalRecordsPage } from './pages/PatientMedicalRecordsPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientManagementPage } from './pages/PatientManagementPage';
import { AppointmentManagementPage } from './pages/AppointmentManagementPage';
import { PatientEngagementPage } from './pages/PatientEngagementPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { ReceptionistDashboardPage } from './pages/ReceptionistDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IncompleteModulePage } from './pages/IncompleteModulePage';

import { PatientFormModal } from './components/PatientFormModal';
import { PatientProfileModal } from './components/PatientProfileModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';

import { StorageService } from './services/storageService';
import {
  User,
  UserRole,
  Patient,
  Doctor,
  Department,
  Appointment,
  AppointmentStatus,
  HealthReminder,
  MedicationSchedule,
  PatientNotification,
  PatientFeedback,
  DoctorClinicalNote,
  Prescription,
  QueueEntry,
  StaffMember,
} from './types';
import { DEMO_USERS } from './data/mockData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Authentication & Persona state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return StorageService.getCurrentUser();
  });

  // Current Active Route / View. If logged out, default to 'landing'
  const [currentView, setCurrentView] = useState<string>(() => {
    const user = StorageService.getCurrentUser();
    if (!user) return 'landing';
    if (user.role === 'patient') return 'patient-dashboard';
    if (user.role === 'doctor') return 'doctor-dashboard';
    if (user.role === 'receptionist') return 'receptionist-dashboard';
    return 'admin-dashboard';
  });

  // Initial role for login page if directed from landing
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole>('patient');

  // Booking navigation state
  const [bookingDept, setBookingDept] = useState<string | undefined>(undefined);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | undefined>(undefined);

  // Core Datasets
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [medications, setMedications] = useState<MedicationSchedule[]>([]);
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);
  const [feedback, setFeedback] = useState<PatientFeedback[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<DoctorClinicalNote[]>([]);

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedProfilePatient, setSelectedProfilePatient] = useState<Patient | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedPatientForBooking, setPreselectedPatientForBooking] = useState<Patient | null>(null);

  // Quick Toast alert notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load all initial data from StorageService on mount
  const loadData = useCallback(() => {
    setPatients(StorageService.getPatients());
    setDoctors(StorageService.getDoctors());
    setDepartments(StorageService.getDepartments());
    setAppointments(StorageService.getAppointments());
    setPrescriptions(StorageService.getPrescriptions());
    setQueue(StorageService.getQueue());
    setStaff(StorageService.getStaff());
    setReminders(StorageService.getReminders());
    setMedications(StorageService.getMedications());
    setNotifications(StorageService.getNotifications());
    setFeedback(StorageService.getFeedback());
    setClinicalNotes(StorageService.getClinicalNotes());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auth handlers
  const handleLogin = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role === 'patient') {
      setCurrentView('patient-dashboard');
    } else if (user.role === 'doctor') {
      setCurrentView('doctor-dashboard');
    } else if (user.role === 'receptionist') {
      setCurrentView('receptionist-dashboard');
    } else {
      setCurrentView('admin-dashboard');
    }
    showToast(`Logged in as ${user.name} (${user.role})`);
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView('landing');
    showToast('Logged out of system');
  };

  const handleSelectUser = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    if (user.role === 'patient') {
      setCurrentView('patient-dashboard');
    } else if (user.role === 'doctor') {
      setCurrentView('doctor-dashboard');
    } else if (user.role === 'receptionist') {
      setCurrentView('receptionist-dashboard');
    } else {
      setCurrentView('admin-dashboard');
    }
    showToast(`Switched active persona to ${user.name} (${user.role})`);
  };

  // Reset all demonstration data
  const handleResetData = () => {
    StorageService.resetToSeed();
    loadData();
    showToast('Demo dataset reset to initial state');
  };

  // Patient CRUD handlers
  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'patientId'>) => {
    if (editingPatient) {
      const updated = StorageService.updatePatient(editingPatient.id, patientData);
      if (updated) {
        setPatients(StorageService.getPatients());
        if (selectedProfilePatient && selectedProfilePatient.id === updated.id) {
          setSelectedProfilePatient(updated);
        }
        showToast(`Patient record updated: ${updated.name}`);
      }
    } else {
      const newPatient = StorageService.addPatient(patientData);
      setPatients(StorageService.getPatients());
      showToast(`Registered new patient: ${newPatient.name} (${newPatient.patientId})`);
    }
    setIsPatientModalOpen(false);
    setEditingPatient(null);
  };

  // Doctor addition handler
  const handleAddDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoc = StorageService.addDoctor(doctorData);
    setDoctors(StorageService.getDoctors());
    showToast(`Added Doctor ${newDoc.name} (${newDoc.department})`);
    return newDoc;
  };

  // Appointment CRUD handlers
  const handleSaveAppointment = (
    appointmentData: Omit<Appointment, 'id' | 'createdAt'>
  ) => {
    const newApt = StorageService.addAppointment(appointmentData);
    setAppointments(StorageService.getAppointments());
    showToast(`Appointment scheduled for ${newApt.patientName} on ${newApt.date}`);
    setIsBookingModalOpen(false);
    setPreselectedPatientForBooking(null);
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    const updated = StorageService.updateAppointmentStatus(id, newStatus);
    if (updated) {
      setAppointments(StorageService.getAppointments());
      showToast(`Appointment status changed to ${newStatus}`);
    }
  };

  // Patient Engagement handlers
  const handleToggleReminder = (id: string) => {
    const updated = StorageService.toggleReminderStatus(id);
    if (updated) {
      setReminders(StorageService.getReminders());
      showToast(`Reminder status updated to ${updated.status}`);
    }
  };

  const handleToggleMedication = (id: string) => {
    const updated = StorageService.toggleMedicationTaken(id);
    if (updated) {
      setMedications(StorageService.getMedications());
      showToast(
        updated.takenToday
          ? `Marked ${updated.medicationName} as taken today`
          : `Marked ${updated.medicationName} as pending`
      );
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(StorageService.getNotifications());
  };

  const handleSubmitFeedback = (feedbackData: Omit<PatientFeedback, 'id' | 'date'>) => {
    StorageService.addFeedback(feedbackData);
    setFeedback(StorageService.getFeedback());
    showToast('Feedback submitted to demonstration database');
  };

  const handleAddReminder = (reminderData: Omit<HealthReminder, 'id'>) => {
    StorageService.addReminder(reminderData);
    setReminders(StorageService.getReminders());
    showToast(`Preventive reminder queued for ${reminderData.patientName}`);
  };

  // Doctor progress note handler
  const handleAddClinicalNote = (noteData: Omit<DoctorClinicalNote, 'id' | 'date'>) => {
    StorageService.addClinicalNote(noteData);
    setClinicalNotes(StorageService.getClinicalNotes());
    showToast(`Clinical progress note recorded for ${noteData.patientName}`);
  };

  // Shortcuts & deep navigation
  const handleSelectPatientById = (patientId: string) => {
    const pat = patients.find((p) => p.id === patientId);
    if (pat) {
      setSelectedProfilePatient(pat);
    }
  };

  const handleOpenBookingForPatient = (patient: Patient) => {
    setPreselectedPatientForBooking(patient);
    setIsBookingModalOpen(true);
  };

  // Active Patient for Patient Portal
  const currentActivePatient: Patient | null =
    (currentUser && patients.find((p) => p.email === currentUser.email || p.id === currentUser.id)) ||
    patients[0] ||
    null;

  // Public Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        departments={departments}
        doctors={doctors}
        onNavigateToLogin={(initialRole) => {
          if (initialRole) setLoginInitialRole(initialRole);
          setCurrentView('login');
        }}
        onNavigateToRegister={() => setCurrentView('register')}
        onNavigateToBook={(dept, docId) => {
          setBookingDept(dept);
          setBookingDoctorId(docId);
          setCurrentView('book-appointment');
        }}
      />
    );
  }

  // Registration Page
  if (currentView === 'register') {
    return (
      <PatientRegistrationPage
        onRegistrationSuccess={(newPat, user) => {
          setPatients(StorageService.getPatients());
          setCurrentUser(user);
          setCurrentView('patient-dashboard');
          showToast(`Welcome, ${newPat.name}! Your patient profile has been created.`);
        }}
        onNavigateToLogin={() => setCurrentView('login')}
        onNavigateToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // Login Page
  if (currentView === 'login' || !currentUser) {
    return (
      <LoginView
        initialRole={loginInitialRole}
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentView('register')}
        onNavigateToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // View routing resolution within MainLayout
  const renderCurrentView = () => {
    if (currentView.startsWith('incomplete-') || currentView.startsWith('mod-')) {
      const actualModuleId = currentView.startsWith('incomplete-')
        ? currentView.replace('incomplete-', 'mod-')
        : currentView;
      return (
        <IncompleteModulePage
          moduleId={actualModuleId}
          onNavigate={(viewId) => {
            const nextView = viewId.startsWith('mod-') ? viewId.replace('mod-', 'incomplete-') : viewId;
            setCurrentView(nextView);
          }}
        />
      );
    }

    switch (currentView) {
      // Patient Views
      case 'patient-dashboard':
        return (
          <PatientDashboardPage
            patient={currentActivePatient}
            appointments={appointments}
            prescriptions={prescriptions}
            reminders={reminders}
            notifications={notifications}
            onNavigate={(view, extra) => {
              if (view === 'book-appointment' && extra) {
                setBookingDept(extra.department);
                setBookingDoctorId(extra.doctorId);
              }
              setCurrentView(view);
            }}
            onCancelAppointment={(aptId) => handleUpdateAppointmentStatus(aptId, 'Cancelled')}
            onRescheduleAppointment={(apt) => {
              setBookingDept(apt.department);
              setBookingDoctorId(apt.doctorId);
              setCurrentView('book-appointment');
            }}
          />
        );

      case 'book-appointment':
        return (
          <BookAppointmentPage
            currentPatient={currentActivePatient}
            departments={departments}
            doctors={doctors}
            initialDepartment={bookingDept}
            initialDoctorId={bookingDoctorId}
            onAddDoctor={handleAddDoctor}
            onAppointmentCreated={(newApt) => {
              setAppointments(StorageService.getAppointments());
              setQueue(StorageService.getQueue());
              showToast(`Appointment booked successfully with ${newApt.doctorName}!`);
            }}
            onNavigateToMyAppointments={() => setCurrentView('my-appointments')}
            onNavigateToDashboard={() => setCurrentView('patient-dashboard')}
          />
        );

      case 'my-appointments':
        return (
          <PatientAppointmentsPage
            patient={currentActivePatient}
            appointments={appointments}
            onAppointmentsChange={(updated) => setAppointments(updated)}
            onNavigateToBook={() => {
              setBookingDept(undefined);
              setBookingDoctorId(undefined);
              setCurrentView('book-appointment');
            }}
          />
        );

      case 'my-prescriptions':
        return (
          <PatientPrescriptionsPage
            patient={currentActivePatient}
            prescriptions={prescriptions}
          />
        );

      case 'my-medical-records':
        return (
          <PatientMedicalRecordsPage
            patient={currentActivePatient}
            appointments={appointments}
            prescriptions={prescriptions}
          />
        );

      // Doctor Views
      case 'doctor':
      case 'doctor-dashboard':
        return (
          <DoctorDashboardPage
            appointments={appointments}
            patients={patients}
            clinicalNotes={clinicalNotes}
            doctors={doctors}
            departments={departments}
            onAddDoctor={handleAddDoctor}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onAddClinicalNote={handleAddClinicalNote}
            onSelectPatient={(p) => setSelectedProfilePatient(p)}
            onConsultationCompleted={() => {
              setAppointments(StorageService.getAppointments());
              setPrescriptions(StorageService.getPrescriptions());
              setQueue(StorageService.getQueue());
              setNotifications(StorageService.getNotifications());
            }}
          />
        );

      // Receptionist Views
      case 'receptionist-dashboard':
        return (
          <ReceptionistDashboardPage
            queue={queue}
            doctors={doctors}
            departments={departments}
            patients={patients}
            onQueueUpdated={(q) => setQueue(q)}
            onPatientRegistered={(newPat) => {
              setPatients(StorageService.getPatients());
              showToast(`Walk-in patient registered: ${newPat.name}`);
            }}
          />
        );

      // Administrator Views
      case 'admin-dashboard':
        return (
          <AdminDashboardPage
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            staff={staff}
            departments={departments}
            onNavigateToModule={(modId) => setCurrentView(`incomplete-${modId}`)}
            onNavigateToTab={(tab) => setCurrentView(tab)}
          />
        );

      // Shared Management & Clinical Views
      case 'dashboard':
        return (
          <DashboardPage
            patients={patients}
            appointments={appointments}
            reminders={reminders}
            onNavigate={(view) => setCurrentView(view)}
            onOpenPatientModal={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onOpenBookingModal={() => {
              setPreselectedPatientForBooking(null);
              setIsBookingModalOpen(true);
            }}
            onSelectPatient={(p) => setSelectedProfilePatient(p)}
          />
        );

      case 'patients':
        return (
          <PatientManagementPage
            patients={patients}
            appointments={appointments}
            onSelectPatient={(p) => setSelectedProfilePatient(p)}
            onOpenAddModal={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onOpenEditModal={(p) => {
              setEditingPatient(p);
              setIsPatientModalOpen(true);
            }}
            onOpenBookingForPatient={handleOpenBookingForPatient}
          />
        );

      case 'appointments':
        return (
          <AppointmentManagementPage
            appointments={appointments}
            patients={patients}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onOpenBookingModal={() => {
              setPreselectedPatientForBooking(null);
              setIsBookingModalOpen(true);
            }}
            onSelectPatientById={handleSelectPatientById}
          />
        );

      case 'engagement':
      case 'health-reminders':
      case 'feedback':
        return (
          <PatientEngagementPage
            reminders={reminders}
            medications={medications}
            notifications={notifications}
            feedback={feedback}
            patients={patients}
            onToggleReminder={handleToggleReminder}
            onToggleMedication={handleToggleMedication}
            onMarkNotificationRead={handleMarkNotificationRead}
            onSubmitFeedback={handleSubmitFeedback}
            onAddReminder={handleAddReminder}
          />
        );

      case 'ai-assistant':
        return <AIAssistantPage />;

      case 'analytics':
        return <AnalyticsPage patients={patients} appointments={appointments} />;

      default:
        return (
          <DashboardPage
            patients={patients}
            appointments={appointments}
            reminders={reminders}
            onNavigate={(view) => setCurrentView(view)}
            onOpenPatientModal={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onOpenBookingModal={() => {
              setPreselectedPatientForBooking(null);
              setIsBookingModalOpen(true);
            }}
            onSelectPatient={(p) => setSelectedProfilePatient(p)}
          />
        );
    }
  };

  return (
    <MainLayout
      currentUser={currentUser}
      onSelectUser={handleSelectUser}
      onLogout={handleLogout}
      notifications={notifications}
      onMarkNotificationRead={handleMarkNotificationRead}
      currentView={currentView}
      onNavigate={(v) => setCurrentView(v)}
      onNavigateToLanding={() => setCurrentView('landing')}
      onResetData={handleResetData}
    >
      {/* Dynamic View Body */}
      {renderCurrentView()}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-alert"
          className="fixed bottom-5 right-5 z-50 p-3.5 rounded-xl bg-slate-900 text-white shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-200 border border-slate-700"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modal: Patient Registration / Demographic Edit */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setEditingPatient(null);
        }}
        onSave={handleSavePatient}
        initialData={editingPatient}
      />

      {/* Modal: Detailed Patient EHR Profile (Vitals, Allergies, Medical History, Appointments) */}
      <PatientProfileModal
        patient={selectedProfilePatient}
        appointments={
          selectedProfilePatient
            ? appointments.filter((a) => a.patientId === selectedProfilePatient.id)
            : []
        }
        isOpen={!!selectedProfilePatient}
        onClose={() => setSelectedProfilePatient(null)}
        onBookAppointment={(patient) => {
          setSelectedProfilePatient(null);
          handleOpenBookingForPatient(patient);
        }}
        onEditPatient={(patient) => {
          setSelectedProfilePatient(null);
          setEditingPatient(patient);
          setIsPatientModalOpen(true);
        }}
      />

      {/* Modal: Schedule & Book Appointment */}
      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setPreselectedPatientForBooking(null);
        }}
        onBook={handleSaveAppointment}
        patients={patients}
        doctors={doctors}
        preselectedPatientId={preselectedPatientForBooking?.id}
      />
    </MainLayout>
  );
}
