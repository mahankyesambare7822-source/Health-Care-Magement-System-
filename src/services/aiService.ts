export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  educationalTopic?: string;
  suggestedFollowUps?: string[];
}

export const SAMPLE_PROMPTS = [
  'What is the difference between systolic and diastolic blood pressure?',
  'What lifestyle strategies help manage borderline high cholesterol?',
  'How does chronic stress affect the cardiovascular system?',
  'What does an elevated HbA1c test indicate in simple terms?',
  'What are standard non-pharmacological methods for migraine management?',
  'Explain the concept of hydration and electrolyte balance.',
];

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'cannot breathe',
  'cant breathe',
  'shortness of breath',
  'severe bleeding',
  'stroke',
  'unconscious',
  'suicide',
  'anaphylaxis',
  'severe allergic',
  'overdose',
  'sudden numbness',
];

export const AIService = {
  async askQuestion(question: string): Promise<AIChatMessage> {
    // Artificial delay to simulate academic model reasoning (800ms)
    await new Promise((res) => setTimeout(res, 750));

    const lower = question.toLowerCase();
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));

    if (isEmergency) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        isEmergencyAlert: true,
        text: `⚠️ **CRITICAL EMERGENCY SAFETY ADVISORY**

The symptoms described may indicate an acute or life-threatening medical emergency.

**Immediate Actions Required:**
1. **Call 911 (or your local emergency dispatch number) immediately.**
2. Do not attempt to drive yourself to the emergency department.
3. If with someone, notify them immediately of your acute symptoms.

*Educational Note:* This academic software prototype does **not** evaluate emergencies, triage active crises, or replace emergency medical technicians. Please contact emergency services right away.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'What are standard non-emergency preventive cardiology tips?',
          'What questions should I ask my primary care physician?',
        ],
      };
    }

    // Intelligent educational synthesis based on question keywords
    let responseText = '';
    let topic = 'General Health Education';
    let followUps: string[] = [];

    if (lower.includes('blood pressure') || lower.includes('systolic') || lower.includes('hypertension')) {
      topic = 'Cardiovascular Physiology';
      responseText = `**Understanding Blood Pressure (Systolic vs. Diastolic)**

Blood pressure measures the hydrostatic pressure exerted by circulating blood upon the walls of arterial vessels.

1. **Systolic Pressure (Top Number):**
   - Represents arterial pressure during ventricular myocardial contraction (systole).
   - Normal physiological range: Typically < 120 mmHg.
   - Clinical significance: Reflects arterial stiffness and cardiac output volume.

2. **Diastolic Pressure (Bottom Number):**
   - Represents resting arterial pressure between cardiac contractions when ventricular chambers refill (diastole).
   - Normal physiological range: Typically < 80 mmHg.
   - Clinical significance: Reflects systemic vascular resistance in peripheral arteriolar beds.

3. **Academic & Preventive Factors:**
   - Sodium intake modulation (< 2,300 mg/day recommended by AHA).
   - Aerobic physical activity (150 minutes weekly of moderate exertion).
   - Stress reduction via vagal nerve stimulation and restorative sleep.

*Clinical Discussion:* Consult your physician or cardiologist for individualized target thresholds and ambulatory monitoring guidance.`;
      followUps = [
        'How does dietary sodium impact blood volume and pressure?',
        'What is ambulatory blood pressure monitoring?',
      ];
    } else if (lower.includes('cholesterol') || lower.includes('lipid') || lower.includes('ldl') || lower.includes('hdl')) {
      topic = 'Lipid Metabolism';
      responseText = `**Educational Overview: Lipid Profiles and Cardiovascular Health**

Cholesterol is an essential lipid molecule utilized in cellular membrane integrity, steroid hormone synthesis, and bile acid production.

- **LDL (Low-Density Lipoprotein):** Often termed "atherogenic lipoprotein" because excess circulating particles can undergo oxidative modification and accumulate in arterial intima, contributing to plaque formation.
- **HDL (High-Density Lipoprotein):** Facilitates reverse cholesterol transport, shuttling peripheral cholesterol back to the hepatic system for excretion.
- **Triglycerides:** Chemical form in which most fat exists in food and body stores. Elevated levels correlate with insulin resistance and metabolic syndrome.

**Evidence-Based Lifestyle Adaptations:**
- Soluble fiber intake (oats, legumes, pectin) binds bile acids in the gastrointestinal tract.
- Substitution of saturated fats with monounsaturated fatty acids (olive oil, avocados).
- Regular resistance and aerobic training to elevate serum HDL fraction.`;
      followUps = [
        'What is the difference between dietary cholesterol and blood cholesterol?',
        'How do statins function pharmacologically?',
      ];
    } else if (lower.includes('diabetes') || lower.includes('glucose') || lower.includes('hba1c') || lower.includes('sugar')) {
      topic = 'Endocrine & Metabolic Health';
      responseText = `**Understanding Glycemic Regulation and HbA1c**

