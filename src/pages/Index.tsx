import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, TriageResult, UI_TEXT, PatientInfo } from "@/types/triage";
import { queryRAGApi } from "@/lib/ragApi";
import { SymptomChips } from "@/components/SymptomChips";
import { TriageResults } from "@/components/TriageResults";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VoiceInput } from "@/components/VoiceInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Loader2, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [showResults, setShowResults] = useState(false);
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
      toast.error(
        language === "en"
          ? "Please describe your symptoms"
          : language === "hi"
            ? "कृपया अपने लक्षण बताएं"
            : "దయచేసి మీ లక్షణాలను వివరించండి"
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const data: TriageResult = await queryRAGApi(allSymptoms, language, patientInfo);
      setResult(data);
      setShowResults(true);
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
    setShowResults(false);
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
          {!showResults ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
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

              {/* Patient Info */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">{t.patientInfo}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Age */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">{t.age}</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo((p) => ({ ...p, age: e.target.value }))}
                      placeholder={t.agePlaceholder}
                      className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">{t.gender}</label>
                    <select
                      value={patientInfo.gender}
                      onChange={(e) =>
                        setPatientInfo((p) => ({
                          ...p,
                          gender: e.target.value as PatientInfo["gender"],
                        }))
                      }
                      className="w-full h-9 px-3 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">{t.selectGender}</option>
                      <option value="male">{t.male}</option>
                      <option value="female">{t.female}</option>
                      <option value="other">{t.other}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Symptoms Input */}
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

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!symptoms.trim() && selectedChips.length === 0)}
                className="w-full h-12 text-base font-semibold gap-2 hover:scale-[1.01] transition-transform"
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

              {/* Disclaimer */}
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-4">
                {t.disclaimer}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Back to form */}
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.newAssessment}
              </button>

              {result && (
                <TriageResults result={result} language={language} onReset={handleReset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
