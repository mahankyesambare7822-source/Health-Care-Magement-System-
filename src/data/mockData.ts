import {
  Patient,
  Doctor,
  Department,
  Appointment,
  Prescription,
  DoctorAvailabilityConfig,
  StaffMember,
  QueueItem,
  HealthReminder,
  MedicationSchedule,
  PatientNotification,
  PatientFeedback,
  DoctorClinicalNote,
  FutureModuleInfo,
  User,
} from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-patient-01',
    name: 'Patient Portal',
    role: 'patient',
    email: 'patient@hospital.org',
    department: 'Outpatient Care',
    title: 'Registered Patient',
  },
  {
    id: 'user-doctor-01',
    name: 'Doctor Desk',
    role: 'doctor',
    email: 'doctor@hospital.org',
    department: 'Clinical OPD',
    title: 'Attending Clinician',
  },
  {
    id: 'user-reception-01',
    name: 'Reception Desk',
    role: 'receptionist',
    email: 'reception@hospital.org',
    department: 'Central Triage & Reception',
    title: 'Hospital Receptionist',
  },
  {
    id: 'user-admin-01',
    name: 'Hospital Administrator',
    role: 'admin',
    email: 'admin@hospital.org',
    department: 'Hospital Administration & Informatics',
    title: 'Chief Administrator',
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-cardio',
    name: 'Cardiology',
    description: 'Comprehensive cardiovascular disease management, echocardiography, cardiac stress testing, and preventive heart health.',
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Mon - Fri, 09:00 AM - 04:30 PM',
    iconName: 'Heart',
  },
  {
    id: 'dept-neuro',
    name: 'Neurology',
    description: 'Specialized clinical care for headache syndromes, neurodegenerative conditions, epilepsy, and cognitive disorders.',
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Tue - Fri, 10:00 AM - 05:00 PM',
    iconName: 'Brain',
  },
  {
    id: 'dept-ortho',
    name: 'Orthopedics',
    description: 'Bone and joint care, sports injuries, post-surgical rehabilitation, joint preservation, and arthritis management.',
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Wed - Sat, 08:30 AM - 02:00 PM',
    iconName: 'Activity',
  },
  {
    id: 'dept-derma',
    name: 'Dermatology',
    description: 'Medical and cosmetic dermatology, chronic eczema, psoriasis therapy, skin cancer screenings, and allergy testing.',
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Mon - Thu, 09:30 AM - 03:30 PM',
    iconName: 'ShieldPlus',
  },
  {
    id: 'dept-genmed',
    name: 'General Medicine',
    description: 'Primary care, adult preventive health assessments, chronic hypertension, diabetes control, and annual checkups.',
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Mon - Fri, 08:30 AM - 04:00 PM',
    iconName: 'Stethoscope',
  },
  {
    id: 'dept-pedia',
    name: 'Pediatrics',
    description: 'Infant, child, and adolescent care, developmental milestones, pediatric vaccinations, and childhood wellness.',
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Mon - Wed, 09:00 AM - 02:00 PM',
    iconName: 'Baby',
  },
  {
    id: 'dept-gyne',
    name: 'Gynecology',
    description: "Women's reproductive health, prenatal wellness, hormonal health, annual wellness exams, and maternal guidance.",
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Tue - Fri, 09:00 AM - 03:00 PM',
    iconName: 'Users',
  },
  {
    id: 'dept-ent',
    name: 'ENT',
    description: 'Ear, nose, and throat diagnostics, sinusitis treatment, hearing screenings, allergy management, and vocal health.',
    headDoctor: 'To be assigned',
    doctorCount: 0,
    availableSlotInfo: 'Mon - Thu, 10:00 AM - 04:00 PM',
    iconName: 'Ear',
  },
];

// Completely clean starting state - no pre-populated doctors or patients
export const INITIAL_DOCTORS: Doctor[] = [];

