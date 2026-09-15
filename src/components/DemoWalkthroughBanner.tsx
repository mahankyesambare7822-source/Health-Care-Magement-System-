import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface DemoWalkthroughBannerProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
}

export const DEMO_STEPS = [
  { id: 'dashboard', label: '1. Dashboard', view: 'dashboard', desc: 'Review key metrics & demo label' },
  { id: 'patients', label: '2. Patient Management', view: 'patients', desc: 'Search & filter patients list' },
  { id: 'patient-profile', label: '3. View Profile', view: 'patients', desc: 'Click patient row to inspect vitals & history' },
  { id: 'book-apt', label: '4. Book Appointment', view: 'appointments', desc: 'Open booking modal & schedule visit' },
  { id: 'apt-list', label: '5. Appointment List', view: 'appointments', desc: 'Verify new appointment appears & toggle status' },
  { id: 'engagement', label: '6. Patient Engagement', view: 'engagement', desc: 'Test reminders, medication UI & feedback' },
  { id: 'ai-assistant', label: '7. AI Assistant Demo', view: 'ai-assistant', desc: 'Ask educational health questions' },
  { id: 'doctor', label: '8. Doctor Section', view: 'doctor', desc: 'Review clinical view & doctor notes' },
  { id: 'analytics', label: '9. Analytics', view: 'analytics', desc: 'Inspect appointment & engagement charts' },
  { id: 'incomplete', label: '10. Future Modules', view: 'incomplete-ai-predictive', desc: 'View 50% milestone roadmap placeholders' },
];

export const DemoWalkthroughBanner: React.FC<DemoWalkthroughBannerProps> = ({
  currentView,
  onNavigate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id="demo-flow-tracker"
      className="bg-indigo-50/90 border-b border-indigo-100 text-indigo-950 px-4 py-2 transition-all"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="p-1 rounded bg-indigo-200/80 text-indigo-800">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <span className="font-semibold text-indigo-900">Capstone Evaluation Walkthrough:</span>
            <span className="hidden sm:inline text-indigo-700">
              Follow the end-to-end 50% development demonstration workflow
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-walkthrough-btn"
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 py-0.5 px-2 rounded hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Workflow Steps' : 'Show Full 10-Step Workflow'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-indigo-200/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
            {DEMO_STEPS.map((step, idx) => {
              const isActive = currentView === step.view;
              return (
                <button
                  key={step.id}
                  id={`walkthrough-step-${idx + 1}`}
                  type="button"
                  onClick={() => onNavigate(step.view)}
                  className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-white border-indigo-400 shadow-xs font-semibold text-indigo-900 ring-1 ring-indigo-300'
                      : 'bg-white/60 hover:bg-white border-indigo-200/60 text-slate-700 hover:text-indigo-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-indigo-600">{step.label}</span>
                    {isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{step.desc}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
