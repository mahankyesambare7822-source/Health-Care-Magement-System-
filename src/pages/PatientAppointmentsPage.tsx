import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarCheck,
  PlusCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Appointment, Patient, AppointmentStatus } from '../types';
import { StorageService } from '../services/storageService';

interface PatientAppointmentsPageProps {
  patient?: Patient | null;
  appointments: Appointment[];
  onAppointmentsChange: (appointments: Appointment[]) => void;
  onNavigateToBook: () => void;
}

export const PatientAppointmentsPage: React.FC<PatientAppointmentsPageProps> = ({
  patient,
  appointments,
  onAppointmentsChange,
  onNavigateToBook,
}) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Reschedule Modal State
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('11:00 AM');
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string>('');

  // Cancel Confirmation State
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null);

  // Filter patient's appointments
  const patientAppointments = patient
    ? appointments.filter(
        (a) => a.patientId === patient.id || a.patientName.toLowerCase() === patient.name.toLowerCase()
      )
    : appointments;

  const filteredAppointments = patientAppointments.filter((a) => {
    if (activeTab === 'Upcoming') return a.status === 'Scheduled';
    if (activeTab === 'Completed') return a.status === 'Completed';
    if (activeTab === 'Cancelled') return a.status === 'Cancelled';
    return true;
  });

  const handleCancelConfirm = (id: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: 'Cancelled' as AppointmentStatus } : a
    );
    StorageService.saveAppointments(updated);
    onAppointmentsChange(updated);
    setCancellingAppointmentId(null);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppointment || !newDate) return;

    const updated = appointments.map((a) => {
      if (a.id === reschedulingAppointment.id) {
        return {
          ...a,
          date: newDate,
          time: newTime,
          status: 'Scheduled' as AppointmentStatus,
        };
      }
      return a;
    });

    StorageService.saveAppointments(updated);
    onAppointmentsChange(updated);
    setRescheduleSuccess(`Appointment successfully rescheduled to ${newDate} at ${newTime}.`);
    setTimeout(() => {
      setRescheduleSuccess('');
      setReschedulingAppointment(null);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500">
            View, reschedule, or cancel your scheduled outpatient appointments.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToBook}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* 3 Main Tabs: Upcoming, Completed, Cancelled */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        {(['Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => {
          const count = patientAppointments.filter((a) => {
            if (tab === 'Upcoming') return a.status === 'Scheduled';
            if (tab === 'Completed') return a.status === 'Completed';
            if (tab === 'Cancelled') return a.status === 'Cancelled';
            return false;
          }).length;

          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              id={`tab-appointments-${tab.toLowerCase()}`}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No {activeTab} Appointments</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You currently do not have any appointments under this category.
          </p>
          {activeTab === 'Upcoming' && (
            <button
              type="button"
              onClick={onNavigateToBook}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Schedule an Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {apt.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'Scheduled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h3>
                      <div className="text-blue-600 font-medium text-[11px]">{apt.department}</div>
                      <div className="text-slate-500 text-[11px]">{apt.room}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mt-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Date</span>
                      <span className="font-semibold text-slate-800">{apt.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Time</span>
                      <span className="font-semibold text-slate-800">{apt.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mode</span>
                      <span className="text-slate-700">{apt.appointmentMode || 'In-person'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Type</span>
                      <span className="text-slate-700">{apt.type}</span>
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 pt-1">
                      <span className="font-medium text-slate-500">Notes:</span> {apt.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(apt)}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
                >
                  View Details
                </button>

                {apt.status === 'Scheduled' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReschedulingAppointment(apt);
                        setNewDate(apt.date);
                        setNewTime(apt.time);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancellingAppointmentId(apt.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedAppointment.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">Appointment Record</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient</span>
                  <span className="font-bold text-slate-800">{selectedAppointment.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Doctor</span>
                  <span className="font-bold text-slate-800">{selectedAppointment.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Department</span>
                  <span className="font-medium text-slate-700">{selectedAppointment.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Clinic Location</span>
                  <span className="font-medium text-slate-700">{selectedAppointment.room}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date &amp; Time</span>
                  <span className="font-semibold text-slate-900">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status</span>
                  <span className="font-bold text-blue-700">{selectedAppointment.status}</span>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-semibold block mb-1">Visit Reason / Notes:</span>
                  <p className="text-slate-700">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Consultation Results if Completed */}
              {selectedAppointment.consultationData && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
                  <span className="font-bold text-emerald-900 block">Consultation Summary:</span>
                  <div>
                    <strong>Assessment:</strong> {selectedAppointment.consultationData.assessment}
                  </div>
                  <div>
                    <strong>Observations:</strong> {selectedAppointment.consultationData.observations}
                  </div>
                  {selectedAppointment.consultationData.followUpDate && (
                    <div>
                      <strong>Recommended Follow-up:</strong> {selectedAppointment.consultationData.followUpDate}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setReschedulingAppointment(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Reschedule Appointment
              </h3>
              <button
                type="button"
                onClick={() => setReschedulingAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {rescheduleSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-semibold">
                {rescheduleSuccess}
              </div>
            ) : (
              <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                  Current: <strong>{reschedulingAppointment.doctorName}</strong> ({reschedulingAppointment.department}) on {reschedulingAppointment.date} at {reschedulingAppointment.time}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select New Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Available Slot
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReschedulingAppointment(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancellingAppointmentId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setCancellingAppointmentId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Appointment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel this outpatient appointment? You can book another slot anytime.
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setCancellingAppointmentId(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                No, Keep Visit
              </button>
              <button
                type="button"
                onClick={() => handleCancelConfirm(cancellingAppointmentId)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
