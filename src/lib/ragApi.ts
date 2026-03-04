import { RAGQueryResponse, TriageResult, RiskLevel, Recommendation } from "@/types/triage";

const RAG_API_URL = "http://localhost:8800/v1/query";

function severityToRiskLevel(score: number): RiskLevel {
    if (score <= 5) return "Low";
    if (score <= 12) return "Moderate";
    if (score <= 20) return "High";
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

export async function queryRAGApi(symptoms: string): Promise<TriageResult> {
    const response = await fetch(RAG_API_URL, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms, top_k: 3 }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: RAGQueryResponse = await response.json();
    const riskLevel = severityToRiskLevel(data.severity_score);
    const recommendation = riskLevelToRecommendation(riskLevel);
    const primary = data.results[0];
    const secondary = data.results[1];

    // Map API results to possible_conditions using probability percentage
    const possibleConditions = data.results.map((r) => ({
        name: r.disease,
        probability:
            r.probability >= 0.4 ? "High" : r.probability >= 0.2 ? "Medium" : ("Low" as "Low" | "Medium" | "High"),
    }));

    return {
        risk_score: Math.min(Math.round((data.severity_score / 30) * 100), 100),
        risk_level: riskLevel,
        possible_conditions: possibleConditions,
        recommendation,
        recommendation_details: recommendationDetails(riskLevel, primary?.disease ?? "the condition"),
        explanation: `Based on your ${data.parsed_symptoms.length} reported symptom(s) — ${data.parsed_symptoms.join(", ")} — the severity score is ${data.severity_score}. The most likely diagnosis is ${primary?.disease} with a ${Math.round((primary?.probability ?? 0) * 100)}% probability.`,
        immediate_actions: primary?.precautions ?? [],
        // RAG-enriched fields
        primary_disease: primary,
        secondary_disease: secondary,
        severity_score: data.severity_score,
        parsed_symptoms: data.parsed_symptoms,
    };
}
