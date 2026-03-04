export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type Recommendation = "Self-care" | "Teleconsultation" | "Hospital visit" | "Emergency";
export type Language = "en" | "hi" | "te";

export interface PossibleCondition {
  name: string;
  probability: "Low" | "Medium" | "High";
}

// RAG API types
export interface RAGDiseaseResult {
  rank: number;
  disease: string;
  probability: number;
  precautions: string[];
}

export interface RAGQueryResponse {
  query: string;
  parsed_symptoms: string[];
  severity_score: number;
  results: RAGDiseaseResult[];
}

export interface TriageResult {
  risk_score: number;
  risk_level: RiskLevel;
  possible_conditions: PossibleCondition[];
  recommendation: Recommendation;
  recommendation_details: string;
  explanation: string;
  immediate_actions: string[];
  // RAG-enriched fields
  primary_disease?: RAGDiseaseResult;
  secondary_disease?: RAGDiseaseResult;
  severity_score?: number;
  parsed_symptoms?: string[];
}

export interface PatientInfo {
  age: string;
  gender: "male" | "female" | "other" | "";
}

export const COMMON_SYMPTOMS: Record<Language, string[]> = {
  en: [
    "Fever", "Headache", "Cough", "Chest pain", "Shortness of breath",
    "Fatigue", "Nausea", "Vomiting", "Diarrhea", "Body aches",
    "Sore throat", "Dizziness", "Abdominal pain", "Joint pain",
    "Rash", "Loss of appetite", "Blurred vision", "Numbness",
  ],
  hi: [
    "बुखार", "सिरदर्द", "खांसी", "सीने में दर्द", "सांस की तकलीफ",
    "थकान", "मतली", "उल्टी", "दस्त", "बदन दर्द",
    "गले में खराश", "चक्कर आना", "पेट दर्द", "जोड़ों का दर्द",
    "त्वचा पर दाने", "भूख न लगना", "धुंधली दृष्टि", "सुन्नपन",
  ],
  te: [
    "జ్వరం", "తలనొప్పి", "దగ్గు", "ఛాతీ నొప్పి", "ఊపిరి ఆడకపోవడం",
    "అలసట", "వాంతి భావన", "వాంతులు", "విరేచనాలు", "ఒళ్ళు నొప్పులు",
    "గొంతు నొప్పి", "తల తిరగడం", "కడుపు నొప్పి", "కీళ్ళ నొప్పి",
    "దద్దుర్లు", "ఆకలి లేకపోవడం", "మసక చూపు", "మొద్దుబారిన భావన",
  ],
};

