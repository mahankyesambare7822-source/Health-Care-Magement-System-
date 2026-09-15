import React, { useState } from 'react';
import {
  Activity,
  HeartPulse,
  Calendar,
  FileText,
  User,
  Stethoscope,
  ShieldAlert,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Patient, Appointment, Prescription } from '../types';

interface PatientMedicalRecordsPageProps {
  patient?: Patient | null;
  appointments: Appointment[];
  prescriptions: Prescription[];
}

export const PatientMedicalRecordsPage: React.FC<PatientMedicalRecordsPageProps> = ({
  patient,
  appointments,
  prescriptions,
}) => {
  const [expandedAptId, setExpandedAptId] = useState<string | null>(null);

  const pastAppointments = patient
    ? appointments.filter(
        (a) =>
          (a.patientId === patient.id || a.patientName.toLowerCase() === patient.name.toLowerCase()) &&
          a.status === 'Completed'
      )
    : appointments.filter((a) => a.status === 'Completed');

  const patientRx = patient
    ? prescriptions.filter(
        (p) => p.patientId === patient.id || p.patientName.toLowerCase() === patient.name.toLowerCase()
      )
    : prescriptions;

  const toggleExpand = (id: string) => {
    setExpandedAptId(expandedAptId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Medical Records (EHR Demo)
          </h1>
          <p className="text-xs text-slate-500">
            Longitudinal clinical history, recorded vitals, previous consultations, and treatment summaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {patient.patientId}
          </span>
        </div>
      </div>

      {/* Prominent Required Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Academic Demonstration Project Notice</strong>
          <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
            “Demo medical record — not a real clinical record. This view demonstrates how an electronic health record (EHR) timeline aggregates outpatient encounters, recorded vitals, and physician notes.”
          </p>
        </div>
      </div>

      {/* Patient Profile & Baseline Vitals Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500" />
          <span>Patient Baseline &amp; Vitals Profile</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Blood Group</span>
            <span className="text-base font-bold text-rose-600">{patient.bloodGroup}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Last Recorded Blood Pressure</span>
            <span className="text-base font-bold text-slate-900">
              {patient.vitals?.bloodPressure || '120/80 mmHg'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Resting Pulse &amp; SpO2</span>
            <span className="text-base font-bold text-slate-900">
              {patient.vitals?.heartRate || 72} bpm • {patient.vitals?.spO2 || 98}%
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">BMI Index</span>
            <span className="text-base font-bold text-slate-900">
              {patient.vitals?.bmi || 23.5} ({patient.vitals?.weightKg || 65} kg)
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
          <div>
            <span className="text-slate-400 block text-[11px] mb-1 font-semibold">
              Documented Allergies:
            </span>
            <div className="flex flex-wrap gap-1">
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

          <div>
            <span className="text-slate-400 block text-[11px] mb-1 font-semibold">
              Chronic Clinical Conditions:
            </span>
            <p className="text-slate-700 font-medium">
              {patient.chronicConditions?.join(', ') || 'No chronic conditions diagnosed.'}
            </p>
          </div>
        </div>
      </div>

      {/* Longitudinal Consultation Timeline */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Past Consultations &amp; Clinical Encounters ({pastAppointments.length})</span>
        </h2>

        {pastAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No completed consultation records found in the current mock session.
          </div>
        ) : (
          <div className="space-y-3">
            {pastAppointments.map((apt) => {
              const isExpanded = expandedAptId === apt.id;
              // find prescription matching this appointment
              const matchedRx = patientRx.find((r) => r.appointmentId === apt.id);

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleExpand(apt.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70"
                  >
                    <div className="flex items-center gap-4 text-xs">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h3>
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {apt.department}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Encounter Date: <strong>{apt.date}</strong> at {apt.time} • Room: {apt.room}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Consultation Completed
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 bg-slate-50/50 border-t border-slate-100 space-y-4 text-xs">
                      {/* Clinical Encounter Notes */}
                      {apt.consultationData ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                              Chief Complaint &amp; Symptoms
                            </span>
                            <p className="text-slate-800">{apt.consultationData.symptoms}</p>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                              Clinical Assessment / Diagnosis
                            </span>
                            <p className="font-semibold text-blue-900">
                              {apt.consultationData.assessment}
                            </p>
                          </div>

                          <div className="sm:col-span-2 p-3 bg-white rounded-xl border border-slate-200/80">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                              Objective Clinical Observations
                            </span>
                            <p className="text-slate-700">{apt.consultationData.observations}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">
                          Standard consultation notes: {apt.notes || 'Routine follow-up completed.'}
                        </p>
                      )}

                      {/* Associated Prescription */}
                      {matchedRx && (
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-950">
                              Prescription Issued ({matchedRx.id})
                            </span>
                            <span className="text-[11px] text-indigo-700">
                              Follow-up Date: {matchedRx.followUpDate}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {matchedRx.items.map((it, idx) => (
                              <div key={idx} className="text-slate-700 text-[11px]">
                                • <strong>{it.medicineName}</strong> - {it.dosage} ({it.duration})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
