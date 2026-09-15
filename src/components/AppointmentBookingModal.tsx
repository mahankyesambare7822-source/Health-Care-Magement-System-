import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Patient, Doctor, Appointment } from '../types';
import { StorageService } from '../services/storageService';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  doctors?: Doctor[];
  onBook?: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onBookAppointment?: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  preselectedPatient?: Patient | null;
  preselectedPatientId?: string;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  patients,
  doctors,
  onBook,
  onBookAppointment,
  preselectedPatient,
  preselectedPatientId,
}) => {
  const activeDoctors = doctors && doctors.length > 0 ? doctors : StorageService.getDoctors();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [customPatientName, setCustomPatientName] = useState<string>('');
  const [isManualPatient, setIsManualPatient] = useState<boolean>(patients.length === 0);
  const [doctorId, setDoctorId] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('09:30 AM');
  const [type, setType] = useState<
    'Routine Checkup' | 'Consultation' | 'Follow-up' | 'Lab Review'
  >('Follow-up');
  const [notes, setNotes] = useState<string>('Standard outpatient follow-up consultation.');
  const [room, setRoom] = useState<string>('Room 304');

  useEffect(() => {
    // Tomorrow's date default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);

    const targetPatientId = preselectedPatientId || preselectedPatient?.id;
    if (targetPatientId) {
      setSelectedPatientId(targetPatientId);
      setIsManualPatient(false);
    } else if (patients.length > 0) {
      if (!selectedPatientId || !patients.some((p) => p.id === selectedPatientId)) {
        setSelectedPatientId(patients[0].id);
      }
      setIsManualPatient(false);
    } else {
      setSelectedPatientId('');
      setIsManualPatient(true);
    }

    if (activeDoctors.length > 0) {
      const currentDoc = activeDoctors.find((d) => d.id === doctorId);
      if (!currentDoc) {
        setDoctorId(activeDoctors[0].id);
        setDepartment(activeDoctors[0].department);
        setRoom(activeDoctors[0].room);
      }
    } else {
      setDoctorId('');
      setDepartment('');
      setRoom('Room 304');
    }
  }, [isOpen, preselectedPatient, preselectedPatientId, patients, activeDoctors]);

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doc = activeDoctors.find((d) => d.id === e.target.value);
    if (doc) {
      setDoctorId(doc.id);
      setDepartment(doc.department);
      setRoom(doc.room);
    } else {
      setDoctorId(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let resolvedPatientId = selectedPatientId;
    let resolvedPatientName = '';

    if (isManualPatient || patients.length === 0) {
      if (!customPatientName.trim()) {
        alert('Please provide a patient name.');
        return;
      }
      resolvedPatientId = `pat-ext-${Date.now()}`;
      resolvedPatientName = customPatientName.trim();
    } else {
      const p = patients.find((pat) => pat.id === selectedPatientId);
      if (!p) {
        alert('Please select a registered patient or switch to custom patient name.');
        return;
      }
      resolvedPatientName = p.name;
    }

    const doc = activeDoctors.find((d) => d.id === doctorId) || activeDoctors[0] || null;

    const payload = {
      patientId: resolvedPatientId,
      patientName: resolvedPatientName,
      doctorId: doc ? doc.id : 'doc-general',
      doctorName: doc ? doc.name : 'Attending Physician',
      department: department || (doc ? doc.department : 'General Medicine'),
      date: date,
      time: time,
      type: type,
      status: 'Scheduled' as const,
      notes: notes.trim(),
      room: room,
    };

    if (onBook) {
      onBook(payload);
    } else if (onBookAppointment) {
      onBookAppointment(payload);
    }

    onClose();
  };

  const TIME_SLOTS = [
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:15 AM',
    '11:00 AM',
    '11:45 AM',
    '01:30 PM',
    '02:15 PM',
    '03:00 PM',
    '03:45 PM',
    '04:30 PM',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Clinical Appointment"
      subtitle="Academic scheduling module with immediate queue synchronization"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-700">
        {/* Patient Selection */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">Select Patient *</label>
            <button
              type="button"
              onClick={() => setIsManualPatient(!isManualPatient)}
              className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              {isManualPatient ? 'Choose from registered roster' : '+ Enter custom patient name'}
            </button>
          </div>

          {!isManualPatient && patients.length > 0 ? (
            <select
              id="appointment-patient-select"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientId} • {p.bloodGroup} • Age {p.age})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              required
              value={customPatientName}
              onChange={(e) => setCustomPatientName(e.target.value)}
              placeholder="Enter patient full name (e.g. Thomas Cole)"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          )}
        </div>

        {/* Doctor and Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attending Physician *
            </label>
            <select
              id="appointment-doctor-select"
              value={doctorId}
              onChange={handleDoctorChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {activeDoctors.length === 0 ? (
                <option value="">No doctors available (Please add a doctor first)</option>
              ) : (
                activeDoctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.department} ({d.room})
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 outline-hidden"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date *</label>
            <input
              id="appointment-date-input"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
            <select
              id="appointment-time-select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Appointment Type & Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Category</label>
            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | 'Routine Checkup'
                    | 'Consultation'
                    | 'Follow-up'
                    | 'Lab Review'
                )
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden bg-white"
            >
              <option value="Follow-up">Follow-up</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Consultation">Specialist Consultation</option>
              <option value="Lab Review">Laboratory Review</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Clinic Suite</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden"
            />
          </div>
        </div>

        {/* Clinical Notes / Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reason for Encounter / Clinical Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for visit, symptoms to review, or lab orders..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="book-appointment-submit-btn"
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Confirm & Schedule Appointment
          </button>
        </div>
      </form>
    </Modal>
  );
};
