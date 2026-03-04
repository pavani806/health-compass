import { motion } from "framer-motion";
import { Language, UI_TEXT, PatientInfo } from "@/types/triage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { User, ArrowRight, ArrowLeft } from "lucide-react";

interface PatientInfoFormProps {
  language: Language;
  patientInfo: PatientInfo;
  onChange: (info: PatientInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PatientInfoForm = ({ language, patientInfo, onChange, onNext, onBack }: PatientInfoFormProps) => {
  const t = UI_TEXT[language];

  const genderOptions: { value: PatientInfo["gender"]; label: string }[] = [
    { value: "male", label: t.male },
    { value: "female", label: t.female },
    { value: "other", label: t.other },
  ];

  const isValid = patientInfo.age && parseInt(patientInfo.age) > 0 && parseInt(patientInfo.age) < 150 && patientInfo.gender;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">1</span>
        <div className="w-8 h-0.5 bg-border" />
        <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-xs">2</span>
        <div className="w-8 h-0.5 bg-border" />
        <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-xs">3</span>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">{t.patientInfo}</h2>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t.age}</label>
          <Input
            type="number"
            min={1}
            max={150}
            value={patientInfo.age}
            onChange={(e) => onChange({ ...patientInfo, age: e.target.value })}
            placeholder={t.agePlaceholder}
            className="h-12 text-base"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t.gender}</label>
          <div className="grid grid-cols-3 gap-2">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...patientInfo, gender: opt.value })}
                className={`py-3 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-[1.02] ${
                  patientInfo.gender === opt.value
                    ? "bg-primary text-primary-foreground border-primary shadow-elevated"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1 h-12 gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 h-12 gap-2"
        >
          {t.next}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
