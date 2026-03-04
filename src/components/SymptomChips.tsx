import { motion } from "framer-motion";
import { Language, COMMON_SYMPTOMS } from "@/types/triage";

interface SymptomChipsProps {
  language: Language;
  selectedSymptoms: string[];
  onToggle: (symptom: string) => void;
}

export const SymptomChips = ({ language, selectedSymptoms, onToggle }: SymptomChipsProps) => {
  const symptoms = COMMON_SYMPTOMS[language];

  return (
    <div className="flex flex-wrap gap-2">
      {symptoms.map((symptom, i) => {
        const isSelected = selectedSymptoms.includes(symptom);
        return (
          <motion.button
            key={symptom}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => onToggle(symptom)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-elevated"
                : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent"
            }`}
          >
            {symptom}
          </motion.button>
        );
      })}
    </div>
  );
};
