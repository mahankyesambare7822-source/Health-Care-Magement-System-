import React, { useState } from 'react';
import {
  HeartPulse,
  GraduationCap,
  Shield,
  Stethoscope,
  User,
  ArrowRight,
  Layers,
  KeyRound,
  Mail,
  Building,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface LoginViewProps {
  initialRole?: UserRole;
  onLogin: (user: UserType) => void;
  onNavigateToRegister: () => void;
  onNavigateToLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  initialRole = 'patient',
  onLogin,
  onNavigateToRegister,
  onNavigateToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);

  // Form input states
  const [identifier, setIdentifier] = useState('eleanor.vc@example-domain.org');
  const [password, setPassword] = useState('demo-patient-123');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle switching tabs
  const handleTabSwitch = (role: UserRole) => {
    setActiveTab(role);
    setErrorMsg('');
    if (role === 'patient') {
      setIdentifier('eleanor.vc@example-domain.org');
      setPassword('demo-patient-123');
    } else if (role === 'doctor') {
      setIdentifier('DOC-CAR-01');
      setPassword('demo-doctor-123');
    } else if (role === 'receptionist') {
      setIdentifier('REC-EMP-03');
      setPassword('demo-receptionist-123');
    } else if (role === 'admin') {
      setIdentifier('ADM-2026-01');
      setPassword('demo-admin-123');
    }
  };

  const handleQuickFill = (role: UserRole) => {
    handleTabSwitch(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter your credentials to log in.');
      return;
    }

    // Find demo user matching active role
    const matchedUser = DEMO_USERS.find((u) => u.role === activeTab) || DEMO_USERS[0];
    onLogin(matchedUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-100 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Academic Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800 text-xs text-slate-400">
        <button
          type="button"
          onClick={onNavigateToLanding}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hospital Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Academic Project Prototype •</span>
          <span className="text-cyan-400 font-mono">Demo Data Only</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Apex Memorial Hospital
              </h1>
              <p className="text-xs text-slate-400">
                Healthcare Management &amp; Patient Engagement System
              </p>
            </div>
          </div>

          {/* Academic Demo Disclaimer Badge */}
          <div className="mb-5 p-3 rounded-lg bg-blue-950/70 border border-blue-500/30 text-xs text-blue-200">
            <div className="flex items-center gap-1.5 font-semibold text-blue-300 mb-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Academic Demonstration System</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Select your role below. Pre-filled demo credentials are provided for convenient evaluation of hospital workflows.
            </p>
          </div>

          {/* 4 Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-700">
              <button
                type="button"
                id="role-tab-patient"
                onClick={() => handleTabSwitch('patient')}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  activeTab === 'patient'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                id="role-tab-doctor"
                onClick={() => handleTabSwitch('doctor')}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  activeTab === 'doctor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                id="role-tab-receptionist"
                onClick={() => handleTabSwitch('receptionist')}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  activeTab === 'receptionist'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Reception</span>
              </button>

              <button
                type="button"
                id="role-tab-admin"
                onClick={() => handleTabSwitch('admin')}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {activeTab === 'patient' && 'Email or Patient ID'}
                {activeTab === 'doctor' && 'Doctor ID'}
                {activeTab === 'receptionist' && 'Employee ID'}
                {activeTab === 'admin' && 'Administrator ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-identifier-input"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder={
                    activeTab === 'patient'
                      ? 'e.g. eleanor.vc@example-domain.org or PT-2026-101'
                      : activeTab === 'doctor'
                      ? 'e.g. DOC-CAR-01'
                      : activeTab === 'receptionist'
                      ? 'e.g. REC-EMP-03'
                      : 'e.g. ADM-2026-01'
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Fill Helper */}
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Demo: <strong className="text-slate-200">{identifier}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleQuickFill(activeTab)}
                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Reset Demo Fill
              </button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer mt-2"
            >
              <span>Log in as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* New Patient Registration Prompt */}
          {activeTab === 'patient' && (
            <div className="mt-6 pt-5 border-t border-slate-700/80 text-center">
              <p className="text-xs text-slate-400 mb-2">
                New patient at Apex Memorial?
              </p>
              <button
                type="button"
                id="login-register-redirect-btn"
                onClick={onNavigateToRegister}
                className="w-full py-2.5 rounded-xl border border-blue-500/40 hover:border-blue-400 bg-blue-950/30 text-blue-300 hover:text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Create a Patient Account (Registration)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 py-2 border-t border-slate-800/80">
        “Academic Demonstration Project | Demo Data Only | Not for Real Medical Use”
      </div>
    </div>
  );
};
