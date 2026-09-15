import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react';
import { Appointment, AppointmentStatus, Patient } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/formatters';

interface AppointmentManagementPageProps {
  appointments: Appointment[];
  patients: Patient[];
  onUpdateStatus: (id: string, newStatus: AppointmentStatus) => void;
  onOpenBookingModal: () => void;
  onSelectPatientById: (patientId: string) => void;
}

export const AppointmentManagementPage: React.FC<AppointmentManagementPageProps> = ({
  appointments,
  patients,
  onUpdateStatus,
  onOpenBookingModal,
  onSelectPatientById,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  const departments = useMemo(() => {
    const list = Array.from(new Set(appointments.map((a) => a.department)));
    return ['All', ...list];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.notes && apt.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
      const matchesDept = departmentFilter === 'All' || apt.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [appointments, searchTerm, statusFilter, departmentFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Appointment Scheduling &amp; Clinic Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track consultation slots, update visit statuses, and coordinate outpatient intake
          </p>
        </div>

        <button
          id="appointments-book-new-btn"
          type="button"
          onClick={onOpenBookingModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="appointment-search-input"
            type="text"
            placeholder="Search by patient, physician, department, or clinical notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            id="appointment-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | AppointmentStatus)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-hidden bg-white text-slate-700 cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            id="appointment-dept-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-hidden bg-white text-slate-700 cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                Dept: {dept}
              </option>
            ))}
          </select>

          {(searchTerm || statusFilter !== 'All' || departmentFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setDepartmentFilter('All');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700">
            Showing <span className="font-bold text-blue-600">{filteredAppointments.length}</span> of{' '}
            {appointments.length} Total Appointments
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Interactive Status Controls Available
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No appointments found for the selected query. Click &quot;Book New Appointment&quot; to
            create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Physician &amp; Dept</th>
                  <th className="py-3 px-4">Visit Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    id={`apt-row-${apt.id}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                        {formatDate(apt.date)}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {apt.time} • {apt.room || 'Suite 101'}
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onSelectPatientById(apt.patientId)}
                        className="font-semibold text-slate-800 hover:text-blue-600 hover:underline text-left cursor-pointer"
                        title="Click to view full patient EHR record"
                      >
                        {apt.patientName}
                      </button>
                      {apt.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[220px]">
                          {apt.notes}
                        </p>
                      )}
                    </td>

                    {/* Doctor & Department */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-400">{apt.department}</div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        {apt.type}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={apt.status} size="sm" />
                    </td>

                    {/* Interactive Status Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status !== 'Completed' && (
                          <button
                            id={`status-complete-${apt.id}`}
                            type="button"
                            onClick={() => onUpdateStatus(apt.id, 'Completed')}
                            className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded flex items-center gap-1 transition-colors cursor-pointer"
                            title="Mark appointment as completed"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}

                        {apt.status !== 'Cancelled' && (
                          <button
                            id={`status-cancel-${apt.id}`}
                            type="button"
                            onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-1 transition-colors cursor-pointer"
                            title="Cancel appointment"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {apt.status !== 'Scheduled' && (
                          <button
                            id={`status-reopen-${apt.id}`}
                            type="button"
                            onClick={() => onUpdateStatus(apt.id, 'Scheduled')}
                            className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded flex items-center gap-1 transition-colors cursor-pointer"
                            title="Restore appointment to Scheduled status"
                          >
                            <span>Re-open</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