Glycemic regulation is mediated by pancreatic endocrine signaling (insulin from beta cells, glucagon from alpha cells).

- **HbA1c (Hemoglobin A1c):** Measures the percentage of glycated hemoglobin in red blood cells. Because erythrocytes have a lifespan of approximately 120 days, HbA1c provides a weighted 3-month average of plasma glucose concentrations.
  - Normal reference: < 5.7%
  - Prediabetes range: 5.7% – 6.4%
  - Diabetes diagnostic threshold: ≥ 6.5% (confirmed on repeat testing)

- **Mechanisms:**
  - *Type 1:* Autoimmune destruction of pancreatic beta cells, requiring exogenous insulin replacement.
  - *Type 2:* Progressive peripheral insulin receptor desensitization coupled with relative secretory defect.

*Academic note:* Regular physical activity enhances non-insulin-mediated GLUT4 glucose transporter translocation in skeletal muscle tissue.`;
      followUps = [
        'How does exercise improve insulin sensitivity?',
        'What are common early symptoms of hyperglycemia?',
      ];
    } else if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('circadian')) {
      topic = 'Sleep Hygiene & Chronobiology';
      responseText = `**Principles of Circadian Biology and Sleep Hygiene**

Sleep is an active physiological state essential for memory consolidation, metabolic clearance via the glymphatic system, and endocrine homeostasis.

**Key Behavioral Protocols:**
1. **Light Exposure Timing:** Early morning solar light exposure (~10,000 lux) suppresses melatonin and sets the master circadian pacemaker in the suprachiasmatic nucleus (SCN).
2. **Thermal Environment:** Core body temperature must decrease by approximately 1–2°F to initiate deep slow-wave sleep. Cooler room temperatures (65–68°F / 18–20°C) facilitate this drop.
3. **Adenosine Clearance:** Caffeine has an average half-life of 5–7 hours; limiting intake past midday prevents adenosine receptor antagonism at night.
4. **Digital Hygiene:** Attenuate blue-wavelength illumination (450–480 nm) 60–90 minutes prior to bedtime to avoid melatonin synthesis delay.`;
      followUps = [
        'How does sleep debt impact immune function?',
        'What happens during REM vs slow-wave sleep?',
      ];
    } else if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('cortisol')) {
      topic = 'Stress Physiology & Autonomic Regulation';
      responseText = `**The Neurobiology of Stress and Autonomic Balance**

The human stress response involves bidirectional signaling between the sympathetic nervous system (fight-or-flight) and the hypothalamic-pituitary-adrenal (HPA) axis.

- **Acute Stress Response:** Release of catecholamines (epinephrine, norepinephrine) causes tachycardia, bronchodilation, and peripheral vasoconstriction to optimize survival.
- **Chronic Stress Adaptation:** Sustained cortisol elevation can downregulate glucocorticoid receptors, dysregulate inflammatory cytokines (IL-6, TNF-alpha), and disrupt hippocampal neuroplasticity.

**Physiological Countermeasures:**
- **Controlled Respiration:** Prolonged exhalation (such as 4-7-8 breathing or physiological sighs) stimulates baroreceptor reflexes and increases parasympathetic vagal tone.
- **Aerobic Movement:** Clears circulating catecholamines and triggers brain-derived neurotrophic factor (BDNF) synthesis.`;
      followUps = [
        'What is heart rate variability (HRV)?',
        'How does the vagus nerve regulate heart rate?',
      ];
    } else {
      // General structured healthcare response
      topic = 'Health Literacy & Education';
      responseText = `**Educational Information Regarding: "${question.trim()}"**

Thank you for your healthcare inquiry. In the context of health informatics and patient education:

1. **Fundamental Overview:**
   Health parameters are governed by complex interactions between genetic predispositions, lifestyle choices, environmental exposures, and preventive clinical care.

2. **Core Clinical Context:**
   - Accurate evaluation always requires comprehensive review of patient history, physical examination, and standardized clinical laboratory metrics.
   - Symptoms that persist, worsen, or interfere with daily activities warrant professional clinical evaluation by an accredited healthcare practitioner.

3. **Suggested Questions for Your Healthcare Provider:**
   - *"What are the most relevant diagnostic tests or markers for my concern?"*
   - *"Are there non-pharmacological lifestyle modifications I can adopt right away?"*
   - *"What symptoms or warning signs should prompt me to follow up sooner?"*

*Academic Prototype Notice: This response was generated by the educational AI assistant module developed for university capstone demonstration.*`;
      followUps = [
        'What questions should I ask during a routine annual checkup?',
        'How can patients keep track of their personal health records?',
      ];
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      educationalTopic: topic,
      suggestedFollowUps: followUps,
    };
  },
};
