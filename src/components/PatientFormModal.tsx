import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Patient, Doctor } from '../types';
import { StorageService } from '../services/storageService';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: Omit<Patient, 'id' | 'patientId'>, existingId?: string) => void;
  patientToEdit?: Patient | null;
  doctors?: Doctor[];
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientToEdit,
  doctors: propDoctors,
}) => {
  const availableDoctors = propDoctors || StorageService.getDoctors();

  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    dob: '1991-05-15',
    bloodGroup: 'O+',
    phone: '+1 (555) 000-0000',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactRelation: 'Family Member',
    emergencyContactPhone: '+1 (555) 000-0001',
    insuranceId: 'INS-DEMO-991',
    insuranceProvider: 'Blue Cross Blue Shield (Demo)',
    status: 'Active' as 'Active' | 'Discharged' | 'Outpatient',
    assignedDoctorId: availableDoctors[0]?.id || '',
    allergies: 'None',
    chronicConditions: 'None',
    bloodPressure: '120/80 mmHg',
    heartRate: 72,
    temperature: '98.6 °F',
    spO2: 98,
    weightKg: 65,
    bmi: 22.5,
    recentNotes: 'Routine intake examination.',
  });

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name,
        age: patientToEdit.age,
        gender: patientToEdit.gender,
        dob: patientToEdit.dob,
        bloodGroup: patientToEdit.bloodGroup,
        phone: patientToEdit.phone,
        email: patientToEdit.email,
        address: patientToEdit.address,
        emergencyContactName: patientToEdit.emergencyContact.name,
        emergencyContactRelation: patientToEdit.emergencyContact.relation,
        emergencyContactPhone: patientToEdit.emergencyContact.phone,
        insuranceId: patientToEdit.insuranceId,
        insuranceProvider: patientToEdit.insuranceProvider,
        status: patientToEdit.status,
        assignedDoctorId: patientToEdit.assignedDoctorId,
        allergies: patientToEdit.allergies.join(', '),
        chronicConditions: patientToEdit.chronicConditions.join(', '),
        bloodPressure: patientToEdit.vitals.bloodPressure,
        heartRate: patientToEdit.vitals.heartRate,
        temperature: patientToEdit.vitals.temperature,
        spO2: patientToEdit.vitals.spO2,
        weightKg: patientToEdit.vitals.weightKg,
        bmi: patientToEdit.vitals.bmi,
        recentNotes: patientToEdit.recentNotes,
      });
    } else {
      setFormData({
        name: '',
        age: 32,
        gender: 'Female',
        dob: '1994-06-20',
        bloodGroup: 'O+',
        phone: '',
        email: '',
        address: '',
        emergencyContactName: '',
        emergencyContactRelation: 'Family Member',
        emergencyContactPhone: '',
        insuranceId: '',
        insuranceProvider: '',
        status: 'Active',
        assignedDoctorId: availableDoctors[0]?.id || '',
        allergies: 'None',
        chronicConditions: 'None',
        bloodPressure: '120/80 mmHg',
        heartRate: 72,
        temperature: '98.6 °F',
        spO2: 98,
        weightKg: 65,
        bmi: 22.5,
        recentNotes: 'Initial clinic registration.',
      });
    }
  }, [patientToEdit, isOpen, availableDoctors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter patient name.');
      return;
    }

    const assignedDoc = availableDoctors.find((d) => d.id === formData.assignedDoctorId);

    const payload: Omit<Patient, 'id' | 'patientId'> = {
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      dob: formData.dob,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      emergencyContact: {
        name: formData.emergencyContactName.trim(),
        relation: formData.emergencyContactRelation.trim(),
        phone: formData.emergencyContactPhone.trim(),
      },
      insuranceId: formData.insuranceId.trim(),
      insuranceProvider: formData.insuranceProvider.trim(),
      status: formData.status,
      assignedDoctorId: formData.assignedDoctorId,
      assignedDoctorName: assignedDoc ? assignedDoc.name : 'Unassigned',
      admissionDate: new Date().toISOString().split('T')[0],
      vitals: {
        bloodPressure: formData.bloodPressure,
        heartRate: Number(formData.heartRate),
        temperature: formData.temperature,
        spO2: Number(formData.spO2),
        weightKg: Number(formData.weightKg),
        bmi: Number(formData.bmi),
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
      allergies: formData.allergies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      chronicConditions: formData.chronicConditions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      recentNotes: formData.recentNotes.trim(),
    };

    onSave(payload, patientToEdit?.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patientToEdit ? 'Edit Patient Information' : 'Register New Demo Patient'}
      subtitle="Academic demo form with local state persistence (No real medical data)"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Demographics */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Demographics & Identification
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jordan Matthews"
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Active' | 'Discharged' | 'Outpatient',
                  })
                }
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden bg-white"
              >
                <option value="Active">Active</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as 'Male' | 'Female' | 'Other',
                  })
                }
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Contact & Emergency */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            2. Contact & Emergency Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactName: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                value={formData.emergencyContactRelation}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactRelation: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Emergency Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactPhone: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Clinical Assignment & Vitals */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            3. Clinical Assignment & Initial Vitals
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Assigned Attending Doctor
              </label>
              <select
                value={formData.assignedDoctorId}
                onChange={(e) => setFormData({ ...formData, assignedDoctorId: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden bg-white"
              >
                <option value="">-- Unassigned / No Doctor --</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.department})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Insurance Provider (Demo)
              </label>
              <input
                type="text"
                value={formData.insuranceProvider}
                onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Blood Pressure</label>
              <input
                type="text"
                placeholder="120/80 mmHg"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Heart Rate (bpm)</label>
              <input
                type="number"
                value={formData.heartRate}
                onChange={(e) =>
                  setFormData({ ...formData, heartRate: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">SpO2 (%)</label>
              <input
                type="number"
                value={formData.spO2}
                onChange={(e) => setFormData({ ...formData, spO2: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={formData.weightKg}
                onChange={(e) =>
                  setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Known Allergies (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Latex"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Chronic Conditions (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Asthma"
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-patient-submit-btn"
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {patientToEdit ? 'Update Patient Record' : 'Save & Register Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
