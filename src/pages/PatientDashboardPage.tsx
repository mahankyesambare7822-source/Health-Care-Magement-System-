import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Sparkles,
  Bot,
  Star,
  Activity,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Appointment, Patient, Prescription, HealthReminder, PatientNotification } from '../types';

interface PatientDashboardPageProps {
  patient?: Patient | null;
  appointments: Appointment[];
  prescriptions: Prescription[];
  reminders: HealthReminder[];
  notifications: PatientNotification[];
  onNavigate: (view: string, extra?: any) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
}

export const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({
  patient,
  appointments,
  prescriptions,
  reminders,
  notifications,
  onNavigate,
  onCancelAppointment,
  onRescheduleAppointment,
}) => {
  const [selectedAppointmentForDetail, setSelectedAppointmentForDetail] = useState<Appointment | null>(null);

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No Patient Profile Active</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The system is clean and has no registered patient profiles yet. You can register a new patient account or book an outpatient appointment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              Register New Patient
            </button>
            <button
              onClick={() => onNavigate('book-appointment')}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Book Direct Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter patient's appointments
  const patientAppointments = appointments.filter(
    (a) => a.patientId === patient.id || a.patientName.toLowerCase() === patient.name.toLowerCase()
  );

  const upcomingAppointments = patientAppointments
    .filter((a) => a.status === 'Scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completedAppointments = patientAppointments.filter((a) => a.status === 'Completed');
  const patientPrescriptions = prescriptions.filter(
    (p) => p.patientId === patient.id || p.patientName.toLowerCase() === patient.name.toLowerCase()
  );
  const pendingReminders = reminders.filter(
    (r) =>
      (r.patientId === patient.id || r.patientName.toLowerCase() === patient.name.toLowerCase()) &&
      r.status === 'Pending'
  );
  const unreadNotifications = notifications.filter((n) => !n.read);

  // Featured upcoming appointment (prompt example: Dr. Rahul Sharma, 20 September 2026, 10:30 AM)
  const featuredAppointment = upcomingAppointments[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Outpatient Care Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {patient.name}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Patient ID: <strong className="text-white font-mono">{patient.patientId}</strong> • Blood Group: <strong className="text-rose-200">{patient.bloodGroup}</strong> • Age: {patient.age} yrs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="patient-dash-book-btn"
              type="button"
              onClick={() => onNavigate('book-appointment')}
              className="px-5 py-3 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Book Appointment</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>AI Health Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigate('my-appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Upcoming</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{upcomingAppointments.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Appointments</span>
        </div>

        <div
          onClick={() => onNavigate('my-appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedAppointments.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Past Visits</span>
        </div>

        <div
          onClick={() => onNavigate('my-prescriptions')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Prescriptions</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{patientPrescriptions.length}</div>
          <span className="text-[11px] text-indigo-600 font-medium">Active Demo Rx</span>
        </div>

        <div
          onClick={() => onNavigate('health-reminders')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Follow-ups</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingReminders.length}</div>
          <span className="text-[11px] text-amber-600 font-medium">Pending Tasks</span>
        </div>

        <div
          onClick={() => onNavigate('health-reminders')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-rose-400 hover:shadow-xs transition-all cursor-pointer col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Notifications</span>
            <Bell className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{unreadNotifications.length}</div>
          <span className="text-[11px] text-rose-600 font-medium">Unread Updates</span>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Patient Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          <button
            type="button"
            onClick={() => onNavigate('book-appointment')}
            className="p-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('my-appointments')}
            className="p-2.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-slate-600" />
            <span>Appointments</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('book-appointment')}
            className="p-2.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-slate-600" />
            <span>Doctors</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('my-medical-records')}
            className="p-2.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-slate-600" />
            <span>Records</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('my-prescriptions')}
            className="p-2.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Prescriptions</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('health-reminders')}
            className="p-2.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Reminders</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('feedback')}
            className="p-2.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>Feedback</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ai-assistant')}
            className="p-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Featured Appointment + Recent Activity & Vitals */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Featured Upcoming Appointment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Upcoming Appointment
                  </h2>
                  <p className="text-xs text-slate-500">Your next scheduled clinical visit</p>
                </div>
              </div>

              {featuredAppointment && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Confirmed
                </span>
              )}
            </div>

            {featuredAppointment ? (
              <div className="space-y-4">
                {/* Appointment Card matching user prompt example */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Doctor</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {featuredAppointment.doctorName}
                      </span>
                      <span className="text-blue-600 block">{featuredAppointment.department}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Date &amp; Time</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {featuredAppointment.date}
                      </span>
                      <span className="text-slate-600 block">{featuredAppointment.time}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Clinic Location</span>
                      <span className="font-medium text-slate-800">{featuredAppointment.room}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Appointment Mode</span>
                      <span className="font-medium text-slate-800">
                        {featuredAppointment.appointmentMode || 'In-person'}
                      </span>
                    </div>
                  </div>

                  {featuredAppointment.notes && (
                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                      <span className="text-slate-400 font-medium">Notes: </span>
                      {featuredAppointment.notes}
                    </div>
                  )}
                </div>

                {/* Actions: View Details, Reschedule, Cancel */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedAppointmentForDetail(featuredAppointment)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => onRescheduleAppointment(featuredAppointment)}
                    className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>

                  <button
                    type="button"
                    onClick={() => onCancelAppointment(featuredAppointment.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No upcoming appointments scheduled.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('book-appointment')}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Book an Appointment Now
                </button>
              </div>
            )}
          </div>

          {/* Pending Health Tasks / Reminders preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Preventive Health Tasks &amp; Reminders
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('health-reminders')}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                View All ({reminders.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {r.category}
                      </span>
                      <span className="font-semibold text-slate-800">{r.title}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{r.notes}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">Due {r.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vitals Summary & Medical Overview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Vitals Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Recorded Vitals (Demo)</h3>
              </div>
              <span className="text-[10px] text-slate-400">
                Updated: {patient.vitals?.lastUpdated || 'Recent'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5 text-[11px]">Blood Pressure</span>
                <span className="font-bold text-slate-900 text-sm">
                  {patient.vitals?.bloodPressure || '120/80 mmHg'}
                </span>
                <span className="text-[10px] text-emerald-600 block">Normal Range</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5 text-[11px]">Heart Rate</span>
                <span className="font-bold text-slate-900 text-sm">
                  {patient.vitals?.heartRate || 72} bpm
                </span>
                <span className="text-[10px] text-emerald-600 block">Resting</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5 text-[11px]">SpO2 (Oxygen)</span>
                <span className="font-bold text-slate-900 text-sm">
                  {patient.vitals?.spO2 || 98}%
                </span>
                <span className="text-[10px] text-emerald-600 block">Adequate</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5 text-[11px]">BMI &amp; Weight</span>
                <span className="font-bold text-slate-900 text-sm">
                  {patient.vitals?.weightKg || 65} kg ({patient.vitals?.bmi || 22.5})
                </span>
                <span className="text-[10px] text-slate-500 block">Healthy Weight</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Known Allergies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies?.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-400 block text-[11px]">Chronic Conditions:</span>
                <span className="text-slate-700 font-medium">
                  {patient.chronicConditions?.join(', ') || 'None recorded'}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Prototype Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Academic Demonstration Notice</span>
              <p className="text-[11px] leading-relaxed text-amber-800">
                This dashboard demonstrates simulated hospital outpatient operations. Medical values and visit records are sanitized mock representations for software engineering evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointmentForDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setSelectedAppointmentForDetail(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedAppointmentForDetail.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">Appointment Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointmentForDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="font-bold text-slate-900">{selectedAppointmentForDetail.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-medium text-slate-800">{selectedAppointmentForDetail.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date &amp; Time:</span>
                <span className="font-semibold text-slate-800">
                  {selectedAppointmentForDetail.date} at {selectedAppointmentForDetail.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clinic Room:</span>
                <span className="font-medium text-slate-800">{selectedAppointmentForDetail.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-700">{selectedAppointmentForDetail.status}</span>
              </div>
              {selectedAppointmentForDetail.notes && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block mb-1">Reason / Symptoms:</span>
                  <p className="p-2.5 rounded-lg bg-slate-50 text-slate-700">{selectedAppointmentForDetail.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAppointmentForDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
