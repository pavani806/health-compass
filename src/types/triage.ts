export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
export type Recommendation = "Self-care" | "Teleconsultation" | "Hospital visit" | "Emergency";
export type Language = "en" | "hi";

export interface PossibleCondition {
  name: string;
  probability: "Low" | "Medium" | "High";
}

export interface TriageResult {
  risk_score: number;
  risk_level: RiskLevel;
  possible_conditions: PossibleCondition[];
  recommendation: Recommendation;
  recommendation_details: string;
  explanation: string;
  immediate_actions: string[];
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
};

export const UI_TEXT: Record<Language, Record<string, string>> = {
  en: {
    title: "Health Risk Assessment",
    subtitle: "AI-powered early risk detection & intelligent triage",
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
  },
  hi: {
    title: "स्वास्थ्य जोखिम मूल्यांकन",
    subtitle: "AI-संचालित प्रारंभिक जोखिम पहचान और बुद्धिमान ट्राइएज",
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
  },
};