export const INITIAL_PATIENTS: Patient[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [];

export const INITIAL_DOCTOR_AVAILABILITY: DoctorAvailabilityConfig[] = [];

export const INITIAL_STAFF: StaffMember[] = [];

export const INITIAL_QUEUE: QueueItem[] = [];

export const INITIAL_HEALTH_REMINDERS: HealthReminder[] = [];

export const INITIAL_MEDICATIONS: MedicationSchedule[] = [];

export const INITIAL_NOTIFICATIONS: PatientNotification[] = [];

export const INITIAL_FEEDBACK: PatientFeedback[] = [];

export const INITIAL_CLINICAL_NOTES: DoctorClinicalNote[] = [];

export const FUTURE_MODULES: FutureModuleInfo[] = [
  {
    id: 'mod-fhir-hl7',
    title: 'FHIR / HL7 EHR Integration',
    status: 'Planned',
    completionPercent: 30,
    plannedPhase: 'Phase 2 (Milestone 4)',
    leadResearcher: 'Clinical Informatics & Interoperability Lab',
    description:
      'Bidirectional Health Level 7 (HL7) v2.x and Fast Healthcare Interoperability Resources (FHIR R4) RESTful API integration for institutional electronic medical records synchronization with hospital PACS/EMR systems.',
    technicalPrerequisites: [
      'FHIR R4 JSON Schema validation parser',
      'SMART on FHIR OAuth 2.0 institutional gateway token exchange',
      'TLS 1.3 mutual authentication endpoint with hospital data warehouse',
      'HIPAA Business Associate Agreement (BAA) infrastructure',
    ],
    architectureOverview:
      'Local Clinical Cache <-> FHIR Client Service <-> Institutional Interface Engine (Mirth Connect / AWS HealthLake) <-> Hospital Central EHR (Epic/Cerner).',
    mockPayloadExample: JSON.stringify(
      {
        resourceType: 'Patient',
        id: 'example-fhir-patient-001',
        meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Patient'] },
        identifier: [{ system: 'urn:oid:1.2.3.4.5.6', value: 'PT-2026-101' }],
        active: true,
      },
      null,
      2
    ),
    riskAssessment:
      'Under architectural design. Target implementation relies on public SMART sandbox testbeds.',
  },
  {
    id: 'mod-sms-whatsapp',
    title: 'WhatsApp / SMS Gateway',
    status: 'Future Enhancement',
    completionPercent: 15,
    plannedPhase: 'Phase 3 (Post-Capstone Expansion)',
    leadResearcher: 'Telehealth & Mobile Outreach Team',
    description:
      'Automated multi-channel broadcast engine for appointment confirmations, two-way conversational SMS reminders, and WhatsApp template messaging with patient opt-in management.',
    technicalPrerequisites: [
      'Twilio Programmable Messaging API or Meta WhatsApp Business Cloud API account',
      'TCPA compliance and automated STOP/HELP unsubscribe keyword handler',
      'Webhook listener for delivery receipts (DLR) and reply routing',
    ],
    architectureOverview:
      'Appointment Engine -> Scheduled Job Trigger -> Twilio/Meta Cloud Gateway -> Mobile Carrier Network -> Patient Device.',
    mockPayloadExample: JSON.stringify(
      {
        channel: 'WhatsApp-Business-Cloud-API',
        template_name: 'clinic_appointment_reminder_v1',
        language: 'en_US',
        parameters: {
          patient_name: 'Patient',
          appointment_date: 'Sept 20, 2026',
          appointment_time: '10:30 AM',
        },
      },
      null,
      2
    ),
    riskAssessment:
      'Requires real SMS credits and strict patient privacy opt-in mechanisms. Kept strictly simulated.',
  },
  {
    id: 'mod-iot-wearables',
    title: 'IoT / Wearable Integration',
    status: 'Future Enhancement',
    completionPercent: 10,
    plannedPhase: 'Phase 3 (Post-Capstone Expansion)',
    leadResearcher: 'Wearable Biosensors Lab',
    description:
      'Bluetooth Low Energy (BLE) and Cloud Health API (Apple HealthKit, Google Health Connect, Fitbit Web API) continuous passive telemetry ingestion for continuous heart rate and daily steps.',
    technicalPrerequisites: [
      'Web Bluetooth API browser capabilities or native mobile bridge',
      'Time-series data compression and anomaly detection filters',
      'Battery-efficient background ingestion microservice',
    ],
    architectureOverview:
      'Wearable Sensor (Smartwatch / Blood Pressure Cuff) -> BLE Beacon / HealthKit Sync -> REST Telemetry Ingestion -> Real-time Vitals Charting.',
    mockPayloadExample: JSON.stringify(
      {
        device_id: 'BLE-VITALS-HR-8812',
        device_model: 'PulseOx-Continuous-Pro-Demo',
        sampling_frequency_hz: 1,
        packet: {
          timestamp_utc: '2026-09-14T21:30:00Z',
          heart_rate_bpm: 72,
          spo2_percent: 98,
          battery_percent: 84,
        },
      },
      null,
      2
    ),
    riskAssessment:
      'Hardware dependency required. Academic simulation currently uses static vitals fixtures.',
  },
  {
    id: 'mod-payments',
    title: 'Online Payment Gateway',
    status: 'Future Enhancement',
    completionPercent: 15,
    plannedPhase: 'Phase 3 (Post-Capstone Expansion)',
    leadResearcher: 'Healthcare Economics & Operations Group',
    description:
      'PCI-DSS compliant patient copay and self-pay invoice settlement engine with digital receipt generation, insurance claims ledger integration, and payment plan scheduling.',
    technicalPrerequisites: [
      'Stripe Elements or Razorpay Healthcare Checkout integration',
      'Encrypted ledger for patient co-pays and insurance deductibles',
      'Automated PDF invoice generation and reconciliation audit trail',
    ],
    architectureOverview:
      'Billing Engine -> Invoice Creation -> Secure Payment Modal -> Payment Gateway Webhook -> Patient Ledger Reconciliation.',
    mockPayloadExample: JSON.stringify(
      {
        invoice_id: 'INV-2026-4401',
        patient_id: 'PT-2026-101',
        service: 'Specialist Consultation Co-pay',
        amount_usd: 35.0,
        payment_status: 'Pending_Card_Capture',
        payment_processor: 'Stripe Sandbox (Mock)',
      },
      null,
      2
    ),
    riskAssessment:
      'Requires merchant accounts and financial compliance audit. Strictly simulated for academic demonstration.',
  },
  {
    id: 'mod-telemedicine',
    title: 'Real Telemedicine Video Consultation',
    status: 'Future Enhancement',
    completionPercent: 20,
    plannedPhase: 'Phase 3 (Post-Capstone Expansion)',
    leadResearcher: 'Telehealth Systems Working Group',
    description:
      'WebRTC-based encrypted point-to-point peer video consultation platform with screen sharing, digital whiteboard, and waiting room queue management.',
    technicalPrerequisites: [
      'WebRTC media stream server (LiveKit or Agora Web SDK)',
      'STUN/TURN NAT traversal infrastructure',
      'End-to-end encrypted in-session clinical chat',
    ],
    architectureOverview:
      'Doctor & Patient Browser -> Signaling Server -> WebRTC P2P Video Mesh -> Live Telehealth Consultation Interface.',
    mockPayloadExample: JSON.stringify(
      {
        room_name: 'telehealth-room-apt-2026-00125',
        status: 'room_ready',
        webrtc_ice_servers: ['stun:stun.l.google.com:19302'],
      },
      null,
      2
    ),
    riskAssessment:
      'Demands dedicated WebRTC media bandwidth and HIPAA BAA compliance.',
  },
];
