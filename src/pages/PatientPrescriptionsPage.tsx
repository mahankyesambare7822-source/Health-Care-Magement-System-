import React, { useState } from 'react';
import {
  FileText,
  Pill,
  Printer,
  Calendar,
  User,
  Stethoscope,
  HeartPulse,
  Clock,
  ShieldAlert,
  Download,
} from 'lucide-react';
import { Prescription, Patient } from '../types';

interface PatientPrescriptionsPageProps {
  patient?: Patient | null;
  prescriptions: Prescription[];
}

export const PatientPrescriptionsPage: React.FC<PatientPrescriptionsPageProps> = ({
  patient,
  prescriptions,
}) => {
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const patientRx = patient
    ? prescriptions.filter(
        (p) => p.patientId === patient.id || p.patientName.toLowerCase() === patient.name.toLowerCase()
      )
    : prescriptions;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Digital Prescriptions
          </h1>
          <p className="text-xs text-slate-500">
            Official simulated outpatient prescriptions issued by attending physicians.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {patientRx.length} Digital Prescriptions on File
        </span>
      </div>

      {patientRx.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
          <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Prescriptions Issued Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your attending doctor will generate a digital prescription following completed consultations.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {patientRx.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {rx.id}
                    </span>
                    <span className="text-[11px] text-slate-400">Date: {rx.date}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600">
                    {rx.department}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span>{rx.doctorName}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Clinical Assessment / Diagnosis
                    </span>
                    <p className="font-medium text-slate-800">{rx.diagnosis}</p>
                  </div>

                  {/* Medications List */}
                  <div>
                    <span className="text-slate-500 font-bold block mb-1.5 text-[11px]">
                      Prescribed Medications ({rx.items.length})
                    </span>
                    <div className="space-y-1.5">
                      {rx.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-950">{item.medicineName}</span>
                            <span className="text-[10px] font-semibold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                              {item.duration}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">{item.dosage}</div>
                          <div className="text-[10px] text-slate-500 italic">{item.instructions}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {rx.instructions && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">Doctor's Advice: </span>
                      {rx.instructions}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Follow-up: <strong className="text-slate-700">{rx.followUpDate || 'As advised'}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRx(rx)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Rx Slip</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Prescription Slip Modal */}
      {selectedRx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setSelectedRx(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hospital Rx Header */}
            <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Apex Memorial Hospital</h2>
                  <p className="text-[11px] text-slate-500">Outpatient Consultation &amp; Prescription Record</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Doctor & Patient Info Bar */}
            <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Physician</span>
                <span className="font-bold text-slate-900 text-sm">{selectedRx.doctorName}</span>
                <span className="text-blue-700 block text-[11px]">{selectedRx.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Details</span>
                <span className="font-bold text-slate-900 text-sm">{selectedRx.patientName}</span>
                <span className="text-slate-600 block text-[11px]">ID: {patient.patientId} • Blood: {patient.bloodGroup}</span>
              </div>
            </div>

            {/* Diagnosis & Rx Symbol */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Diagnosis</span>
                  <span className="font-bold text-slate-900">{selectedRx.diagnosis}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Prescription ID</span>
                  <span className="font-mono font-bold text-indigo-700">{selectedRx.id}</span>
                </div>
              </div>

              {/* Rx Symbol & Medication Items */}
              <div>
                <div className="text-2xl font-serif font-black text-blue-800 mb-2 italic">℞</div>
                <div className="space-y-3">
                  {selectedRx.items.map((item, idx) => (
                    <div key={idx} className="pb-2.5 border-b border-slate-100 space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-900 text-sm">
                        <span>{idx + 1}. {item.medicineName}</span>
                        <span className="text-xs font-semibold text-indigo-700">{item.duration}</span>
                      </div>
                      <div className="text-slate-700 pl-4">{item.dosage}</div>
                      <div className="text-[11px] text-slate-500 pl-4 italic">{item.instructions}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRx.instructions && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950">
                  <strong className="block text-amber-900 mb-0.5">Physician Advice &amp; Lifestyle Guidance:</strong>
                  {selectedRx.instructions}
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2">
                <span>Next Scheduled Follow-up: <strong>{selectedRx.followUpDate || 'Routine'}</strong></span>
                <span>Digitally Signed: <strong>{selectedRx.doctorName}</strong></span>
              </div>
            </div>

            {/* Academic Notice */}
            <div className="p-2.5 bg-slate-100 rounded-lg text-[10px] text-slate-500 text-center">
              “Academic Demonstration Project | Demo Data Only | Not for Real Medical Use”
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Demo Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
