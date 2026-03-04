import { motion } from "framer-motion";
import { TriageResult, Language, UI_TEXT, Recommendation } from "@/types/triage";
import { RiskGauge } from "./RiskGauge";
import { Heart, Phone, Building2, Siren, Info, ArrowRight, RotateCcw } from "lucide-react";
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

const PROBABILITY_COLOR: Record<string, string> = {
  Low: "text-risk-low bg-risk-low/10",
  Medium: "text-risk-moderate bg-risk-moderate/10",
  High: "text-risk-high bg-risk-high/10",
};

export const TriageResults = ({ result, language, onReset }: TriageResultsProps) => {
  const t = UI_TEXT[language];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Risk Gauge */}
      <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-card border border-border">
        <h3 className="text-sm font-medium text-muted-foreground text-center mb-4">{t.riskScore}</h3>
        <RiskGauge score={result.risk_score} level={result.risk_level} />
      </motion.div>

      {/* Recommendation */}
      <motion.div variants={item} className={`rounded-xl p-5 text-primary-foreground ${RECOMMENDATION_COLOR[result.recommendation]}`}>
        <div className="flex items-center gap-3 mb-2">
          {RECOMMENDATION_ICON[result.recommendation]}
          <h3 className="font-display font-semibold text-lg">{t.recommendation}: {result.recommendation}</h3>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">{result.recommendation_details}</p>
      </motion.div>

      {/* Possible Conditions */}
      <motion.div variants={item} className="bg-card rounded-xl p-5 shadow-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-3">{t.possibleConditions}</h3>
        <div className="space-y-2">
          {result.possible_conditions.map((condition, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-foreground">{condition.name}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PROBABILITY_COLOR[condition.probability]}`}>
                {condition.probability}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Explanation */}
      <motion.div variants={item} className="bg-card rounded-xl p-5 shadow-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-foreground">{t.whyThisScore}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
      </motion.div>

      {/* Immediate Actions */}
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

      {/* Disclaimer */}
      <motion.div variants={item} className="bg-coral/10 border border-coral/20 rounded-xl p-4">
        <p className="text-xs text-foreground leading-relaxed">{t.disclaimer}</p>
      </motion.div>

      {/* Reset */}
      <motion.div variants={item}>
        <Button onClick={onReset} variant="outline" className="w-full gap-2">
          <RotateCcw className="w-4 h-4" />
          {t.newAssessment}
        </Button>
      </motion.div>
    </motion.div>
  );
};
