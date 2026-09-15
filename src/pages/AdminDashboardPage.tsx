import React, { useState } from 'react';
import {
  Building2,
  Users,
  Stethoscope,
  CalendarCheck,
  Activity,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Layers,
  Clock,
  AlertCircle,
  Sparkles,
  Plus,
  ArrowUpRight,
  BarChart3,
  Lock,
} from 'lucide-react';
import {
  Patient,
  Doctor,
  Appointment,
  StaffMember,
  Department,
} from '../types';
import { FUTURE_MODULES } from '../data/mockData';
import { StorageService } from '../services/storageService';

interface AdminDashboardPageProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  staff: StaffMember[];
  departments: Department[];
  onNavigateToModule: (moduleId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  patients,
  doctors,
  appointments,
  staff,
  departments,
  onNavigateToModule,
  onNavigateToTab,
}) => {
  const [selectedStaffRole, setSelectedStaffRole] = useState<string>('All');
  const [staffList, setStaffList] = useState<StaffMember[]>(staff);

  // New staff modal
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Doctor' | 'Nurse' | 'Receptionist' | 'Administrator'>('Nurse');
  const [newStaffDept, setNewStaffDept] = useState('Cardiology');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  const filteredStaff = staffList.filter(
    (s) => selectedStaffRole === 'All' || s.role.toLowerCase() === selectedStaffRole.toLowerCase()
  );

  const completedApts = appointments.filter((a) => a.status === 'Completed').length;
  const scheduledApts = appointments.filter((a) => a.status === 'Scheduled').length;

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newMember: StaffMember = {
      id: `staff-${Date.now().toString().slice(-4)}`,
      name: newStaffName.trim(),
      role: newStaffRole,
      department: newStaffDept,
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@apex.hospital.org`,
      phone: '+1 (555) 432-1000',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      shift: 'Day Shift (08:00 - 16:00)',
    };

    const updated = StorageService.addStaff(newMember);
    setStaffList(updated);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Executive Operations &amp; Administration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Admin Level
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            System overview, clinical staff directories, department capacity, and phase 2 integration roadmaps.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddStaffModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Hospital Metrics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Registered</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{patients.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Outpatients on Record</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Doctors</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{doctors.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Attending Clinicians</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Consultations</span>
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
          <span className="text-[11px] text-indigo-600 font-medium">
            {completedApts} Done • {scheduledApts} Pending
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Hospital Staff</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{staffList.length}</div>
          <span className="text-[11px] text-purple-600 font-medium">Nurses, Admins &amp; Staff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Departments</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{departments.length}</div>
          <span className="text-[11px] text-amber-600 font-medium">OPD Specialty Clinics</span>
        </div>
      </div>

      {/* Two Column Grid: Department Capacities & Staff Roster */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Department Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Department Specialties ({departments.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Wing &amp; Capacity</span>
          </div>

          <div className="space-y-2.5">
            {departments.map((d) => {
              const aptsInDept = appointments.filter(
                (a) => a.department.toLowerCase() === d.name.toLowerCase()
              ).length;

              return (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{d.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({d.floor})</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Head: {d.headOfDepartment}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-blue-700 font-bold block">{d.doctorCount} Doctors</span>
                    <span className="text-[10px] text-slate-400">{aptsInDept} Visits Logged</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Staff Management Directory */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>Hospital Staff Personnel ({filteredStaff.length})</span>
            </h3>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              {['All', 'Doctor', 'Nurse', 'Receptionist', 'Administrator'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedStaffRole(role)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] font-semibold ${
                    selectedStaffRole === role
                      ? 'bg-purple-100 text-purple-800'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredStaff.map((person) => (
              <div
                key={person.id}
                className="p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{person.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        person.role === 'Doctor'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : person.role === 'Nurse'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : person.role === 'Receptionist'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {person.role}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {person.department} • {person.shift}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-600 block">{person.phone}</span>
                  <span className="text-[10px] text-slate-400">{person.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* College Project 50% Milestone & Coming Soon Modules Showcase */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                Phase 2 &amp; Incomplete Modules Showcase (Academic Capstone)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              The project is currently at approximately 50% core functionality milestone. Planned modules are documented below.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            Sprint 4 Roadmap
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FUTURE_MODULES.map((mod) => (
            <div
              key={mod.id}
              onClick={() => onNavigateToModule(mod.id)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {mod.plannedPhase}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {mod.completionPercent}% Built
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1">{mod.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-purple-700 font-semibold">
                <span>View Architecture Spec</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setShowAddStaffModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Staff Personnel</h3>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Taylor, RN"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={newStaffDept}
                    onChange={(e) => setNewStaffDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="j.taylor@apex.hospital.org"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
