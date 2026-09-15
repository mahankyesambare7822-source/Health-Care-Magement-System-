import React from 'react';
import {
  BrainCircuit,
  Activity,
  Network,
  Database,
  MessageSquare,
  Watch,
  CreditCard,
  Layers,
  Code2,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Terminal,
  CheckCircle,
} from 'lucide-react';
import { FUTURE_MODULES } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { FutureModuleInfo } from '../types';

interface IncompleteModulePageProps {
  moduleId: string;
  onNavigate: (view: string) => void;
}

export const IncompleteModulePage: React.FC<IncompleteModulePageProps> = ({
  moduleId,
  onNavigate,
}) => {
  const currentModule: FutureModuleInfo =
    FUTURE_MODULES.find((m) => m.id === moduleId) || FUTURE_MODULES[0];

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'mod-ai-predictive':
        return BrainCircuit;
      case 'mod-disease-risk':
        return Activity;
      case 'mod-hospital-integration':
        return Network;
      case 'mod-ehr-integration':
        return Database;
      case 'mod-sms-whatsapp':
        return MessageSquare;
      case 'mod-iot-wearables':
        return Watch;
      case 'mod-payments':
        return CreditCard;
      default:
        return Layers;
    }
  };

  const Icon = getModuleIcon(currentModule.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Roadmap Quick Navigation Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="font-bold text-slate-400 uppercase text-[10px] shrink-0 mr-1">
          Future Modules:
        </span>
        {FUTURE_MODULES.map((m) => {
          const isCurrent = m.id === currentModule.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onNavigate(m.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{m.title}</span>
              <StatusBadge status={m.status} size="sm" />
            </button>
          );
        })}
      </div>

      {/* Main Module Specification Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Top Status Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-amber-50/20 to-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300/40 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                    {currentModule.title}
                  </h1>
                  <StatusBadge status={currentModule.status} size="md" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic Milestone Specification • Planned Phase: {currentModule.plannedPhase}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end text-xs">
              <span className="text-slate-400">Milestone Progress:</span>
              <span className="font-bold text-amber-800 font-mono text-sm">
                {currentModule.completionPercent}% Specification Complete
              </span>
              <div className="w-36 h-2 rounded-full bg-slate-200 mt-1 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${currentModule.completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Notice Banner */}
        <div className="p-4 mx-6 my-6 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950">
              Academic Milestone Status: {currentModule.status.toUpperCase()}
            </h4>
            <p className="leading-relaxed text-amber-900/90">
              This module represents a planned component of the student software project architecture
              (currently at approximately 50% overall development progress). The functional core
              (Patient Records, Appointments, Adherence Tracker, and Educational AI Assistant) is
              live in the primary navigation. This page outlines the technical specification and API
              contracts prepared for upcoming evaluation sprints.
            </p>
          </div>
        </div>

        {/* Technical Architecture & Specifications */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Research Objective &amp; Module Scope
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              {currentModule.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Prerequisites */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                Technical &amp; Interoperability Prerequisites
              </h4>
              <ul className="space-y-2 pt-1">
                {currentModule.technicalPrerequisites.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture Pipeline */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Layers className="w-4 h-4 text-blue-600" />
                System Pipeline &amp; Data Flow
              </h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
                {currentModule.architectureOverview}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Lead Research Sub-group: <span className="font-semibold text-slate-600">{currentModule.leadResearcher}</span>
              </p>
            </div>
          </div>

          {/* Mock Schema / Payload Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Terminal className="w-4 h-4 text-slate-600" />
                Planned Data Contract / JSON Schema Draft
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                JSON-Schema Draft v7
              </span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              {currentModule.mockPayloadExample}
            </pre>
          </div>

          {/* Risk Assessment & Verification */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
            <Code2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Deployment &amp; Compliance Risk Note:</span>
              <p className="text-slate-600 mt-0.5">{currentModule.riskAssessment}</p>
            </div>
          </div>

          {/* Quick Return to Core Functional Features */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">
              Ready to test functional modules?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate('patients')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 transition-colors cursor-pointer font-semibold shadow-xs"
              >
                <span>Explore Patients</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