export const UI_TEXT: Record<Language, Record<string, string>> = {
  en: {
    title: "Health Risk Assessment",
    subtitle: "AI-powered early risk detection & intelligent triage",
    tagline: "Rural Health Assistant",
    inputLabel: "Describe your symptoms",
    inputPlaceholder: "e.g., I have had a headache and fever for 2 days, with occasional dizziness...",
    commonSymptoms: "Common Symptoms",
    analyze: "Analyze Symptoms",
    analyzing: "Analyzing...",
    riskScore: "Risk Score",
    riskLevel: "Risk Level",
    recommendation: "Recommendation",
    possibleConditions: "Possible Conditions",
    whyThisScore: "Why this assessment?",
    immediateActions: "Immediate Steps",
    disclaimer: "⚠️ This is an AI-based pre-screening tool and NOT a medical diagnosis. Always consult a qualified healthcare professional.",
    newAssessment: "New Assessment",
    probability: "Probability",
    welcomeTitle: "MedTriage AI",
    welcomeSubtitle: "Rural Health Assistant",
    welcomeDesc: "AI-powered early risk detection and intelligent triage for rural communities. Get instant health assessments in your language.",
    getStarted: "Get Started",
    features1: "AI Symptom Analysis",
    features2: "Multi-Language Support",
    features3: "Emergency Guidance",
    patientInfo: "Patient Information",
    age: "Age",
    agePlaceholder: "Enter your age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    next: "Next",
    back: "Back",
    step: "Step",
    emergencyNearby: "🚨 Emergency Care Nearby",
    callEmergency: "🚑 Call Emergency (108)",
    criticalAlert: "Your symptoms indicate a critical risk. Please seek immediate medical attention.",
    findingHospitals: "Finding nearby hospitals...",
    navigate: "Navigate",
    voiceInput: "🎤 Speak your symptoms",
    voiceListening: "Listening...",
    voiceNotSupported: "Voice input not supported in this browser",
    selectGender: "Select gender",
  },
  hi: {
    title: "स्वास्थ्य जोखिम मूल्यांकन",
    subtitle: "AI-संचालित प्रारंभिक जोखिम पहचान और बुद्धिमान ट्राइएज",
    tagline: "ग्रामीण स्वास्थ्य सहायक",
    inputLabel: "अपने लक्षण बताएं",
    inputPlaceholder: "जैसे, मुझे 2 दिनों से सिरदर्द और बुखार है, कभी-कभी चक्कर भी आते हैं...",
    commonSymptoms: "सामान्य लक्षण",
    analyze: "लक्षणों का विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    riskScore: "जोखिम स्कोर",
    riskLevel: "जोखिम स्तर",
    recommendation: "सिफारिश",
    possibleConditions: "संभावित स्थितियां",
    whyThisScore: "यह मूल्यांकन क्यों?",
    immediateActions: "तत्काल कदम",
    disclaimer: "⚠️ यह AI-आधारित प्री-स्क्रीनिंग टूल है, चिकित्सा निदान नहीं। हमेशा योग्य स्वास्थ्य पेशेवर से परामर्श लें।",
    newAssessment: "नया मूल्यांकन",
    probability: "संभावना",
    welcomeTitle: "MedTriage AI",
    welcomeSubtitle: "ग्रामीण स्वास्थ्य सहायक",
    welcomeDesc: "ग्रामीण समुदायों के लिए AI-संचालित प्रारंभिक जोखिम पहचान। अपनी भाषा में तुरंत स्वास्थ्य मूल्यांकन प्राप्त करें।",
    getStarted: "शुरू करें",
    features1: "AI लक्षण विश्लेषण",
    features2: "बहु-भाषा समर्थन",
    features3: "आपातकालीन मार्गदर्शन",
    patientInfo: "रोगी की जानकारी",
    age: "आयु",
    agePlaceholder: "अपनी आयु दर्ज करें",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    next: "आगे",
    back: "पीछे",
    step: "चरण",
    emergencyNearby: "🚨 आस-पास आपातकालीन देखभाल",
    callEmergency: "🚑 आपातकालीन कॉल (108)",
    criticalAlert: "आपके लक्षण गंभीर जोखिम दर्शाते हैं। कृपया तुरंत चिकित्सा सहायता लें।",
    findingHospitals: "आस-पास के अस्पताल खोज रहे हैं...",
    navigate: "नेविगेट करें",
    voiceInput: "🎤 अपने लक्षण बोलें",
    voiceListening: "सुन रहा है...",
    voiceNotSupported: "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है",
    selectGender: "लिंग चुनें",
  },
  te: {
    title: "ఆరోగ్య ప్రమాద అంచనా",
    subtitle: "AI-ఆధారిత ముందస్తు ప్రమాద గుర్తింపు & తెలివైన ట్రయేజ్",
    tagline: "గ్రామీణ ఆరోగ్య సహాయకుడు",
    inputLabel: "మీ లక్షణాలను వివరించండి",
    inputPlaceholder: "ఉదా., నాకు 2 రోజులుగా తలనొప్పి మరియు జ్వరం ఉంది, అప్పుడప్పుడు తల తిరుగుతోంది...",
    commonSymptoms: "సాధారణ లక్షణాలు",
    analyze: "లక్షణాలను విశ్లేషించండి",
    analyzing: "విశ్లేషిస్తోంది...",
    riskScore: "ప్రమాద స్కోర్",
    riskLevel: "ప్రమాద స్థాయి",
    recommendation: "సిఫార్సు",
    possibleConditions: "సంభావ్య పరిస్థితులు",
    whyThisScore: "ఈ అంచనా ఎందుకు?",
    immediateActions: "తక్షణ చర్యలు",
    disclaimer: "⚠️ ఇది AI-ఆధారిత ప్రీ-స్క్రీనింగ్ సాధనం, వైద్య నిర్ధారణ కాదు. ఎల్లప్పుడూ అర్హత కలిగిన ఆరోగ్య నిపుణులను సంప్రదించండి.",
    newAssessment: "కొత్త అంచనా",
    probability: "సంభావ్యత",
    welcomeTitle: "MedTriage AI",
    welcomeSubtitle: "గ్రామీణ ఆరోగ్య సహాయకుడు",
    welcomeDesc: "గ్రామీణ సమాజాల కోసం AI-ఆధారిత ముందస్తు ప్రమాద గుర్తింపు. మీ భాషలో తక్షణ ఆరోగ్య అంచనాలు పొందండి.",
    getStarted: "ప్రారంభించండి",
    features1: "AI లక్షణ విశ్లేషణ",
    features2: "బహుళ-భాషా మద్దతు",
    features3: "అత్యవసర మార్గదర్శకత్వం",
    patientInfo: "రోగి సమాచారం",
    age: "వయస్సు",
    agePlaceholder: "మీ వయస్సు నమోదు చేయండి",
    gender: "లింగం",
    male: "పురుషుడు",
    female: "స్త్రీ",
    other: "ఇతరం",
    next: "తదుపరి",
    back: "వెనుకకు",
    step: "దశ",
    emergencyNearby: "🚨 సమీపంలో అత్యవసర సంరక్షణ",
    callEmergency: "🚑 అత్యవసర కాల్ (108)",
    criticalAlert: "మీ లక్షణాలు తీవ్రమైన ప్రమాదాన్ని సూచిస్తున్నాయి. దయచేసి వెంటనే వైద్య సహాయం పొందండి.",
    findingHospitals: "సమీపంలోని ఆసుపత్రులను కనుగొంటోంది...",
    navigate: "నావిగేట్",
    voiceInput: "🎤 మీ లక్షణాలు చెప్పండి",
    voiceListening: "వింటోంది...",
    voiceNotSupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ మద్దతు లేదు",
    selectGender: "లింగం ఎంచుకోండి",
  },
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  te: "తెలుగు",
};

export const VOICE_LANG_CODE: Record<Language, string> = {
  en: "en-US",
  hi: "hi-IN",
  te: "te-IN",
};
