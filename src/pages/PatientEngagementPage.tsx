import React, { useState } from 'react';
import {
  HeartHandshake,
  Pill,
  Bell,
  MessageSquareHeart,
  CheckCircle,
  Clock,
  Send,
  Star,
  ShieldAlert,
  CalendarCheck,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {
  HealthReminder,
  MedicationSchedule,
  PatientNotification,
  PatientFeedback,
  Patient,
} from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/formatters';

interface PatientEngagementPageProps {
  reminders: HealthReminder[];
  medications: MedicationSchedule[];
  notifications: PatientNotification[];
  feedback: PatientFeedback[];
  patients: Patient[];
  onToggleReminder: (id: string) => void;
  onToggleMedication: (id: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onSubmitFeedback: (feedback: Omit<PatientFeedback, 'id' | 'date'>) => void;
  onAddReminder: (reminder: Omit<HealthReminder, 'id'>) => void;
}

export const PatientEngagementPage: React.FC<PatientEngagementPageProps> = ({
  reminders,
  medications,
  notifications,
  feedback,
  patients,
  onToggleReminder,
  onToggleMedication,
  onMarkNotificationRead,
  onSubmitFeedback,
  onAddReminder,
}) => {
  // Feedback form state
  const [feedbackPatientName, setFeedbackPatientName] = useState(patients[0]?.name || 'Eleanor Vance-Cole');
  const [rating, setRating] = useState(5);
  const [department, setDepartment] = useState('Cardiology');
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // New Reminder modal state
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newRemPatientId, setNewRemPatientId] = useState(patients[0]?.id || '');
  const [newRemCategory, setNewRemCategory] = useState<'Vaccination' | 'Screening' | 'Lifestyle' | 'Medication'>('Screening');
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemNotes, setNewRemNotes] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter your feedback comments.');
      return;
    }
    onSubmitFeedback({
      patientName: feedbackPatientName,
      rating,
      department,
      comment: comment.trim(),
    });
    setComment('');
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim()) {
      alert('Please enter reminder title.');
      return;
    }
    const p = patients.find((pat) => pat.id === newRemPatientId) || patients[0];
    onAddReminder({
      patientId: newRemPatientId || (p ? p.id : 'pat-general'),
      patientName: p ? p.name : 'General Patient',
      category: newRemCategory,
      title: newRemTitle.trim(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'Pending',
      notes: newRemNotes.trim() || 'Simulated automated reminder queued for dispatch.',
    });
    setShowAddReminderModal(false);
    setNewRemTitle('');
    setNewRemNotes('');
  };

  const takenMedsCount = medications.filter((m) => m.takenToday).length;
  const adherenceRate = medications.length > 0 ? Math.round((takenMedsCount / medications.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Patient Engagement &amp; Adherence Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated reminders, medication scheduling, simulated notifications, and patient feedback
          </p>
        </div>

        {/* Warning banner pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo Dispatcher: Does NOT transmit real cellular SMS or WhatsApp messages</span>
        </div>
      </div>

      {/* Engagement Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Medication Adherence</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-700">{adherenceRate}%</span>
            <span className="text-[11px] text-slate-400">
              {takenMedsCount} / {medications.length} taken
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${adherenceRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Outreach Delivery</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-blue-700">92.4%</span>
            <span className="text-[11px] text-slate-400">Simulated queue</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Survey Satisfaction</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-purple-700">4.8 / 5.0</span>
            <span className="text-[11px] text-slate-400">{feedback.length} responses</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '96%' }} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Active Reminders</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-amber-700">{reminders.length}</span>
            <span className="text-[11px] text-slate-400">Scheduled checks</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }} />
          </div>
        </div>
      </div>

      {/* Grid: Health Reminders & Medication Schedule UI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Health Reminders */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                  Health &amp; Preventive Reminders
                </h3>
                <p className="text-xs text-slate-400">
                  Click status pill to toggle Sent / Pending state
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddReminderModal(true)}
                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-xs">{rem.title}</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-medium">
                          {rem.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{rem.notes}</p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                        <span>Patient: {rem.patientName}</span>
                        <span>•</span>
                        <span>Due: {formatDate(rem.dueDate)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleReminder(rem.id)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <StatusBadge status={rem.status} size="sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Medication Schedule UI */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  Medication Adherence Schedule
                </h3>
                <p className="text-xs text-slate-400">
                  Toggle checkboxes to simulate patient daily pill intake
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Today: {takenMedsCount} / {medications.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => onToggleMedication(med.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    med.takenToday
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={med.takenToday}
                      onChange={() => onToggleMedication(med.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span>{med.medicationName}</span>
                        <span className="font-normal text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {med.timeSlot}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {med.dosage} • {med.frequency}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Patient: {med.patientName} • Rx: {med.prescribedBy}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      med.takenToday
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {med.takenToday ? 'Taken' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Automated adherence verification enabled</span>
            <span className="text-slate-500">Local session synced</span>
          </div>
        </div>
      </div>

      {/* Grid: Patient Notifications & Basic Feedback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Patient Notifications Dispatcher */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-600" />
                Simulated Notification Dispatch Queue
              </h3>
              <p className="text-xs text-slate-400">
                Simulates dispatch of appointment &amp; clinical alerts
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Channel: Multi-Channel Mock
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border text-xs transition-colors ${
                  !notif.read ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/40 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-slate-800">{notif.title}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                      {notif.channel}
                    </span>
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                  <span>Recipient: {notif.patientName}</span>
                  <span>{notif.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Basic Feedback Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <MessageSquareHeart className="w-4 h-4 text-rose-500" />
                Patient Satisfaction Survey Form
              </h3>
              <p className="text-xs text-slate-400">Submit clinic encounter feedback</p>
            </div>
          </div>

          {feedbackSubmitted && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Feedback logged successfully to demonstration feedback repository!</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                <select
                  value={feedbackPatientName}
                  onChange={(e) => setFeedbackPatientName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg outline-hidden bg-white"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Satisfaction Rating (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-600 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Encounter Comments &amp; Review
              </label>
              <textarea
                rows={2}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share notes on clinic wait time, bedside manner, or communication clarity..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              id="submit-patient-feedback-btn"
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Survey Response</span>
            </button>
          </form>

          {/* Recent feedback log snippet */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h5 className="text-[11px] font-bold uppercase text-slate-400 mb-2">
              Recent Feedback Records ({feedback.length})
            </h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {feedback.slice(0, 3).map((fb) => (
                <div key={fb.id} className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">{fb.patientName}</span>
                    <span className="text-amber-600 font-bold">★ {fb.rating}.0</span>
                  </div>
                  <p className="text-slate-500 italic mt-0.5">&quot;{fb.comment}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick modal to add new reminder */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Add Preventive Health Reminder</h3>
            <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={newRemPatientId}
                  onChange={(e) => setNewRemPatientId(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {patients.length === 0 ? (
                    <option value="">No registered patients</option>
                  ) : (
                    patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newRemCategory}
                  onChange={(e) =>
                    setNewRemCategory(
                      e.target.value as 'Vaccination' | 'Screening' | 'Lifestyle' | 'Medication'
                    )
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Screening">Clinical Screening (Labs/Imaging)</option>
                  <option value="Vaccination">Vaccination Booster</option>
                  <option value="Lifestyle">Lifestyle / Vitals Self-Log</option>
                  <option value="Medication">Medication Refill Alert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Diabetic Retinopathy Eye Exam"
                  value={newRemTitle}
                  onChange={(e) => setNewRemTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instruction Notes</label>
                <textarea
                  rows={2}
                  value={newRemNotes}
                  onChange={(e) => setNewRemNotes(e.target.value)}
                  placeholder="Instructions for the patient..."
                  className="w-full p-2 border rounded-lg outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-semibold"
                >
                  Queue Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
