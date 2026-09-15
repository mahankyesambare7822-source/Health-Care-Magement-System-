import React, { useState } from 'react';
import {
  HeartPulse,
  Calendar,
  UserCheck,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Clock,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Bot,
  Brain,
  Heart,
  Baby,
  Activity,
  Users,
  ShieldPlus,
  Ear,
  Star,
  Award,
  Bell,
  Building2,
} from 'lucide-react';
import { Doctor, Department } from '../types';

interface LandingPageProps {
  departments: Department[];
  doctors: Doctor[];
  onNavigateToLogin: (initialRole?: 'patient' | 'doctor' | 'receptionist' | 'admin') => void;
  onNavigateToRegister: () => void;
  onNavigateToBook: (preselectedDept?: string, preselectedDoctorId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  departments,
  doctors,
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToBook,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);

  const getDeptIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cardiology':
        return Heart;
      case 'neurology':
        return Brain;
      case 'orthopedics':
        return Activity;
      case 'pediatrics':
        return Baby;
      case 'dermatology':
        return ShieldPlus;
      case 'gynecology':
        return Users;
      case 'ent':
        return Ear;
      default:
        return Stethoscope;
    }
  };

  const filteredDoctors = selectedDeptFilter === 'all'
    ? doctors
    : doctors.filter((d) => d.department.toLowerCase() === selectedDeptFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Persistent Academic Prototype Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ACADEMIC PROTOTYPE
            </span>
            <span className="text-slate-300">
              Academic Demonstration Project | Demo Data Only | Not for Real Medical Use
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Hospital ID: APEX-HOSP-2026</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">24/7 Clinical Demo Sandbox</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                Apex Memorial Hospital
              </span>
              <span className="text-[11px] font-medium text-blue-700 tracking-wide block">
                Healthcare Management &amp; Patient Engagement Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#departments" className="hover:text-blue-600 transition-colors">Departments</a>
            <a href="#doctors" className="hover:text-blue-600 transition-colors">Doctors</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#engagement" className="hover:text-blue-600 transition-colors">Patient Engagement</a>
            <a href="#ai-assistant" className="hover:text-blue-600 transition-colors">AI Assistant</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="landing-login-btn"
              type="button"
              onClick={() => onNavigateToLogin('patient')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              id="landing-register-btn"
              type="button"
              onClick={onNavigateToRegister}
              className="px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              Register
            </button>
            <button
              id="landing-book-cta-btn"
              type="button"
              onClick={() => onNavigateToBook()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Generation Healthcare Management System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Smart Healthcare.{' '}
                <span className="text-blue-600 block">Better Patient Experience.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                AI-powered hospital management and patient engagement platform for smarter healthcare administration. Experience seamless patient registration, doctor scheduling, digital consultations, and personalized follow-ups.
              </p>

              {/* Required 3 CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  id="hero-book-btn"
                  type="button"
                  onClick={() => onNavigateToBook()}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book an Appointment</span>
                </button>

                <button
                  id="hero-patient-login-btn"
                  type="button"
                  onClick={() => onNavigateToLogin('patient')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Patient Login</span>
                </button>

                <a
                  href="#doctors"
                  id="hero-explore-doctors-btn"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Stethoscope className="w-4 h-4 text-indigo-600" />
                  <span>Explore Doctors</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-slate-900">8+</div>
                  <div className="text-xs text-slate-500 font-medium">Specialized Departments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Digital Workflow Demo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">4 Roles</div>
                  <div className="text-xs text-slate-500 font-medium">Integrated In One Platform</div>
                </div>
              </div>
            </div>

            {/* Hero Quick Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Live Hospital Status</div>
                      <div className="text-[10px] text-slate-400">Outpatient Triage Active</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Active Sandbox
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Sample Doctor on Duty
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Dr. Rahul Sharma</div>
                        <div className="text-slate-500 text-xs">Cardiologist • 12 Years Exp.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateToBook('Cardiology', 'doc-1')}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900">
                    <div className="flex items-start gap-2">
                      <Bot className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-xs">AI Health Assistant Ready</div>
                        <div className="text-[11px] text-blue-700 mt-0.5">
                          Patients can ask general educational healthcare queries anytime.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                      <div className="text-[11px]">
                        <strong>Academic Project Notice:</strong> Simulated data only. No connection to real hospital records.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Role Switch Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 font-semibold mb-2">
                    Quick Role Access:
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => onNavigateToLogin('patient')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-[10px] font-semibold text-slate-700 hover:text-blue-700 cursor-pointer"
                    >
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToLogin('doctor')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-[10px] font-semibold text-slate-700 hover:text-blue-700 cursor-pointer"
                    >
                      Doctor
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToLogin('receptionist')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-[10px] font-semibold text-slate-700 hover:text-blue-700 cursor-pointer"
                    >
                      Reception
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToLogin('admin')}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-[10px] font-semibold text-slate-700 hover:text-blue-700 cursor-pointer"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Our Departments */}
      <section id="departments" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Clinical Specializations
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Medical Departments
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Dedicated specialty units equipped for compassionate outpatient care and continuous health management.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => {
              const IconComp = getDeptIcon(dept.name);
              return (
                <div
                  key={dept.id}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5">{dept.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{dept.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Head:</span>
                      <span className="font-semibold text-slate-700">{dept.headDoctor}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Available:</span>
                      <span className="text-slate-600">{dept.availableSlotInfo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateToBook(dept.name)}
                      className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Find {dept.name} Doctors</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Available Doctors */}
      <section id="doctors" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                Expert Medical Team
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Available Doctors
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Browse our attending physicians, qualifications, and consultation availability.
              </p>
            </div>

            {/* Department Filter Chips */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedDeptFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  selectedDeptFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Departments
              </button>
              {departments.slice(0, 5).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDeptFilter(d.name)}
                  className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                    selectedDeptFilter.toLowerCase() === d.name.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards Grid */}
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No Doctors Listed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No physician profiles have been registered in this category yet. You can register doctors and manage clinical staff via the Admin Dashboard.
              </p>
              <button
                type="button"
                onClick={() => onNavigateToLogin('Admin')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Staff Management (Admin)
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      {/* Doctor Photo Placeholder */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-sm">
                        {doc.name.split(' ').filter((_, i) => i > 0)[0]?.[0] || 'D'}
                        {doc.name.split(' ').filter((_, i) => i > 0)[1]?.[0] || 'R'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            {doc.department}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{doc.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                          {doc.name}
                        </h3>
                        <div className="text-xs text-slate-500 font-medium">{doc.qualification}</div>
                        <div className="text-xs text-blue-600 font-semibold">{doc.specialization}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 py-3 border-y border-slate-100 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Experience:</span>
                        <span className="font-semibold text-slate-700">{doc.experienceYears} Years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Consultation:</span>
                        <span className="text-slate-700">{doc.consultationType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Clinic Suite:</span>
                        <span className="text-slate-700">{doc.room}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Available Days:</span>
                        <span className="text-slate-700 font-medium">
                          {doc.availableDays.slice(0, 3).join(', ')}
                          {doc.availableDays.length > 3 ? '...' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorForModal(doc)}
                      className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToBook(doc.department, doc.id)}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section: Hospital Services */}
      <section id="services" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Integrated Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Hospital Services &amp; Facilities
            </p>
            <p className="text-sm text-slate-500 mt-2">
              A comprehensive academic demonstration of modern healthcare delivery workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Online Appointment Scheduling
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients can check real-time doctor availability slots, select preferred timings, and instantly receive confirmed appointment IDs without double booking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Doctor Consultation Workspace
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured clinical encounter documentation including symptoms, objective observations, assessment, digital demo prescriptions, and scheduled follow-ups.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Patient Engagement &amp; Reminders
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated preventive care notifications, medication adherence checklists, lifestyle logs, and a 1–5 star patient satisfaction survey system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                Academic Excellence
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Why Choose Our Healthcare Platform Prototype?
              </p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Designed to illustrate state-of-the-art health informatics standards, our prototype unifies clinical triage, administrative coordination, and patient empowerment.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Seamless Multi-Role Architecture</h4>
                    <p className="text-xs text-slate-500">
                      Synchronized real-time state between Patient, Doctor, Receptionist, and Administrator workflows.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Collision-Free Doctor Availability</h4>
                    <p className="text-xs text-slate-500">
                      Intelligent slot booking system prevents conflicting schedules and locks taken appointments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Educational AI Health Assistant</h4>
                    <p className="text-xs text-slate-500">
                      Patient triage assistant providing safe, educational guidance with strict diagnostic disclaimers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                  <Award className="w-3.5 h-3.5" />
                  <span>Capstone Research Project</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Hospital Workflow Demonstration
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Experience the complete medical lifecycle: from patient registration and slot selection to doctor SOAP notes, demo prescription issuance, follow-up alerts, and analytics updates.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigateToLogin('patient')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
                  >
                    Launch Patient Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToLogin('doctor')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  >
                    Launch Doctor Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Patient Engagement */}
      <section id="engagement" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Empowering Patients
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Patient Engagement &amp; Follow-up System
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Proactive reminders and interactive tools designed to improve treatment adherence and clinic satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Automated Notifications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant confirmation notices when an appointment is booked, reminder alerts for upcoming visits, and notification when new prescriptions are issued.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Health &amp; Follow-up Reminders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scheduled reminders for daily blood pressure logging, periodic diabetic lab checks, seasonal vaccines, and follow-up consultation dates.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Patient Feedback &amp; Ratings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Post-consultation feedback rating (1–5 stars) capturing doctor care quality and hospital experience, helping hospital leadership track satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: AI Healthcare Assistant Preview */}
      <section id="ai-assistant" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span>Educational AI Assistant</span>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Intelligent Patient Health Assistant
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Have questions about preparing for your upcoming consultation, healthy lifestyle habits, or common wellness concerns? Our conversational assistant provides verified educational insights.
                </p>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Educational Notice:</strong> This AI assistant provides general educational information and does not diagnose medical conditions or replace a qualified healthcare professional.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToLogin('patient')}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Try AI Assistant in Patient Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-lg border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pb-3 border-b border-slate-800">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Interactive Educational Chat Preview</span>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  <div className="bg-slate-800 p-2.5 rounded-xl text-slate-200 self-end ml-4">
                    “What should I prepare before my Cardiology consultation?”
                  </div>
                  <div className="bg-blue-950/60 border border-blue-800/40 p-3 rounded-xl text-blue-100 leading-relaxed text-[11px]">
                    <p className="font-semibold text-blue-300 mb-1">AI Assistant:</p>
                    Here are 3 helpful tips:
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300">
                      <li>Bring your current medication list &amp; dosages.</li>
                      <li>Write down your resting blood pressure logs.</li>
                      <li>List any questions you want to ask Dr. Rahul Sharma.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Details Modal */}
      {selectedDoctorForModal && (
        <div
          id="doctor-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setSelectedDoctorForModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                  {selectedDoctorForModal.name.split(' ').filter((_, i) => i > 0)[0]?.[0] || 'D'}
                  {selectedDoctorForModal.name.split(' ').filter((_, i) => i > 0)[1]?.[0] || 'R'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedDoctorForModal.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{selectedDoctorForModal.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctorForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedDoctorForModal.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Experience</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedDoctorForModal.experienceYears} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Qualification</span>
                  <span className="font-semibold text-slate-800">{selectedDoctorForModal.qualification}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Rating</span>
                  <span className="font-semibold text-amber-600">
                    ★ {selectedDoctorForModal.rating} ({selectedDoctorForModal.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Specialization Focus:</span>
                <p className="text-slate-600">{selectedDoctorForModal.specialization}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Clinic Suite &amp; Availability:</span>
                <p className="text-slate-600">
                  {selectedDoctorForModal.room} • Available: {selectedDoctorForModal.availability}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedDoctorForModal.availableDays.map((day) => (
                    <span key={day} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedDoctorForModal(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const doc = selectedDoctorForModal;
                  setSelectedDoctorForModal(null);
                  onNavigateToBook(doc.department, doc.id);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                <HeartPulse className="w-5 h-5 text-blue-500" />
                <span>Apex Memorial Hospital</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                An academic prototype demonstrating an AI-powered hospital management and patient engagement system.
              </p>
            </div>

            <div>
              <div className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                Hospital Specialities
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>Cardiology &amp; Vascular Care</li>
                <li>Neurology &amp; Cognitive Health</li>
                <li>Orthopedics &amp; Sports Rehab</li>
                <li>Pediatrics &amp; Child Wellness</li>
                <li>General Internal Medicine</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                System Portals
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button type="button" onClick={() => onNavigateToLogin('patient')} className="hover:text-white cursor-pointer">
                    Patient Portal
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToLogin('doctor')} className="hover:text-white cursor-pointer">
                    Doctor Workspace
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToLogin('receptionist')} className="hover:text-white cursor-pointer">
                    Reception &amp; Triage
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigateToLogin('admin')} className="hover:text-white cursor-pointer">
                    Hospital Administrator
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">
                Emergency &amp; Contact (Demo)
              </div>
              <p className="text-slate-400 mb-2">
                Emergency Helpline: +1 (555) 911-DEMO
              </p>
              <p className="text-slate-400 mb-2">
                Central Desk: +1 (555) 234-APEX
              </p>
              <p className="text-[10px] text-slate-500">
                Hospital Campus: 100 University Medical Center Drive, Boston, MA
              </p>
            </div>
          </div>

          {/* Visible Required Footer Notice */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="text-slate-400 font-semibold">
              “Academic Demonstration Project | Demo Data Only | Not for Real Medical Use”
            </div>
            <div className="text-slate-500 text-[11px]">
              Senior Computer Science Capstone Project • AI in Healthcare Administration
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
