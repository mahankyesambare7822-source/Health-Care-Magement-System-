import React, { useState, useMemo } from 'react';
import {
  Users,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  Printer,
  PlusCircle,
  Stethoscope,
  Filter,
  ArrowRight,
  ShieldAlert,
  UserPlus,
  Building,
  RefreshCw,
} from 'lucide-react';
import { QueueEntry, Doctor, Department, Patient, Appointment } from '../types';
import { StorageService } from '../services/storageService';

interface ReceptionistDashboardPageProps {
  queue: QueueEntry[];
  doctors: Doctor[];
  departments: Department[];
  patients: Patient[];
  onQueueUpdated: (queue: QueueEntry[]) => void;
  onPatientRegistered: (patient: Patient) => void;
}

export const ReceptionistDashboardPage: React.FC<ReceptionistDashboardPageProps> = ({
  queue,
  doctors,
  departments,
  patients,
  onQueueUpdated,
  onPatientRegistered,
}) => {
  const [filterDept, setFilterDept] = useState<string>('All');
  const [filterDoctor, setFilterDoctor] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Walk-in Registration Modal
  const [showWalkinModal, setShowWalkinModal] = useState<boolean>(false);
  const [walkinName, setWalkinName] = useState<string>('');
  const [walkinPhone, setWalkinPhone] = useState<string>('');
  const [walkinAge, setWalkinAge] = useState<number>(35);
  const [walkinGender, setWalkinGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [walkinDoctorId, setWalkinDoctorId] = useState<string>(doctors[0]?.id || '');
  const [walkinReason, setWalkinReason] = useState<string>('Acute walk-in outpatient consult');

  // Print OPD Slip Modal
  const [selectedSlipEntry, setSelectedSlipEntry] = useState<QueueEntry | null>(null);

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return queue.filter((entry) => {
      const matchDept = filterDept === 'All' || entry.department.toLowerCase() === filterDept.toLowerCase();
      const matchDoc = filterDoctor === 'All' || entry.doctorName.toLowerCase().includes(filterDoctor.toLowerCase());
      const matchSearch =
        entry.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(entry.tokenNumber).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.roomNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchDoc && matchSearch;
    });
  }, [queue, filterDept, filterDoctor, searchQuery]);

  const handleUpdateStatus = (id: string | number, newStatus: QueueEntry['status']) => {
    const updated = StorageService.updateQueueStatus(id, newStatus as any);
    onQueueUpdated(updated);
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) return;

    const doc = doctors.find((d) => d.id === walkinDoctorId) || doctors[0] || null;
    const docId = doc?.id || 'doc-general';
    const docName = doc?.name || 'Duty Medical Officer';
    const docDept = doc?.department || 'General Medicine';
    const docRoom = doc?.room || 'OPD Counter 1';

    // 1. Create Patient
    const newPat = StorageService.addPatient({
      name: walkinName.trim(),
      age: walkinAge,
      gender: walkinGender,
      dob: '1990-01-01',
      bloodGroup: 'O+',
      phone: walkinPhone.trim(),
      email: `${walkinName.toLowerCase().replace(/\s+/g, '.')}@patient.apex.org`,
      address: 'Walk-in Local Outpatient',
      emergencyContact: { name: 'Family', relation: 'Relative', phone: walkinPhone.trim() },
      insuranceProvider: 'Standard OPD Counter',
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0],
      vitals: {
        bloodPressure: '120/80 mmHg',
        heartRate: 74,
        temperature: '98.4 °F',
        spO2: 99,
        weightKg: 68,
        bmi: 23.1,
        lastUpdated: 'Counter Intake',
      },
      allergies: [],
      chronicConditions: [],
      recentNotes: walkinReason,
    });
    onPatientRegistered(newPat);

    // 2. Create Appointment
    const apt = StorageService.addAppointment({
      patientId: newPat.id,
      patientName: newPat.name,
      doctorId: docId,
      doctorName: docName,
      department: docDept,
      date: new Date().toISOString().split('T')[0],
      time: 'Immediate Queue',
      type: 'Consultation',
      appointmentMode: 'In-person',
      status: 'Scheduled',
      notes: walkinReason,
      room: docRoom,
    });

    // 3. Create Queue Entry
    const newEntry = StorageService.addQueueEntry({
      appointmentId: apt.id,
      patientId: newPat.id,
      patientName: newPat.name,
      doctorId: docId,
      doctorName: docName,
      department: docDept,
      status: 'Waiting',
      roomNumber: docRoom,
    });

    onQueueUpdated(StorageService.getQueue());
    setShowWalkinModal(false);
    setWalkinName('');
    setWalkinPhone('');
    setSelectedSlipEntry(newEntry);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Receptionist &amp; OPD Token Desk
          </h1>
          <p className="text-xs text-slate-500">
            Manage daily outpatient queues, check in arriving patients, assign tokens &amp; consultation rooms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="register-walkin-btn"
            onClick={() => setShowWalkinModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Walk-in Patient</span>
          </button>
        </div>
      </div>

      {/* Queue Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total In Queue</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{queue.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Daily Outpatients</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Waiting in Lobby</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {queue.filter((q) => q.status === 'Waiting').length}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Ready for Vitals/Call</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">With Doctor</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {queue.filter((q) => q.status === 'With Doctor').length}
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">In Exam Room</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Completed Today</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {queue.filter((q) => q.status === 'Completed').length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Checked Out</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">Filter:</span>
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none"
          >
            <option value="All">All Attending Doctors</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name} ({doc.room})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, token, room..."
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Outpatient Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Live Outpatient Queue Board ({filteredQueue.length})
          </h2>
          <span className="text-xs text-slate-400">Auto-synced with Doctor Clinic Rooms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Doctor &amp; Department</th>
                <th className="py-3 px-4">Clinic Room</th>
                <th className="py-3 px-4">Queue Status</th>
                <th className="py-3 px-4">Waiting Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700 text-sm">
                    {entry.tokenNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{entry.patientName}</span>
                    <span className="text-[11px] text-slate-400">ID: {entry.patientId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800 block">{entry.doctorName}</span>
                    <span className="text-[11px] text-blue-600">{entry.department}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{entry.roomNumber}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        entry.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : entry.status === 'With Doctor'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {entry.estimatedWaitMins} mins
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {entry.status === 'Waiting' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(entry.id || entry.tokenNumber, 'With Doctor')}
                          className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] cursor-pointer"
                        >
                          Call to Room
                        </button>
                      )}
                      {entry.status === 'With Doctor' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(entry.id || entry.tokenNumber, 'Completed')}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] cursor-pointer"
                        >
                          Check Out
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedSlipEntry(entry)}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Print OPD Token Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WALK-IN REGISTRATION MODAL */}
      {showWalkinModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setShowWalkinModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Register Walk-in Outpatient
              </h3>
              <button
                type="button"
                onClick={() => setShowWalkinModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Green"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={110}
                    value={walkinAge}
                    onChange={(e) => setWalkinAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={walkinGender}
                    onChange={(e) => setWalkinGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="555-0199"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Attending Doctor *
                </label>
                <select
                  value={walkinDoctorId}
                  onChange={(e) => setWalkinDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {doctors.length === 0 ? (
                    <option value="">Duty Medical Officer (No doctors registered)</option>
                  ) : (
                    doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.department} ({d.room})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chief Complaint / Reason
                </label>
                <textarea
                  rows={2}
                  value={walkinReason}
                  onChange={(e) => setWalkinReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Generate Token &amp; Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT OPD SLIP MODAL */}
      {selectedSlipEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setSelectedSlipEntry(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-300 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h3 className="font-bold text-slate-900 text-base">Apex Memorial Hospital</h3>
              <p className="text-[10px] text-slate-500">Outpatient Department Token Slip</p>
            </div>

            <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Token Number</span>
              <div className="text-3xl font-mono font-black text-blue-700">
                {selectedSlipEntry.tokenNumber}
              </div>
              <span className="text-[11px] text-slate-500">
                Clinic Room: <strong>{selectedSlipEntry.roomNumber}</strong>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold">{selectedSlipEntry.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Physician:</span>
                <span className="font-semibold">{selectedSlipEntry.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span>{selectedSlipEntry.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Queue Time:</span>
                <span>{selectedSlipEntry.checkInTime}</span>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-dashed border-slate-200">
              Please proceed to waiting lounge. You will be called when token is active.
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedSlipEntry(null)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
