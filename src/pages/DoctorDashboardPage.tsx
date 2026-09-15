import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Calendar,
  Users,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Mail,
  Phone,
  Building,
  GraduationCap,
  AlertCircle,
  Activity,
  HeartPulse,
  Pill,
  Send,
  Eye,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Doctor, Appointment, Patient, DoctorClinicalNote, AppointmentStatus, Prescription, Department } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/formatters';
import { StorageService } from '../services/storageService';
import { AddDoctorModal } from '../components/AddDoctorModal';

interface DoctorDashboardPageProps {
  appointments: Appointment[];
  patients: Patient[];
  clinicalNotes: DoctorClinicalNote[];
  doctors?: Doctor[];
  departments?: Department[];
  currentDoctorUser?: Doctor;
  onUpdateAppointmentStatus: (id: string, newStatus: AppointmentStatus) => void;
  onAddClinicalNote: (note: Omit<DoctorClinicalNote, 'id' | 'date'>) => void;
  onSelectPatient: (patient: Patient) => void;
  onConsultationCompleted?: () => void;
  onAddDoctor?: (doctorData: Omit<Doctor, 'id'>) => Doctor;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({
  appointments,
  patients,
  clinicalNotes,
  doctors = [],
  departments = [],
  currentDoctorUser,
  onUpdateAppointmentStatus,
  onAddClinicalNote,
  onSelectPatient,
  onConsultationCompleted,
  onAddDoctor,
}) => {
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  // Allow toggling between doctors if needed
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    currentDoctorUser?.id || doctors[0]?.id || ''
  );

  const currentDoctor = useMemo(() => {
    return doctors.find((d) => d.id === selectedDoctorId) || doctors[0] || null;
  }, [selectedDoctorId, doctors]);

  const [patientSearch, setPatientSearch] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [notePatientId, setNotePatientId] = useState(patients[0]?.id || '');
  const [noteSubject, setNoteSubject] = useState('Outpatient Follow-up');
  const [noteAssessment, setNoteAssessment] = useState('');
  const [notePlan, setNotePlan] = useState('');

  // Consultation Modal State
  const [consultingAppointment, setConsultingAppointment] = useState<Appointment | null>(null);
  const [consultPatient, setConsultPatient] = useState<Patient | null>(null);
  const [observations, setObservations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [rxItems, setRxItems] = useState<
    Array<{ medicineName: string; dosage: string; duration: string; instructions: string }>
  >([
    {
      medicineName: '',
      dosage: '1 tablet twice daily',
      duration: '5 days',
      instructions: 'Take after meals',
    },
  ]);
  const [consultationSuccessMsg, setConsultationSuccessMsg] = useState('');

  // Medical History Modal State
  const [historyPatient, setHistoryPatient] = useState<Patient | null>(null);

  // Doctor's appointments
  const doctorAppointments = useMemo(() => {
    if (!currentDoctor) return [];
    return appointments.filter(
      (a) => a.doctorId === currentDoctor.id || a.doctorName.toLowerCase().includes(currentDoctor.name.toLowerCase())
    );
  }, [appointments, currentDoctor]);

  // Doctor's patients
  const doctorPatients = useMemo(() => {
    if (!currentDoctor) return [];
    return patients.filter((p) => {
      const isAssigned =
        p.assignedDoctorId === currentDoctor.id ||
        (p.assignedDoctorName && p.assignedDoctorName.toLowerCase().includes(currentDoctor.name.toLowerCase()));
      const matchesSearch =
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.chronicConditions.some((c) => c.toLowerCase().includes(patientSearch.toLowerCase()));
      return isAssigned && matchesSearch;
    });
  }, [patients, currentDoctor, patientSearch]);

  const handleOpenConsultation = (apt: Appointment) => {
    setConsultingAppointment(apt);
    const pat =
      patients.find((p) => p.id === apt.patientId || p.name.toLowerCase() === apt.patientName.toLowerCase()) ||
      patients[0] || {
        id: apt.patientId,
        patientId: apt.patientId,
        name: apt.patientName,
        age: 35,
        gender: 'Other' as const,
        dob: '1990-01-01',
        bloodGroup: 'O+',
        phone: 'N/A',
        email: '',
        address: 'Outpatient Clinic',
        emergencyContact: { name: 'Emergency Contact', relation: 'Family', phone: 'N/A' },
        insuranceProvider: 'Standard Clinic',
        status: 'Active' as const,
        admissionDate: new Date().toISOString().split('T')[0],
        vitals: {
          bloodPressure: '120/80 mmHg',
          heartRate: 72,
          temperature: '98.6 °F',
          spO2: 98,
          weightKg: 70,
          bmi: 23,
          lastUpdated: 'Intake',
        },
        allergies: [],
        chronicConditions: [],
        recentNotes: 'Outpatient consultation',
      };
    setConsultPatient(pat);
    setObservations(`Patient presented for scheduled ${apt.type}. Vitals evaluated: BP ${pat?.vitals?.bloodPressure || '120/80 mmHg'}, HR ${pat?.vitals?.heartRate || 72} bpm.`);
    setDiagnosis(apt.notes || 'Routine Clinical Evaluation');
    setAdvice('Maintain hydration, continue balanced diet, and monitor vital parameters.');
    // 2 weeks from now
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setFollowUpDate(d.toISOString().split('T')[0]);
  };

  const handleAddRxItem = () => {
    setRxItems([
      ...rxItems,
      { medicineName: '', dosage: '1 tablet twice daily', duration: '5 days', instructions: 'After meals' },
    ]);
  };

  const handleRemoveRxItem = (index: number) => {
    setRxItems(rxItems.filter((_, i) => i !== index));
  };

  const handleCompleteConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultingAppointment || !consultPatient) return;

