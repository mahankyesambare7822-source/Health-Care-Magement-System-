import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  UserCheck,
  Eye,
  Edit2,
  CalendarPlus,
  Shield,
  Activity,
  Heart,
} from 'lucide-react';
import { Patient, Appointment } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/formatters';

interface PatientManagementPageProps {
  patients: Patient[];
  appointments: Appointment[];
  onSelectPatient: (patient: Patient) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (patient: Patient) => void;
  onOpenBookingForPatient: (patient: Patient) => void;
}

export const PatientManagementPage: React.FC<PatientManagementPageProps> = ({
  patients,
  appointments,
  onSelectPatient,
  onOpenAddModal,
  onOpenEditModal,
  onOpenBookingForPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Discharged' | 'Outpatient'>('All');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male' | 'Other'>('All');

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.chronicConditions.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.assignedDoctorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchGender = genderFilter === 'All' || p.gender === genderFilter;

      return matchSearch && matchStatus && matchGender;
    });
  }, [patients, searchTerm, statusFilter, genderFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Patient Records &amp; Clinical Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain patient demographics, vitals, allergies, and appointment histories
          </p>
        </div>

        <button
          id="patient-page-add-btn"
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="patient-search-input"
            type="text"
            placeholder="Search patients by name, ID (e.g. PT-2026), condition, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            id="patient-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'All' | 'Active' | 'Discharged' | 'Outpatient')
            }
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-hidden bg-white text-slate-700 cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Outpatient">Outpatient</option>
            <option value="Discharged">Discharged</option>
          </select>

          <select
            id="patient-gender-filter"
            value={genderFilter}
            onChange={(e) =>
              setGenderFilter(e.target.value as 'All' | 'Female' | 'Male' | 'Other')
            }
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-hidden bg-white text-slate-700 cursor-pointer"
          >
            <option value="All">Gender: All</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          {(searchTerm || statusFilter !== 'All' || genderFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setGenderFilter('All');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700">
            Showing <span className="font-bold text-blue-600">{filteredPatients.length}</span> of{' '}
            {patients.length} Registered Patients
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Demo Repository • Local Persistence Enabled
          </span>
        </div>

        {patients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Patients Registered Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The hospital directory is clean. You can register your first patient to start maintaining demographics, vitals, and appointments.
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Patient</span>
            </button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No patient records match the selected criteria. Try adjusting your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/60">
                <tr>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Blood &amp; Age</th>
                  <th className="py-3 px-4">Latest Vitals</th>
                  <th className="py-3 px-4">Allergies &amp; Chronic Conditions</th>
                  <th className="py-3 px-4">Assigned Attending</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((pat) => (
                  <tr
                    key={pat.id}
                    id={`patient-row-${pat.id}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Patient Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 text-sm">{pat.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {pat.patientId} • DOB: {formatDate(pat.dob)}
                      </div>
                    </td>

                    {/* Blood & Age */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                          {pat.bloodGroup}
                        </span>
                        <span className="text-slate-600">
                          {pat.age}y ({pat.gender})
                        </span>
                      </div>
                    </td>

                    {/* Vitals */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {pat.vitals.bloodPressure}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {pat.vitals.heartRate} bpm • {pat.vitals.spO2}% SpO2
                      </div>
                    </td>

                    {/* Allergies / Conditions */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 max-w-[200px]">
                        {pat.chronicConditions.length > 0 ? (
                          <div className="text-slate-700 truncate font-medium">
                            {pat.chronicConditions.join(', ')}
                          </div>
                        ) : (
                          <span className="text-slate-400">None chronic</span>
                        )}
                        {pat.allergies.length > 0 && (
                          <div className="text-[11px] text-rose-600 truncate font-medium">
                            Allergy: {pat.allergies.join(', ')}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{pat.assignedDoctorName}</div>
                      <div className="text-[11px] text-slate-400">
                        Adm: {formatDate(pat.admissionDate)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={pat.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectPatient(pat)}
                          title="View complete medical profile"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenBookingForPatient(pat)}
                          title="Schedule appointment"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <CalendarPlus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(pat)}
                          title="Edit patient demographics"
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
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
