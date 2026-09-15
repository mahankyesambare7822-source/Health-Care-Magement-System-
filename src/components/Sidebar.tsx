import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  HeartHandshake,
  Bot,
  Stethoscope,
  BarChart3,
  BrainCircuit,
  Activity,
  Network,
  Database,
  MessageSquare,
  Watch,
  CreditCard,
  Layers,
  GraduationCap,
  CalendarCheck,
  FileText,
  Clock,
  Star,
  UserCheck,
  Building2,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  currentUserRole: UserRole;
  onNavigate: (viewId: string) => void;
  onNavigateToLanding: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  currentUserRole,
  onNavigate,
  onNavigateToLanding,
  isOpenMobile,
  onCloseMobile,
}) => {
  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  // Build role-specific menu items
  const getRoleMenuItems = () => {
    switch (currentUserRole) {
      case 'patient':
        return [
          { id: 'patient-dashboard', label: 'My Dashboard', icon: LayoutDashboard, badge: 'Overview' },
          { id: 'book-appointment', label: 'Book Appointment', icon: CalendarDays, badge: '7-Step' },
          { id: 'my-appointments', label: 'My Appointments', icon: CalendarCheck, badge: 'Live' },
          { id: 'my-prescriptions', label: 'Digital Prescriptions', icon: FileText, badge: 'Rx Slip' },
          { id: 'my-medical-records', label: 'Medical Records (EHR)', icon: Activity, badge: 'EHR' },
          { id: 'health-reminders', label: 'Reminders & Tasks', icon: Clock, badge: 'Alerts' },
          { id: 'ai-assistant', label: 'AI Health Assistant', icon: Bot, badge: 'Gemini' },
          { id: 'feedback', label: 'Give Feedback', icon: Star, badge: 'Reviews' },
        ];
      case 'doctor':
        return [
          { id: 'doctor-dashboard', label: 'Clinician Desk', icon: Stethoscope, badge: 'Clinic' },
          { id: 'patients', label: 'Assigned Patients', icon: Users, badge: 'Panel' },
          { id: 'appointments', label: 'All Appointments', icon: CalendarDays, badge: 'Hospital' },
          { id: 'analytics', label: 'Clinical Analytics', icon: BarChart3, badge: 'Metrics' },
          { id: 'ai-assistant', label: 'Diagnostic AI Copilot', icon: Bot, badge: 'Demo' },
        ];
      case 'receptionist':
        return [
          { id: 'receptionist-dashboard', label: 'OPD Queue Board', icon: LayoutDashboard, badge: 'Live Queue' },
          { id: 'appointments', label: 'Schedule & Appointments', icon: CalendarDays, badge: 'OPD' },
          { id: 'patients', label: 'Patient Directory', icon: Users, badge: 'Registration' },
          { id: 'analytics', label: 'Daily Flow Stats', icon: BarChart3, badge: 'Tokens' },
        ];
      case 'admin':
      default:
        return [
          { id: 'admin-dashboard', label: 'Executive Overview', icon: Building2, badge: 'Admin' },
          { id: 'patients', label: 'Patient Management', icon: Users, badge: 'EHR' },
          { id: 'appointments', label: 'Hospital Appointments', icon: CalendarDays, badge: 'All' },
          { id: 'engagement', label: 'Engagement & Alerts', icon: HeartHandshake, badge: 'Tasks' },
          { id: 'doctor-dashboard', label: 'Doctor Suite Demo', icon: Stethoscope, badge: 'OPD' },
          { id: 'receptionist-dashboard', label: 'Receptionist Queue', icon: Clock, badge: 'Counter' },
          { id: 'analytics', label: 'Hospital Analytics', icon: BarChart3, badge: 'BI' },
          { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Gemini' },
        ];
    }
  };

  const roleMenuItems = getRoleMenuItems();

  const incompleteModules = [
    {
      id: 'incomplete-ai-predictive',
      label: 'AI Predictive Analytics',
      icon: BrainCircuit,
      status: 'Coming Soon',
    },
    {
      id: 'incomplete-disease-risk',
      label: 'Disease Risk Prediction',
      icon: Activity,
      status: 'Under Dev',
    },
    {
      id: 'incomplete-hospital-integration',
      label: 'HL7 Hospital Protocol',
      icon: Network,
      status: 'Planned',
    },
    {
      id: 'incomplete-ehr-integration',
      label: 'FHIR EHR Cloud Sync',
      icon: Database,
      status: 'Planned',
    },
    {
      id: 'incomplete-sms-whatsapp',
      label: 'WhatsApp / SMS Gateway',
      icon: MessageSquare,
      status: 'Phase 2',
    },
    {
      id: 'incomplete-iot-wearables',
      label: 'IoT Wearable Vitals',
      icon: Watch,
      status: 'Phase 2',
    },
    {
      id: 'incomplete-payments',
      label: 'Payment Gateway (OPD)',
      icon: CreditCard,
      status: 'Phase 2',
    },
  ];

  const content = (
    <aside className="w-64 h-full flex flex-col bg-white border-r border-slate-200 text-slate-700 select-none">
      {/* Role Pill & Project Progress */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                currentUserRole === 'patient'
                  ? 'bg-blue-600'
                  : currentUserRole === 'doctor'
                  ? 'bg-emerald-600'
                  : currentUserRole === 'receptionist'
                  ? 'bg-amber-600'
                  : 'bg-purple-600'
              }`}
            />
            {currentUserRole} Portal
          </span>
          <span className="font-bold text-blue-700 font-mono text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            50% Prototype
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: '50%' }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">
          Academic Software Engineering Capstone
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
        {/* Role Menu Items */}
        <div>
          <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation Menu
          </h3>
          <nav className="space-y-1">
            {roleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Phase 2 / Coming Soon Showcase */}
        <div>
          <div className="px-3 flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Phase 2 (Roadmap)</span>
            </h3>
            <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1 rounded border border-amber-200">
              Sprint 4
            </span>
          </div>

          <nav className="space-y-0.5">
            {incompleteModules.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-[11px]">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-700 bg-amber-50/80 px-1 py-0.5 rounded">
                    {item.status}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Return to Hospital Homepage CTA */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <button
          type="button"
          onClick={onNavigateToLanding}
          className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-blue-600" />
          <span>Hospital Main Page</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-20">
        {content}
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-64 bg-white shadow-2xl relative">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
