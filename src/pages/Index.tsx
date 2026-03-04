import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, TriageResult, UI_TEXT, PatientInfo } from "@/types/triage";
import { queryRAGApi } from "@/lib/ragApi";
import { SymptomChips } from "@/components/SymptomChips";
import { TriageResults } from "@/components/TriageResults";
import { LanguageToggle } from "@/components/LanguageToggle";
import { WelcomePage } from "@/components/WelcomePage";
import { PatientInfoForm } from "@/components/PatientInfoForm";
import { VoiceInput } from "@/components/VoiceInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type Step = "welcome" | "patient" | "symptoms" | "results";

const Index = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState<Step>("welcome");
  const [symptoms, setSymptoms] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ age: "", gender: "" });

  const t = UI_TEXT[language];

  const toggleChip = useCallback((symptom: string) => {
    setSelectedChips((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }, []);

  const handleVoiceResult = useCallback((text: string) => {
    setSymptoms((prev) => (prev ? prev + ", " + text : text));
  }, []);

  const handleAnalyze = async () => {
    const allSymptoms = [symptoms, ...selectedChips].filter(Boolean).join(", ");
    if (!allSymptoms.trim()) {
      toast.error(language === "en" ? "Please describe your symptoms" : language === "hi" ? "कृपया अपने लक्षण बताएं" : "దయచేసి మీ లక్షణాలను వివరించండి");
      return;
    }

    setIsAnalyzing(true);
    try {
      const data: TriageResult = await queryRAGApi(allSymptoms);
      setResult(data);
      setStep("results");
    } catch (e) {
      console.error(e);
      toast.error(
        language === "en"
          ? "Analysis failed. Please check if the health API server is running."
          : language === "hi"
            ? "विश्लेषण विफल। कृपया जांचें कि API सर्वर चल रहा है।"
            : "విశ్లేషణ విఫలమైంది. దయచేసి API సర్వర్ నడుస్తోందో తనిఖీ చేయండి."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSymptoms("");
    setSelectedChips([]);
    setPatientInfo({ age: "", gender: "" });
    setStep("welcome");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-display font-bold text-foreground leading-tight">MedTriage AI</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">{t.tagline}</p>
            </div>
          </div>
          <LanguageToggle language={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div key="welcome" exit={{ opacity: 0, y: -20 }}>
              <WelcomePage language={language} onStart={() => setStep("patient")} />
            </motion.div>
          )}

          {step === "patient" && (
            <motion.div key="patient" exit={{ opacity: 0, y: -20 }}>
              <PatientInfoForm
                language={language}
                patientInfo={patientInfo}
                onChange={setPatientInfo}
                onNext={() => setStep("symptoms")}
                onBack={() => setStep("welcome")}
              />
            </motion.div>
          )}

          {step === "symptoms" && (
            <motion.div
              key="symptoms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">✓</span>
                <div className="w-8 h-0.5 bg-primary" />
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">2</span>
                <div className="w-8 h-0.5 bg-border" />
                <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-xs">3</span>
              </div>

              {/* Hero */}
              <div className="text-center py-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <Activity className="w-7 h-7 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-1">{t.title}</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.subtitle}</p>
              </div>

              {/* Voice + Text input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">{t.inputLabel}</label>
                  <VoiceInput language={language} onResult={handleVoiceResult} />
                </div>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="min-h-[100px] resize-none bg-card border-border focus:ring-primary"
                />
              </div>

              {/* Symptom chips */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.commonSymptoms}</label>
                <SymptomChips
                  language={language}
                  selectedSymptoms={selectedChips}
                  onToggle={toggleChip}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button onClick={() => setStep("patient")} variant="outline" className="h-12 px-6 gap-2">
                  {t.back}
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!symptoms.trim() && selectedChips.length === 0)}
                  className="flex-1 h-12 text-base font-semibold gap-2 hover:scale-[1.01] transition-transform"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      {t.analyze}
                    </>
                  )}
                </Button>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-4">
                {t.disclaimer}
              </p>
            </motion.div>
          )}

          {step === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TriageResults result={result} language={language} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
