import React from 'react';
import {
  Users,
  Calendar,
  Clock,
  HeartHandshake,
  Activity,
  PlusCircle,
  CalendarPlus,
  Bot,
  ArrowUpRight,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { SimpleBarChart, DepartmentVolumeChart } from '../components/SimpleCharts';
import { StatusBadge } from '../components/StatusBadge';
import { Patient, Appointment, HealthReminder } from '../types';
import { formatDate } from '../utils/formatters';

interface DashboardPageProps {
  patients: Patient[];
  appointments: Appointment[];
  reminders: HealthReminder[];
  onNavigate: (view: string) => void;
  onOpenPatientModal: () => void;
  onOpenBookingModal: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  patients,
  appointments,
  reminders,
  onNavigate,
  onOpenPatientModal,
  onOpenBookingModal,
  onSelectPatient,
}) => {
  // Compute key dashboard metrics
  const totalPatients = patients.length;
  const todayStr = '2026-09-15'; // Synchronized demonstration date

  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'Scheduled');
  const followUps = appointments.filter((a) => a.type === 'Follow-up');

  const scheduledCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const departmentCounts = [
    { name: 'Cardiology', count: 3, percentage: 42, color: 'bg-blue-600' },
    { name: 'General Medicine', count: 2, percentage: 28, color: 'bg-emerald-500' },
    { name: 'Neurology', count: 1, percentage: 15, color: 'bg-purple-500' },
    { name: 'Pediatrics', count: 1, percentage: 15, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Clinical Management &amp; Engagement Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Session: Demonstration Clinic Hub • Demonstration Date: Sept 15, 2026
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="dash-add-patient-btn"
            type="button"
            onClick={onOpenPatientModal}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Patient</span>
          </button>
          <button
            id="dash-book-apt-btn"
            type="button"
            onClick={onOpenBookingModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
          <button
            id="dash-open-ai-btn"
            type="button"
            onClick={() => onNavigate('ai-assistant')}
            className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-total-patients"
          title="Total Patients"
          value={totalPatients}
          subtitle="Registered in mock clinical roster"
          icon={Users}
          trend={{ value: '+2 this month', isPositive: true }}
          accentColor="blue"
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          id="stat-today-appointments"
          title="Today's Appointments"
          value={todayAppointments.length}
          subtitle="Scheduled for Sept 15, 2026"
          icon={Calendar}
          accentColor="emerald"
          onClick={() => onNavigate('appointments')}
        />
        <StatCard
          id="stat-pending-appointments"
          title="Pending Appointments"
          value={pendingAppointments.length}
          subtitle="Scheduled upcoming visits"
          icon={Clock}
          accentColor="amber"
          onClick={() => onNavigate('appointments')}
        />
        <StatCard
          id="stat-upcoming-followups"
          title="Upcoming Follow-ups"
          value={followUps.length}
          subtitle="Chronic care &amp; routine tracking"
          icon={HeartHandshake}
          accentColor="purple"
          onClick={() => onNavigate('appointments')}
        />
      </div>

      {/* Middle Section: Appointment Statistics & Patient Engagement Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple appointment statistics chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Appointment Status Distribution</h3>
                <p className="text-xs text-slate-400">
                  Real-time status breakdown across all scheduled clinic visits
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('appointments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Schedule</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <SimpleBarChart
              stats={{
                scheduled: scheduledCount,
                completed: completedCount,
                cancelled: cancelledCount,
                total: appointments.length,
              }}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Demonstration Volume: {appointments.length} Total Registered Appointments</span>
            <span className="text-[11px] font-mono text-slate-400">Module Status: 100% Functional</span>
          </div>
        </div>

        {/* Patient Engagement Summary Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Patient Engagement Summary</h3>
                <p className="text-xs text-slate-400">Adherence &amp; Outreach Metrics</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('engagement')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Engagement Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Medication Adherence Rate</span>
                  <span className="font-bold text-emerald-700">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">3 of 4 active schedules taken today</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Reminder Delivery Queue</span>
                  <span className="font-bold text-blue-700">92%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Simulated push notifications active</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Survey Feedback Index</span>
                  <span className="font-bold text-purple-700">4.7 / 5.0</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '94%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Positive outpatient satisfaction</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
              <Activity className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Automated SMS/WhatsApp broadcasts remain simulated in current Milestone 3 build.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Patient Activity & Department Visit Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patient Activity */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Recent Patient Activity &amp; Roster</h3>
              <p className="text-xs text-slate-400">
                Click any patient to inspect demographic &amp; vitals profile
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('patients')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              All Patients ({patients.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-md">Patient</th>
                  <th className="py-2.5 px-3">Vitals (BP / HR)</th>
                  <th className="py-2.5 px-3">Primary Diagnosis</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right rounded-r-md">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      No patients registered yet. Add a patient from the Patients tab or click &ldquo;Add Patient&rdquo; above.
                    </td>
                  </tr>
                ) : (
                  patients.slice(0, 5).map((pat) => (
                    <tr
                      key={pat.id}
                      onClick={() => onSelectPatient(pat)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{pat.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {pat.patientId} • {pat.gender}, {pat.age}y
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{pat.vitals?.bloodPressure || '120/80 mmHg'}</div>
                        <div className="text-[11px] text-slate-400">{pat.vitals?.heartRate || 72} bpm</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="line-clamp-1 max-w-[160px] text-slate-600">
                          {pat.chronicConditions?.[0] || 'General Wellness'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={pat.status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-blue-600 hover:text-blue-800 font-semibold text-[11px]">
                          Inspect Profile →
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Volume Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Department Volume</h3>
                <p className="text-xs text-slate-400">Clinical load distribution</p>
              </div>
              <Stethoscope className="w-4 h-4 text-slate-400" />
            </div>

            <DepartmentVolumeChart departments={departmentCounts} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <p className="flex items-center justify-between">
              <span>Attending Staff On Duty:</span>
              <span className="font-semibold text-slate-700">5 Faculty Clinicians</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
