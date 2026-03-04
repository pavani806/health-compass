import { RAGQueryResponse, TriageResult, RiskLevel, Recommendation, Language, PatientInfo } from "@/types/triage";

const RAG_API_URL = "http://localhost:8000/v1/query";

function severityToRiskLevel(pct: number): RiskLevel {
    if (pct <= 25) return "Low";
    if (pct <= 50) return "Moderate";
    if (pct <= 75) return "High";
    return "Critical";
}

function riskLevelToRecommendation(level: RiskLevel): Recommendation {
    switch (level) {
        case "Low":
            return "Self-care";
        case "Moderate":
            return "Teleconsultation";
        case "High":
            return "Hospital visit";
        case "Critical":
            return "Emergency";
    }
}

function recommendationDetails(level: RiskLevel, disease: string): string {
    switch (level) {
        case "Low":
            return `Your symptoms are likely mild. ${disease} can often be managed at home with rest and self-care. Monitor your symptoms closely and consult a doctor if they worsen.`;
        case "Moderate":
            return `Your symptoms suggest moderate concern. A teleconsultation for ${disease} is recommended to get professional guidance without an in-person visit.`;
        case "High":
            return `Your symptoms indicate a higher risk condition. Please visit a hospital or clinic for a proper evaluation of ${disease}.`;
        case "Critical":
            return `Your symptoms are critical. Seek emergency medical care immediately for ${disease}. Do not delay treatment.`;
    }
}

export async function queryRAGApi(symptoms: string, language: Language = "en", patient?: PatientInfo): Promise<TriageResult> {
    const response = await fetch(RAG_API_URL, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            symptoms,
            top_k: 3,
            age: patient?.age || undefined,
            gender: patient?.gender || undefined,
        }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: RAGQueryResponse = await response.json();
    const riskLevel = severityToRiskLevel(data.severity.percentage);
    const recommendation = riskLevelToRecommendation(riskLevel);
    const primary = data.results[0];
    const secondary = data.results[1];

    // Map API results to possible_conditions using probability percentage
    const possibleConditions = data.results.map((r) => ({
        name: r.disease,
        probability:
            r.probability >= 0.4 ? "High" : r.probability >= 0.2 ? "Medium" : ("Low" as "Low" | "Medium" | "High"),
    }));

    // Build localized immediate_actions from primary precautions
    const immediateActions = primary?.precautions.map((p) => p[language]) ?? [];

    return {
        risk_score: Math.round(data.severity.percentage),
        risk_level: riskLevel,
        possible_conditions: possibleConditions,
        recommendation,
        recommendation_details: recommendationDetails(riskLevel, primary?.disease ?? "the condition"),
        explanation: `Based on your ${data.parsed_symptoms.length} reported symptom(s) — ${data.parsed_symptoms.join(", ")} — the severity score is ${data.severity.score}. The most likely diagnosis is ${primary?.disease} with a ${Math.round((primary?.probability ?? 0) * 100)}% probability.`,
        immediate_actions: immediateActions,
        // RAG-enriched fields (full multilingual objects passed through)
        primary_disease: primary,
        secondary_disease: secondary,
        severity_score: data.severity.score,
        parsed_symptoms: data.parsed_symptoms,
    };
}
