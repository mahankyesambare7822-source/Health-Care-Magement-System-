import React from 'react';
import { Modal } from './Modal';
import { Patient, Appointment } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/formatters';
import {
  Calendar,
  Activity,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  PlusCircle,
  Edit2,
} from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  appointments: Appointment[];
  onBookAppointmentForPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  patient,
  appointments,
  onBookAppointmentForPatient,
  onEditPatient,
}) => {
  if (!patient) return null;

  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${patient.name} (${patient.patientId})`}
      subtitle={`Academic EHR Profile • Assigned to ${patient.assignedDoctorName}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-700 text-sm">
        {/* Top Header Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-800 text-base">{patient.name}</h4>
                <StatusBadge status={patient.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {patient.gender}, {patient.age} yrs • DOB: {formatDate(patient.dob)} • Blood Group:{' '}
                <span className="font-semibold text-rose-700">{patient.bloodGroup}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditPatient(patient);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
            <button
              id="profile-book-apt-btn"
              type="button"
              onClick={() => {
                onClose();
                onBookAppointmentForPatient(patient);
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Vitals Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Current Physiological Vitals (Last Recorded: {patient.vitals.lastUpdated})
            </h5>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Blood Pressure</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {patient.vitals.bloodPressure}
              </p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Heart Rate</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {patient.vitals.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
              </p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Oxygen Saturation</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {patient.vitals.spO2}% <span className="text-xs font-normal text-slate-500">SpO2</span>
              </p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <p className="text-[11px] text-slate-400 uppercase font-medium">Body Mass Index</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                {patient.vitals.bmi} <span className="text-xs font-normal text-slate-500">({patient.vitals.weightKg} kg)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Demographics & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 border border-slate-200 rounded-lg space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Contact & Address
            </h5>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{patient.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{patient.address}</span>
            </div>
          </div>

          <div className="p-3.5 border border-slate-200 rounded-lg space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Emergency & Insurance
            </h5>
            <div className="text-xs">
              <span className="text-slate-400">Emergency Contact:</span>{' '}
              <span className="font-semibold text-slate-800">
                {patient.emergencyContact.name} ({patient.emergencyContact.relation})
              </span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Emergency Phone:</span>{' '}
              <span>{patient.emergencyContact.phone}</span>
            </div>
            <div className="text-xs flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>
                {patient.insuranceProvider} • ID:{' '}
                <span className="font-mono font-medium">{patient.insuranceId}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Allergies & Conditions */}
        <div className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-lg space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Clinical Alerts, Allergies & Diagnoses
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {patient.allergies.map((allergy) => (
              <span
                key={allergy}
                className="px-2 py-0.5 rounded text-xs bg-rose-100 text-rose-800 border border-rose-200 font-medium"
              >
                Allergy: {allergy}
              </span>
            ))}
            {patient.chronicConditions.map((cond) => (
              <span
                key={cond}
                className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 border border-blue-200 font-medium"
              >
                Condition: {cond}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Medical Notes Placeholder */}
        <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/30">
          <div className="flex items-center justify-between mb-1.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              Basic Medical Record Placeholder
            </h5>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
              EHR Sync: Planned Phase 2
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-2.5 rounded border border-slate-200">
            &quot;{patient.recentNotes}&quot;
          </p>
        </div>

        {/* Patient Appointment History */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            Encounter & Appointment History ({patientAppointments.length})
          </h5>

          {patientAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded border border-slate-100">
              No previous appointments found for this patient record.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {patientAppointments.map((apt) => (
                <div key={apt.id} className="p-3 bg-white flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 text-xs">
                        {apt.doctorName}
                      </span>
                      <span className="text-[11px] text-slate-400">• {apt.department}</span>
                      <StatusBadge status={apt.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{apt.notes || apt.type}</p>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <div className="font-medium text-slate-700">{formatDate(apt.date)}</div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
