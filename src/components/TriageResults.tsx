import { motion } from "framer-motion";
import { TriageResult, Language, UI_TEXT, Recommendation, RAGDiseaseResult } from "@/types/triage";
import { RiskGauge } from "./RiskGauge";
import { EmergencySection } from "./EmergencySection";
import {
  Heart,
  Phone,
  Building2,
  Siren,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Thermometer,
  Tag,
} from "lucide-react";
import { Button } from "./ui/button";

interface TriageResultsProps {
  result: TriageResult;
  language: Language;
  onReset: () => void;
}

const RECOMMENDATION_ICON: Record<Recommendation, React.ReactNode> = {
  "Self-care": <Heart className="w-5 h-5" />,
  "Teleconsultation": <Phone className="w-5 h-5" />,
  "Hospital visit": <Building2 className="w-5 h-5" />,
  "Emergency": <Siren className="w-5 h-5" />,
};

const RECOMMENDATION_COLOR: Record<Recommendation, string> = {
  "Self-care": "bg-risk-low",
  "Teleconsultation": "bg-risk-moderate",
  "Hospital visit": "bg-risk-high",
  "Emergency": "bg-risk-critical",
};

function ProbabilityBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 40
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-400/30"
      : pct >= 20
        ? "bg-amber-500/10 text-amber-600 border-amber-400/30"
        : "bg-slate-200/60 text-slate-500 border-slate-300/30";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}
    >
      {pct}% match
    </span>
  );
}

function PrecautionList({ precautions }: { precautions: string[] }) {
  return (
    <ul className="space-y-2 mt-3">
      {precautions.map((p, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-sm text-muted-foreground"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span className="capitalize leading-relaxed">{p}</span>
        </li>
      ))}
    </ul>
  );
}

function DiseaseCard({
  disease,
  isPrimary,
}: {
  disease: RAGDiseaseResult;
  isPrimary: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 space-y-1 ${isPrimary
          ? "border-primary/30 bg-primary/5 shadow-sm"
          : "border-border bg-card shadow-card"
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isPrimary ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              }`}
          >
            <Stethoscope className="w-4.5 h-4.5" />
          </div>
          <div>
            {isPrimary && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-0.5">
                ✦ Most Likely Diagnosis
              </p>
            )}
            {!isPrimary && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                Secondary Possibility
              </p>
            )}
            <h3
              className={`font-display font-bold leading-tight ${isPrimary ? "text-lg text-foreground" : "text-base text-foreground"
                }`}
            >
              {disease.disease}
            </h3>
          </div>
        </div>
        <ProbabilityBadge value={disease.probability} />
      </div>

      {/* Divider */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Recommended Precautions
          </p>
        </div>
        <PrecautionList precautions={disease.precautions} />
      </div>
    </div>
  );
}

export const TriageResults = ({ result, language, onReset }: TriageResultsProps) => {
  const t = UI_TEXT[language];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const hasPrimary = !!result.primary_disease;
  const hasSecondary = !!result.secondary_disease;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Critical Emergency Section */}
      {result.risk_level === "Critical" && (
        <motion.div variants={item}>
          <EmergencySection language={language} />
        </motion.div>
      )}

      {/* Risk Gauge */}
      <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-card border border-border">
        <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">{t.riskScore}</h3>
        <RiskGauge score={result.risk_score} level={result.risk_level} />
        {result.severity_score !== undefined && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Severity Score: <span className="font-semibold text-foreground">{result.severity_score}</span>
            </p>
          </div>
        )}
      </motion.div>

      {/* Parsed Symptoms */}
      {result.parsed_symptoms && result.parsed_symptoms.length > 0 && (
        <motion.div variants={item} className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-2 mb-2.5">
            <Tag className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Detected Symptoms</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.parsed_symptoms.map((s, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 capitalize"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendation Banner */}
      <motion.div
        variants={item}
        className={`rounded-xl p-5 text-primary-foreground ${RECOMMENDATION_COLOR[result.recommendation]}`}
      >
        <div className="flex items-center gap-3 mb-2">
          {RECOMMENDATION_ICON[result.recommendation]}
          <h3 className="font-display font-semibold text-lg">
            {t.recommendation}: {result.recommendation}
          </h3>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">{result.recommendation_details}</p>
      </motion.div>

      {/* PRIMARY Disease Card */}
      {hasPrimary && (
        <motion.div variants={item}>
          <DiseaseCard disease={result.primary_disease!} isPrimary={true} />
        </motion.div>
      )}

      {/* SECONDARY Disease Card */}
      {hasSecondary && (
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-muted-foreground font-medium">
              Also consider this alternative possibility:
            </p>
          </div>
          <DiseaseCard disease={result.secondary_disease!} isPrimary={false} />
        </motion.div>
      )}

      {/* All Possible Conditions (if no RAG data) */}
      {!hasPrimary && result.possible_conditions.length > 0 && (
        <motion.div variants={item} className="bg-card rounded-xl p-5 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3">{t.possibleConditions}</h3>
          <div className="space-y-2">
            {result.possible_conditions.map((condition, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{condition.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {condition.probability}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Immediate Actions (from primary precautions if RAG data, else generic) */}
      {!hasPrimary && result.immediate_actions.length > 0 && (
        <motion.div variants={item} className="bg-card rounded-xl p-5 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3">{t.immediateActions}</h3>
          <ul className="space-y-2">
            {result.immediate_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div variants={item} className="bg-coral/10 border border-coral/20 rounded-xl p-4">
        <p className="text-xs text-foreground leading-relaxed">{t.disclaimer}</p>
      </motion.div>

      {/* Reset */}
      <motion.div variants={item}>
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full gap-2 hover:scale-[1.01] transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          {t.newAssessment}
        </Button>
      </motion.div>
    </motion.div>
  );
};
