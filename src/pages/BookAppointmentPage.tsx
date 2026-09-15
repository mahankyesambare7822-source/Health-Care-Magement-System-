import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Star,
  Info,
  ShieldAlert,
  Heart,
  Brain,
  Activity,
  Baby,
  ShieldPlus,
  Users,
  Ear,
  MapPin,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Department, Doctor, Patient, Appointment, AppointmentMode } from '../types';
import { AddDoctorModal } from '../components/AddDoctorModal';

interface BookAppointmentPageProps {
  currentPatient?: Patient | null;
  departments: Department[];
  doctors: Doctor[];
  initialDepartment?: string;
  initialDoctorId?: string;
  onAppointmentCreated: (appointment: Appointment) => void;
  onNavigateToMyAppointments: () => void;
  onNavigateToDashboard: () => void;
  onAddDoctor?: (doctorData: Omit<Doctor, 'id'>) => Doctor;
}

const DEFAULT_TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
];

export const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({
  currentPatient,
  departments,
  doctors,
  initialDepartment,
  initialDoctorId,
  onAppointmentCreated,
  onNavigateToMyAppointments,
  onNavigateToDashboard,
  onAddDoctor,
}) => {
  // Step 1 to 7
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  // Form selections
  const [selectedDept, setSelectedDept] = useState<string>(
    initialDepartment || (departments[0]?.name || 'Cardiology')
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || doctors[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Tomorrow by default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');
  const [appointmentType, setAppointmentType] = useState<string>('Consultation');
  const [appointmentMode, setAppointmentMode] = useState<AppointmentMode>('In-person');
  const [symptoms, setSymptoms] = useState<string>('Routine evaluation and general checkup.');

  // Guest booking info when no active patient is logged in
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0] || null;

  const getDeptIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cardiology':
        return Heart;
      case 'neurology':
        return Brain;
      case 'orthopedics':
        return Activity;
      case 'pediatrics':
        return Baby;
      case 'dermatology':
        return ShieldPlus;
      case 'gynecology':
        return Users;
      case 'ent':
        return Ear;
      default:
        return Stethoscope;
    }
  };

  const handleDeptSelect = (deptName: string) => {
    setSelectedDept(deptName);
    // pick first doctor in that dept if available
    const docInDept = doctors.find((d) => d.department.toLowerCase() === deptName.toLowerCase());
    if (docInDept) {
      setSelectedDoctorId(docInDept.id);
    }
    setCurrentStep(2);
  };

  const handleDoctorSelect = (docId: string) => {
    setSelectedDoctorId(docId);
    setCurrentStep(3); // View Doctor details step
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor) {
      alert('Please select an attending doctor.');
      return;
    }

    const patName = currentPatient?.name || guestName.trim() || 'Outpatient';
    const patId = currentPatient?.id || ('pat-' + Date.now().toString(36));

    // Create new appointment in StorageService
    const newApt = StorageService.addAppointment({
      patientId: patId,
      patientName: patName,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date: selectedDate,
      time: selectedTimeSlot,
      type: appointmentType as any,
      appointmentMode: appointmentMode,
      status: 'Scheduled',
      notes: symptoms,
      room: selectedDoctor.room,
    });

    setConfirmedAppointment(newApt);
    onAppointmentCreated(newApt);
    setCurrentStep(7); // Final confirmation screen
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Book an Outpatient Appointment
          </h1>
          <p className="text-xs text-slate-500">
            Select department, choose physician, review available slots, and confirm your visit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Booking for: <strong>{currentPatient.name}</strong> ({currentPatient.patientId})
          </span>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      {currentStep < 7 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between overflow-x-auto text-xs font-medium text-slate-500 gap-2 pb-1">
            {[
              { num: 1, label: 'Department' },
              { num: 2, label: 'Doctor' },
              { num: 3, label: 'Profile' },
              { num: 4, label: 'Date' },
              { num: 5, label: 'Slot' },
              { num: 6, label: 'Review' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => isDone && setCurrentStep(step.num)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : isDone
                      ? 'text-blue-700 hover:bg-blue-50 cursor-pointer'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isActive
                        ? 'bg-white text-blue-600 font-bold'
                        : isDone
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </span>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: Select Department */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Step 1: Select Hospital Department
            </h2>
            <span className="text-xs text-slate-500">8 Specialties Available</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => {
              const IconComp = getDeptIcon(dept.name);
              const isSelected = selectedDept.toLowerCase() === dept.name.toLowerCase();
              return (
                <div
                  key={dept.id}
                  id={`dept-card-${dept.name.toLowerCase()}`}
                  onClick={() => handleDeptSelect(dept.name)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{dept.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                    <span>{dept.doctorCount} Doctors</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Select Doctor */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step 2: Select Doctor in {selectedDept}
              </h2>
              <p className="text-xs text-slate-500">
                Choose from attending physicians in this department
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Change Department
            </button>
          </div>

          {doctors.filter((d) => d.department.toLowerCase() === selectedDept.toLowerCase()).length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 space-y-3">
              <Stethoscope className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Doctors in {selectedDept} Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                There are currently no doctors listed under {selectedDept}. You can add a doctor to this department now, or select a different department.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {onAddDoctor && (
                  <button
                    type="button"
                    onClick={() => setShowAddDoctorModal(true)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Doctor to {selectedDept}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Choose Different Department
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors
                .filter((d) => d.department.toLowerCase() === selectedDept.toLowerCase())
                .map((doc) => {
                  const isSelected = selectedDoctorId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      id={`select-doc-${doc.id}`}
                      className={`bg-white rounded-xl p-4 border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                            {doc.name.split(' ').filter((_, i) => i > 0)[0]?.[0] || 'D'}
                            {doc.name.split(' ').filter((_, i) => i > 0)[1]?.[0] || 'R'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                            <div className="text-[11px] text-slate-500">{doc.qualification}</div>
                            <div className="text-[11px] text-blue-600 font-semibold">{doc.specialization}</div>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600 py-2 border-y border-slate-100 mb-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Experience:</span>
                            <span className="font-semibold">{doc.experienceYears} Years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Room:</span>
                            <span>{doc.room}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rating:</span>
                            <span className="text-amber-600 font-semibold">★ {doc.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDoctorSelect(doc.id)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer transition-colors"
                        >
                          Select &amp; View Profile
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Doctor Details & Profile */}
      {currentStep === 3 && !selectedDoctor && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">No Doctor Selected</h3>
          <p className="text-xs text-slate-500">Please choose an attending doctor to inspect credentials and continue booking.</p>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Back to Select Doctor
          </button>
        </div>
      )}

      {currentStep === 3 && selectedDoctor && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-md">
                {selectedDoctor.name.split(' ').filter((_, i) => i > 0)[0]?.[0] || 'D'}
                {selectedDoctor.name.split(' ').filter((_, i) => i > 0)[1]?.[0] || 'R'}
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedDoctor.department} Specialist
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedDoctor.name}</h2>
                <p className="text-xs text-slate-500">{selectedDoctor.title}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500 text-sm font-bold justify-end">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedDoctor.rating}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {selectedDoctor.reviewCount} verified patient reviews
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">Qualification</span>
              <span className="font-semibold text-slate-800 text-sm">{selectedDoctor.qualification}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">Experience</span>
              <span className="font-semibold text-slate-800 text-sm">{selectedDoctor.experienceYears} Years</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">Clinic Room</span>
              <span className="font-semibold text-slate-800 text-sm">{selectedDoctor.room}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Clinical Specialization</h4>
              <p className="leading-relaxed">{selectedDoctor.specialization}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Scheduled Clinic Availability</h4>
              <p>{selectedDoctor.availability}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedDoctor.availableDays.map((day) => (
                  <span
                    key={day}
                    className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Back to Doctors
            </button>
            <button
              type="button"
              id="proceed-to-date-btn"
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Date Selection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Select Date */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 4: Select Appointment Date</h2>
              <p className="text-xs text-slate-500">
                Doctor {selectedDoctor.name} is available on {selectedDoctor.availableDays.join(', ')}
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600">{selectedDoctor.department}</span>
          </div>

          <div className="max-w-md space-y-3 text-xs">
            <label className="block font-semibold text-slate-700">
              Pick Consultation Date
            </label>
            <input
              id="appointment-date-input"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Selected: <strong>{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              id="proceed-to-slot-btn"
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Check Time Slots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Select Time Slot with Collision Check */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 5: Select Available Time Slot</h2>
              <p className="text-xs text-slate-500">
                Showing consultation slots for {selectedDate} with {selectedDoctor.name}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Available
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Booked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DEFAULT_TIME_SLOTS.map((slot) => {
              const isBooked = StorageService.isSlotBooked(selectedDoctor.id, selectedDate, slot);
              const isSelected = selectedTimeSlot === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  id={`slot-${slot.replace(/[: ]/g, '-')}`}
                  disabled={isBooked}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isBooked
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">{slot}</span>
                  <span className="text-[10px]">
                    {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              id="proceed-to-review-btn"
              onClick={() => setCurrentStep(6)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Review Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Appointment Details & Review */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Step 6: Review &amp; Provide Appointment Details
            </h2>
            <p className="text-xs text-slate-500">
              Please verify the patient and physician booking summary before final confirmation.
            </p>
          </div>

          {/* Guest Patient Input if not registered */}
          {!currentPatient && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-blue-900">
                <User className="w-4 h-4 text-blue-600" />
                <span>Patient Registration / Contact Details</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Booking Summary Box */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Patient</span>
              <div className="font-bold text-slate-800 text-sm">
                {currentPatient?.name || guestName || 'Outpatient (Enter Name Above)'}
              </div>
              <div className="text-slate-500">
                {currentPatient
                  ? `ID: ${currentPatient.patientId} • Phone: ${currentPatient.phone}`
                  : guestPhone
                  ? `Phone: ${guestPhone}`
                  : 'New Patient Registration'}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Attending Doctor</span>
              <div className="font-bold text-slate-800 text-sm">
                {selectedDoctor?.name || 'No Doctor Selected'}
              </div>
              <div className="text-slate-500">
                {selectedDoctor
                  ? `${selectedDoctor.department} • ${selectedDoctor.room}`
                  : 'Please pick a doctor from Step 2'}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Date</span>
              <div className="font-semibold text-slate-800">{selectedDate}</div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Time Slot</span>
              <div className="font-semibold text-blue-600">{selectedTimeSlot}</div>
            </div>
          </div>

          {/* Appointment Type & Symptoms Form */}
          <div className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Consultation Mode
                </label>
                <select
                  value={appointmentMode}
                  onChange={(e) => setAppointmentMode(e.target.value as AppointmentMode)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="In-person">In-person (Clinic Visit)</option>
                  <option value="Online Consultation">Online Consultation (Tele-Demo)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Visit Category
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Consultation">General Consultation</option>
                  <option value="Follow-up">Follow-up Visit</option>
                  <option value="Routine Checkup">Routine Preventive Checkup</option>
                  <option value="Lab Review">Lab &amp; Diagnostic Review</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reason for Visit / Primary Symptoms
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Briefly describe what you would like to discuss with the doctor..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              id="confirm-booking-btn"
              onClick={handleConfirmBooking}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Appointment</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Appointment Successfully Booked */}
      {currentStep === 7 && confirmedAppointment && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Appointment Successfully Booked!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your appointment has been registered in the hospital management system.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Appointment ID:</span>
              <span className="font-mono font-bold text-blue-700 text-sm">
                {confirmedAppointment.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-800">{confirmedAppointment.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-medium text-slate-700">{confirmedAppointment.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date &amp; Time:</span>
              <span className="font-semibold text-slate-900">
                {confirmedAppointment.date} at {confirmedAppointment.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Clinic Room:</span>
              <span className="font-medium text-slate-700">{confirmedAppointment.room}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Confirmed (Scheduled)
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 text-left">
            <strong>System Synchronization Note:</strong> This appointment is immediately reflected in:
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-700">
              <li>Patient Portal → My Appointments &amp; Dashboard</li>
              <li>Doctor Portal ({confirmedAppointment.doctorName}) → Today's Schedule</li>
              <li>Receptionist Dashboard → Queue Token #{confirmedAppointment.id.slice(-3)}</li>
              <li>Hospital Analytics → Total Appointments count</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              id="booking-go-my-appointments-btn"
              onClick={onNavigateToMyAppointments}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              Go to My Appointments
            </button>
            <button
              type="button"
              id="booking-go-dashboard-btn"
              onClick={onNavigateToDashboard}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDoctorModal && onAddDoctor && (
        <AddDoctorModal
          isOpen={showAddDoctorModal}
          onClose={() => setShowAddDoctorModal(false)}
          departments={departments}
          defaultDepartment={selectedDept}
          onSaveDoctor={(docData) => {
            const saved = onAddDoctor(docData);
            setSelectedDoctorId(saved.id);
            setShowAddDoctorModal(false);
            setCurrentStep(3); // View Doctor details step immediately
            return saved;
          }}
        />
      )}
    </div>
  );
};
