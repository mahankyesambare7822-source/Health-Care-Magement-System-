import React from 'react';
import { GraduationCap, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface AcademicBannerProps {
  onResetData?: () => void;
}

export const AcademicBanner: React.FC<AcademicBannerProps> = ({ onResetData }) => {
  return (
    <div
      id="academic-project-disclaimer"
      className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2.5 text-xs border-b border-indigo-900/50 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap text-slate-200">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Demonstration Project – Demo Data Only</span>
          </div>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="text-slate-300 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            Development Milestone: <span className="text-cyan-300 font-medium">Sprint 3 (~50% Functional Build)</span>
          </span>
          <span className="hidden lg:inline text-slate-500">•</span>
          <span className="hidden lg:inline text-slate-400">
            No real patient medical data or live hospital interfaces
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="font-mono text-[11px]">Sprint 4-6 Modules in &quot;Planned/WIP&quot;</span>
          </div>

          {onResetData && (
            <button
              id="reset-demo-data-btn"
              type="button"
              onClick={() => {
                if (window.confirm('Reset all demo patients, appointments, and logs back to initial state?')) {
                  StorageService.resetAllDemoData();
                  onResetData();
                }
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Reset mock state back to fresh demo baseline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