    const docId = currentDoctor?.id || consultingAppointment.doctorId || 'doc-general';
    const docName = currentDoctor?.name || consultingAppointment.doctorName || 'Attending Physician';
    const docDept = currentDoctor?.department || consultingAppointment.department || 'General Medicine';

    // 1. Update appointment status to Completed with consultation data
    const updatedApts = appointments.map((a) => {
      if (a.id === consultingAppointment.id) {
        return {
          ...a,
          status: 'Completed' as AppointmentStatus,
          consultationData: {
            symptoms: consultingAppointment.notes || 'General follow-up',
            observations,
            assessment: diagnosis,
            plan: advice,
            followUpDate,
            completedAt: new Date().toISOString(),
          },
        };
      }
      return a;
    });
    StorageService.saveAppointments(updatedApts);

    // 2. Generate digital prescription if any medicines added
    const validRxItems = rxItems.filter((i) => i.medicineName.trim());
    if (validRxItems.length > 0) {
      StorageService.addPrescription({
        patientId: consultPatient.id,
        patientName: consultPatient.name,
        doctorId: docId,
        doctorName: docName,
        department: docDept,
        appointmentId: consultingAppointment.id,
        diagnosis,
        date: new Date().toISOString().split('T')[0],
        items: validRxItems,
        instructions: advice,
        followUpDate,
      });
    }

    // 3. Generate Follow-up reminder for patient
    if (followUpDate) {
      StorageService.addReminder({
        patientId: consultPatient.id,
        patientName: consultPatient.name,
        category: 'Lifestyle',
        title: `Clinical Follow-up with ${docName}`,
        dueDate: followUpDate,
        status: 'Pending',
        notes: `Follow-up appointment advised: ${advice}`,
      });
    }

    // 4. Notify patient
    StorageService.addNotification({
      patientId: consultPatient.id,
      patientName: consultPatient.name,
      title: `Consultation Completed (${consultingAppointment.id})`,
      message: `${docName} has completed your consultation and updated your digital prescription & medical record.`,
      channel: 'In-App',
      priority: 'High',
      read: false,
    });

    setConsultationSuccessMsg('Consultation completed successfully! Digital Rx and follow-up saved to patient record.');
    if (onConsultationCompleted) {
      onConsultationCompleted();
    }

