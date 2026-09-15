import React, { useState } from 'react';
import {
  HeartPulse,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Patient, User as UserType } from '../types';

interface PatientRegistrationPageProps {
  onRegistrationSuccess: (patient: Patient, user: UserType) => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

export const PatientRegistrationPage: React.FC<PatientRegistrationPageProps> = ({
  onRegistrationSuccess,
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+' as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
    emergencyName: '',
    emergencyRelation: 'Spouse',
    emergencyPhone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError('Please provide your name, phone number, and email.');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Calculate age from DOB if present
    let age = 30;
    if (formData.dob) {
      const birthYear = new Date(formData.dob).getFullYear();
      const currYear = new Date().getFullYear();
      if (!isNaN(birthYear) && birthYear < currYear) {
        age = currYear - birthYear;
      }
    }

    // Create and save patient
    const newPatient = StorageService.addPatient({
      name: formData.fullName,
      age: age,
      gender: formData.gender,
      dob: formData.dob || '1995-01-01',
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      email: formData.email,
      address: formData.address || 'Standard Outpatient Residence',
      emergencyContact: {
        name: formData.emergencyName || 'Family Member',
        relation: formData.emergencyRelation || 'Next of Kin',
        phone: formData.emergencyPhone || formData.phone,
      },
      insuranceProvider: 'Self-Pay / Academic Demo Coverage',
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0],
      vitals: {
        bloodPressure: '120/80 mmHg',
        heartRate: 72,
        temperature: '98.6 °F',
        spO2: 99,
        weightKg: 65,
        bmi: 22.5,
        lastUpdated: new Date().toISOString().split('T')[0] + ' 10:00',
      },
      allergies: ['None declared on registration'],
      chronicConditions: [],
      recentNotes: 'Patient self-registered via academic outpatient portal.',
    });

    // Create user persona object for session
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      name: newPatient.name,
      role: 'patient',
      email: newPatient.email,
      department: 'Outpatient Care',
      title: 'Registered Patient',
      patientProfileId: newPatient.id,
    };

    setRegisteredPatient(newPatient);
  };

  const handleProceedToDashboard = () => {
    if (!registeredPatient) return;
    const user: UserType = {
      id: `user-${Date.now()}`,
      name: registeredPatient.name,
      role: 'patient',
      email: registeredPatient.email,
      department: 'Outpatient Care',
      title: 'Registered Patient',
      patientProfileId: registeredPatient.id,
    };
    StorageService.setCurrentUser(user);
    onRegistrationSuccess(registeredPatient, user);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800 text-xs text-slate-400">
        <button
          type="button"
          onClick={onNavigateToLanding}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hospital Homepage</span>
        </button>
        <span className="text-slate-400">
          Academic Demonstration Project | Demo Data Only | Not for Real Medical Use
        </span>
      </div>

      {/* Success Modal Screen if Registered */}
      {registeredPatient ? (
        <div className="max-w-md mx-auto w-full my-auto py-12">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Registration Successful!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your hospital record has been initialized with simulated clinical EHR parameters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Patient ID:</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {registeredPatient.patientId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Full Name:</span>
                <span className="font-semibold text-white">{registeredPatient.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Email:</span>
                <span className="text-slate-300">{registeredPatient.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-semibold text-rose-400">{registeredPatient.bloodGroup}</span>
              </div>
            </div>

            <button
              type="button"
              id="registration-proceed-btn"
              onClick={handleProceedToDashboard}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Go to Patient Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto w-full my-6">
          <div className="bg-slate-800/95 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Patient Registration
                </h1>
                <p className="text-xs text-slate-400">
                  Create your Apex Memorial Hospital demo outpatient account
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500 text-red-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Maria Gonzalez"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="maria.g@example.org"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street, City, State"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-3">
                <span className="font-semibold text-slate-300 block">
                  Emergency Contact Details
                </span>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyName"
                      placeholder="e.g. Carlos Gonzalez"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Relationship</label>
                    <input
                      type="text"
                      name="emergencyRelation"
                      placeholder="e.g. Spouse / Sibling"
                      value={formData.emergencyRelation}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      placeholder="+1 (555) 999-9999"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Account Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-registration-btn"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Register Patient Account</span>
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <span className="text-slate-400 text-xs">Already have an account? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-blue-400 hover:text-blue-300 font-semibold text-xs cursor-pointer"
              >
                Log In Here
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 py-2 border-t border-slate-800">
        “Academic Demonstration Project | Demo Data Only | Not for Real Medical Use”
      </div>
    </div>
  );
};
