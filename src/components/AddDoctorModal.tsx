import React, { useState } from 'react';
import { Modal } from './Modal';
import { Doctor, Department } from '../types';
import { Stethoscope, User, GraduationCap, Building2, MapPin, Clock, Calendar, Mail, Phone, Plus } from 'lucide-react';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onSaveDoctor: (doctorData: Omit<Doctor, 'id'>) => Doctor;
  defaultDepartment?: string;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  departments,
  onSaveDoctor,
  defaultDepartment,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Attending Physician');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [department, setDepartment] = useState(defaultDepartment || (departments[0]?.name || 'General Medicine'));
  const [specialization, setSpecialization] = useState('');
  const [experienceYears, setExperienceYears] = useState(8);
  const [room, setRoom] = useState('OPD Clinic 101');
  const [availability, setAvailability] = useState('09:00 AM - 04:00 PM');
  const [availableDays, setAvailableDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [consultationType, setConsultationType] = useState('In-person');

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length > 1) {
        setAvailableDays(availableDays.filter((d) => d !== day));
      }
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let formattedName = name.trim();
    if (!formattedName.toLowerCase().startsWith('dr.') && !formattedName.toLowerCase().startsWith('dr ')) {
      formattedName = `Dr. ${formattedName}`;
    }

    const newDoc = onSaveDoctor({
      name: formattedName,
      title: title.trim() || 'Attending Physician',
      qualification: qualification.trim() || 'MBBS, MD',
      department: department || 'General Medicine',
      specialization: specialization.trim() || `${department} Specialist`,
      experienceYears: Number(experienceYears) || 5,
      email: email.trim() || `${formattedName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@hospital.org`,
      phone: phone.trim() || '+1 (555) 000-0000',
      room: room.trim() || 'Room 101',
      availability: availability.trim() || '09:00 AM - 04:00 PM',
      availableDays: availableDays.length > 0 ? availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      consultationType: consultationType || 'In-person',
      rating: 5.0,
      reviewCount: 0,
    });

    // Reset and close
    setName('');
    setSpecialization('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Doctor to Hospital"
      subtitle="Register a new attending physician or consultant to the clinical roster"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
        <div className="grid sm:grid-cols-2 gap-3">
          {/* Doctor Name */}
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-800 mb-1">
              Doctor Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="add-doc-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins or Dr. Alex Mercer"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Department Specialty <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="add-doc-dept-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Sub-Specialization
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Preventive Cardiology & Echocardiography"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Clinical Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Consultant / Attending Physician"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Qualifications &amp; Degrees
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. MBBS, MD, FACC"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Experience Years */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="60"
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
            />
          </div>

          {/* Clinic / Room Number */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Clinic Room / Suite
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Suite 304 / Floor 2"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Available Hours */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Daily Available Hours
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. 09:00 AM - 04:00 PM"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Consultation Mode */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Consultation Mode</label>
            <select
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden cursor-pointer"
            >
              <option value="In-person">In-person only</option>
              <option value="In-person & Tele-Demo">In-person &amp; Tele-Demo</option>
              <option value="Tele-Consultation">Tele-Consultation only</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor.name@hospital.org"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Desk Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Available Days */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1.5">
            Available Clinic Days
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_DAYS.map((day) => {
              const active = availableDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="add-doc-submit-btn"
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Doctor</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