    setTimeout(() => {
      setConsultationSuccessMsg('');
      setConsultingAppointment(null);
    }, 1800);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteAssessment.trim() || !notePlan.trim()) {
      alert('Please provide both an assessment and clinical plan.');
      return;
    }
    const p = patients.find((pat) => pat.id === notePatientId);
    onAddClinicalNote({
      patientId: notePatientId,
      patientName: p ? p.name : 'Outpatient Patient',
      doctorId: currentDoctor ? currentDoctor.id : 'doc-general',
      subject: noteSubject.trim(),
      assessment: noteAssessment.trim(),
      plan: notePlan.trim(),
    });
    setShowAddNoteModal(false);
    setNoteAssessment('');
    setNotePlan('');
  };

  if (!currentDoctor || doctors.length === 0) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            No Doctors in Clinical Roster
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            The hospital roster is currently empty. Add a doctor to begin consultations, review appointment requests, and issue prescriptions.
          </p>
          <button
            id="doc-dash-add-first-doctor-btn"
            type="button"
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor to Roster</span>
          </button>
        </div>

        {showAddDoctorModal && onAddDoctor && (
          <AddDoctorModal
            isOpen={showAddDoctorModal}
            onClose={() => setShowAddDoctorModal(false)}
            departments={departments}
            onSaveDoctor={(docData) => {
              const saved = onAddDoctor(docData);
              setSelectedDoctorId(saved.id);
              setShowAddDoctorModal(false);
              return saved;
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Doctor Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Doctor Outpatient Clinic &amp; Consultation Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active Clinician: <strong>{currentDoctor.name}</strong> • {currentDoctor.department} ({currentDoctor.room})
          </p>
        </div>

        {/* Doctor Demo Selector & Add Doctor Button */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Switch Clinician:</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.department})
              </option>
            ))}
          </select>
          {onAddDoctor && (
            <button
              type="button"
              onClick={() => setShowAddDoctorModal(true)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor</span>
            </button>
          )}
        </div>
      </div>

      {/* Doctor Profile Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentDoctor.name}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Clinic Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentDoctor.qualification} • {currentDoctor.department} ({currentDoctor.specialization})
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {currentDoctor.room}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentDoctor.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {currentDoctor.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70 w-full md:w-auto">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Scheduled Clinic Hours</span>
          <span className="font-semibold text-slate-700">{currentDoctor.availability}</span>
          <span className="text-[11px] text-blue-600 font-medium">
            Available: {currentDoctor.availableDays.join(', ')}
          </span>
        </div>
      </div>

      {/* Grid: Doctor Appointments & Patient Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Appointments with Start Consultation */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Doctor Appointments Queue ({doctorAppointments.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Patients scheduled with {currentDoctor.name}
              </p>
            </div>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {doctorAppointments.filter((a) => a.status === 'Scheduled').length} Pending Consultations
            </span>
          </div>

          <div className="space-y-3">
            {doctorAppointments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No appointments currently assigned to {currentDoctor.name}.
              </div>
            ) : (
              doctorAppointments.map((apt) => {
                const patientObj = patients.find(
                  (p) => p.id === apt.patientId || p.name.toLowerCase() === apt.patientName.toLowerCase()
                );

                return (
                  <div
                    key={apt.id}
                    id={`doc-apt-${apt.id}`}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
                          <span className="text-xs text-slate-500 font-mono">
                            {patientObj ? `(${patientObj.patientId})` : ''}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-2">
                          <span>Age: <strong>{patientObj?.age || 38}</strong></span>
                          <span>•</span>
                          <span>Gender: <strong>{patientObj?.gender || 'Female'}</strong></span>
                          <span>•</span>
                          <span>Blood: <strong className="text-rose-600">{patientObj?.bloodGroup || 'O+'}</strong></span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          <strong className="text-slate-600">Symptoms / Reason:</strong> {apt.notes || 'Routine checkup'}
                        </p>
                      </div>

                      <div className="text-right">
                        <StatusBadge status={apt.status} size="sm" />
                        <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>{apt.time}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{apt.date}</div>
                      </div>
                    </div>

                    {/* Action Buttons: View Medical History & Start Consultation */}
                    <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          const targetPat =
                            patientObj ||
                            patients.find(
                              (p) =>
                                p.id === apt.patientId ||
                                p.name.toLowerCase() === apt.patientName.toLowerCase()
                            ) ||
                            patients[0] || {
                              id: apt.patientId,
                              patientId: apt.patientId,
                              name: apt.patientName,
                              age: 35,
                              gender: 'Other' as const,
                              dob: '1990-01-01',
                              bloodGroup: 'O+',
                              phone: 'N/A',
                              email: '',
                              address: 'Outpatient Clinic',
                              emergencyContact: {
                                name: 'Emergency Contact',
                                relation: 'Family',
                                phone: 'N/A',
                              },
                              insuranceProvider: 'Standard Clinic',
                              status: 'Active' as const,
                              admissionDate: new Date().toISOString().split('T')[0],
                              vitals: {
                                bloodPressure: '120/80 mmHg',
                                heartRate: 72,
                                temperature: '98.6 °F',
                                spO2: 98,
                                weightKg: 70,
                                bmi: 23,
                                lastUpdated: 'Intake',
                              },
                              allergies: [],
                              chronicConditions: [],
                              recentNotes: 'Outpatient record',
                            };
                          setHistoryPatient(targetPat);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Medical History</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {apt.status === 'Scheduled' ? (
                          <button
                            type="button"
                            id={`start-consult-${apt.id}`}
                            onClick={() => handleOpenConsultation(apt)}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Start Consultation</span>
                          </button>
                        ) : apt.status === 'Completed' ? (
                          <span className="px-3 py-1 rounded-lg text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Consultation Done</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold text-[11px]">Cancelled</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Assigned Patients Panel & Search */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Assigned Panel ({doctorPatients.length})</span>
              </h3>
              <span className="text-xs text-slate-400">{currentDoctor.department} Cohort</span>
            </div>

            {/* Search Input */}
            <div className="relative my-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search patient name, ID, or condition..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {doctorPatients.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No patients match the search query.
                </div>
              ) : (
                doctorPatients.map((pat) => (
                  <div
                    key={pat.id}
                    onClick={() => onSelectPatient(pat)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                        <span>{pat.name}</span>
                        <span className="font-mono text-slate-400 text-[10px]">
                          ({pat.patientId})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        BP: <strong className="text-slate-700">{pat.vitals?.bloodPressure || '120/80'}</strong> • HR: {pat.vitals?.heartRate || 72} bpm
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {pat.chronicConditions.join(', ') || 'No chronic conditions'}
                      </p>
                    </div>

                    <div className="text-right">
                      <StatusBadge status={pat.status} size="sm" />
                      <span className="text-[10px] text-blue-600 font-semibold block mt-1">Open EHR →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Clinical Department: {currentDoctor.department}</span>
            <span className="font-mono text-slate-400">Total: {doctorPatients.length} Patients</span>
          </div>
        </div>
      </div>

      {/* Clinical Progress Notes (SOAP) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Doctor Clinical Progress Notes (SOAP Format)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Physician clinical assessments, diagnoses considerations, and management plans
            </p>
          </div>

          <button
            id="add-clinical-note-btn"
            type="button"
            onClick={() => setShowAddNoteModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Document New Note</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinicalNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{note.subject}</span>
                  <p className="text-[11px] text-slate-500">Patient: {note.patientName}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDate(note.date)}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase text-[10px]">Assessment:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{note.assessment}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase text-[10px]">Plan:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{note.plan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* START CONSULTATION SCREEN / MODAL */}
      {consultingAppointment && consultPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-5 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Active Consultation
                  </span>
                  <span className="font-mono text-xs text-slate-400">{consultingAppointment.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Doctor Consultation &amp; Prescription Slip
                </h2>
                <p className="text-xs text-slate-500">
                  Attending: <strong>{currentDoctor.name}</strong> • Patient: <strong>{consultPatient.name}</strong> ({consultPatient.patientId})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setConsultingAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {consultationSuccessMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Consultation Completed!</h3>
                <p className="text-xs text-emerald-700">{consultationSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCompleteConsultation} className="space-y-4 text-xs">
                {/* Patient Summary Card */}
                <div className="grid sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Patient Name</span>
                    <span className="font-bold text-slate-900">{consultPatient.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Age / Gender</span>
                    <span className="font-medium text-slate-800">{consultPatient.age} yrs • {consultPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Blood Group</span>
                    <span className="font-bold text-rose-600">{consultPatient.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recorded BP / SpO2</span>
                    <span className="font-semibold text-slate-800">{consultPatient.vitals?.bloodPressure || '120/80'} • {consultPatient.vitals?.spO2 || 98}%</span>
                  </div>
                </div>

                {/* Symptoms / Chief Complaint */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Symptoms / Reason for Visit
                  </label>
                  <input
                    type="text"
                    required
                    value={consultingAppointment.notes || 'Routine consultation'}
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-700"
                  />
                </div>

                {/* Doctor's Notes (Observations, Diagnosis, Advice) */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Objective Clinical Observations *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Enter physical exam findings, vital observations..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Diagnosis / Clinical Assessment *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Essential Hypertension, Seasonal Allergic Rhinitis..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Physician Advice &amp; Lifestyle Recommendations
                  </label>
                  <input
                    type="text"
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    placeholder="e.g. Reduce sodium intake, 30-min walking daily, monitor BP..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Add Prescription Section */}
                <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-indigo-600" />
                      <span>Prescribe Medications (Digital Rx)</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddRxItem}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                    >
                      + Add Medicine
                    </button>
                  </div>

                  <div className="space-y-2">
                    {rxItems.map((item, idx) => (
                      <div key={idx} className="grid sm:grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-indigo-100">
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            placeholder="Medicine Name (e.g. Paracetamol)"
                            value={item.medicineName}
                            onChange={(e) => {
                              const updated = [...rxItems];
                              updated[idx].medicineName = e.target.value;
                              setRxItems(updated);
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Dosage (e.g. 500 mg twice daily)"
                            value={item.dosage}
                            onChange={(e) => {
                              const updated = [...rxItems];
                              updated[idx].dosage = e.target.value;
                              setRxItems(updated);
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Duration (5 days)"
                            value={item.duration}
                            onChange={(e) => {
                              const updated = [...rxItems];
                              updated[idx].duration = e.target.value;
                              setRxItems(updated);
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Instructions (After meals)"
                            value={item.instructions}
                            onChange={(e) => {
                              const updated = [...rxItems];
                              updated[idx].instructions = e.target.value;
                              setRxItems(updated);
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div className="sm:col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveRxItem(idx)}
                            className="text-rose-500 hover:text-rose-700 font-bold px-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Set Follow-up Date */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Set Follow-up Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center text-slate-500 text-[11px] pt-4">
                    <span>A reminder notification will be scheduled in the patient portal for this date.</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultingAppointment(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="complete-consultation-btn"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Consultation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* VIEW MEDICAL HISTORY MODAL */}
      {historyPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setHistoryPatient(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{historyPatient.patientId}</span>
                <h3 className="text-base font-bold text-slate-900">
                  Medical Summary: {historyPatient.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoryPatient(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Group</span>
                  <span className="font-bold text-rose-600">{historyPatient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Latest Vitals</span>
                  <span className="font-semibold text-slate-800">
                    BP {historyPatient.vitals?.bloodPressure} • HR {historyPatient.vitals?.heartRate}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Diagnosed Chronic Conditions:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {historyPatient.chronicConditions.join(', ') || 'None recorded'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Documented Allergies:</span>
                <p className="text-rose-700 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                  {historyPatient.allergies?.join(', ') || 'No known allergies'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Recent Clinical Notes:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  {historyPatient.recentNotes}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryPatient(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Clinical Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Clinical Progress Note</h3>
              <p className="text-xs text-slate-400">{currentDoctor.name} • Outpatient Clinical Record</p>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={notePatientId}
                  onChange={(e) => setNotePatientId(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Subject</label>
                <input
                  type="text"
                  required
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Assessment</label>
                <textarea
                  rows={2}
                  required
                  value={noteAssessment}
                  onChange={(e) => setNoteAssessment(e.target.value)}
                  placeholder="Clinical observations, diagnostic impression, vitals summary..."
                  className="w-full p-2 border rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Treatment Plan</label>
                <textarea
                  rows={2}
                  required
                  value={notePlan}
                  onChange={(e) => setNotePlan(e.target.value)}
                  placeholder="Medication adjustments, diagnostic test orders, lifestyle advice, follow-up..."
                  className="w-full p-2 border rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-clinical-note-btn"
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-semibold"
                >
                  Save Progress Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Doctor Modal */}
      {showAddDoctorModal && onAddDoctor && (
        <AddDoctorModal
          isOpen={showAddDoctorModal}
          onClose={() => setShowAddDoctorModal(false)}
          departments={departments}
          onSaveDoctor={(docData) => {
            const saved = onAddDoctor(docData);
            setSelectedDoctorId(saved.id);
            setShowAddDoctorModal(false);
            return saved;
          }}
        />
      )}
    </div>
  );
};
