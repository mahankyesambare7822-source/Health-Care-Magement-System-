import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  CalendarCheck,
  Percent,
  Activity,
  HeartHandshake,
  Download,
  Filter,
} from 'lucide-react';
import { Patient, Appointment } from '../types';
import { SimpleBarChart, DepartmentVolumeChart, WeeklyTrendLine } from '../components/SimpleCharts';

interface AnalyticsPageProps {
  patients: Patient[];
  appointments: Appointment[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ patients, appointments }) => {
  const patientCount = patients.length;
  const appointmentCount = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledAppointments = appointments.filter((a) => a.status === 'Cancelled').length;
  const scheduledAppointments = appointments.filter((a) => a.status === 'Scheduled').length;

  const cancellationRate =
    appointmentCount > 0 ? Math.round((cancelledAppointments / appointmentCount) * 100) : 0;
  const completionRate =
    appointmentCount > 0 ? Math.round((completedAppointments / appointmentCount) * 100) : 0;
  const engagementPercentage = 76; // Composite score from reminders + feedback

  const departmentData = [
    { name: 'Cardiology', count: 3, percentage: 42, color: 'bg-blue-600' },
    { name: 'General Medicine', count: 2, percentage: 28, color: 'bg-emerald-500' },
    { name: 'Neurology', count: 1, percentage: 15, color: 'bg-purple-500' },
    { name: 'Pediatrics', count: 1, percentage: 15, color: 'bg-amber-500' },
  ];

  const ageBrackets = [
    { bracket: '0-18 yrs', count: 1, pct: 17, label: 'Pediatric' },
    { bracket: '19-45 yrs', count: 2, pct: 33, label: 'Young Adult' },
    { bracket: '46-65 yrs', count: 2, pct: 33, label: 'Adult' },
    { bracket: '65+ yrs', count: 1, pct: 17, label: 'Geriatric' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Clinical Informatics &amp; Engagement Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated metrics, operational flow rates, and demonstration cohort distribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              alert('Academic Demo: Analytics export simulated in JSON format.');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Demo Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Patient Count</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{patientCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Active demo registry</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Appointments</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{appointmentCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Total scheduled &amp; logged</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{completedAppointments}</div>
          <p className="text-[10px] text-slate-400 mt-1">{completionRate}% encounter completion</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cancellation Rate</span>
            <Percent className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{cancellationRate}%</div>
          <p className="text-[10px] text-slate-400 mt-1">
            {cancelledAppointments} cancelled visits
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Patient Engagement</span>
            <HeartHandshake className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">{engagementPercentage}%</div>
          <p className="text-[10px] text-slate-400 mt-1">Composite adherence index</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Appointment Status Distribution</h3>
              <p className="text-xs text-slate-400">Status counts across entire clinic schedule</p>
            </div>
          </div>
          <SimpleBarChart
            stats={{
              scheduled: scheduledAppointments,
              completed: completedAppointments,
              cancelled: cancelledAppointments,
              total: appointmentCount,
            }}
          />
        </div>

        {/* Weekly Encounter Trends */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Weekly Patient Encounters Trend</h3>
                <p className="text-xs text-slate-400">Daily appointment distribution</p>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <WeeklyTrendLine />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average Daily Encounters: 20.3</span>
            <span className="text-emerald-700 font-semibold">+8% vs prior week</span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Department Volume & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Department Volume Share</h3>
              <p className="text-xs text-slate-400">Consultation distribution by specialty</p>
            </div>
          </div>
          <DepartmentVolumeChart departments={departmentData} />
        </div>

        {/* Demographics Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Patient Cohort Demographics</h3>
              <p className="text-xs text-slate-400">Age distribution of registered patients</p>
            </div>
          </div>

          <div className="space-y-3">
            {ageBrackets.map((ab) => (
              <div key={ab.bracket} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700">
                    {ab.bracket} ({ab.label})
                  </span>
                  <span className="text-slate-500">
                    {ab.count} patient ({ab.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${ab.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Academic Analytics Sandbox • Generated Demo Metrics
          </div>
        </div>
      </div>
    </div>
  );
};
