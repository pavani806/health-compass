import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Language, TriageResult, UI_TEXT } from "@/types/triage";
import { SymptomChips } from "@/components/SymptomChips";
import { TriageResults } from "@/components/TriageResults";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [symptoms, setSymptoms] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  const t = UI_TEXT[language];

  const toggleChip = useCallback((symptom: string) => {
    setSelectedChips((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }, []);

  const handleAnalyze = async () => {
    const allSymptoms = [symptoms, ...selectedChips].filter(Boolean).join(", ");
    if (!allSymptoms.trim()) {
      toast.error(language === "en" ? "Please describe your symptoms" : "कृपया अपने लक्षण बताएं");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptoms", {
        body: { symptoms: allSymptoms, language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as TriageResult);
    } catch (e) {
      console.error(e);
      toast.error(
        language === "en"
          ? "Analysis failed. Please try again."
          : "विश्लेषण विफल। कृपया पुनः प्रयास करें।"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSymptoms("");
    setSelectedChips([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-display font-bold text-foreground leading-tight">MedTriage AI</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Early Risk Detection</p>
            </div>
          </div>
          <LanguageToggle language={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Hero */}
              <div className="text-center py-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <Activity className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">{t.title}</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">{t.subtitle}</p>
              </div>

              {/* Text input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.inputLabel}</label>
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

              {/* Analyze button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!symptoms.trim() && selectedChips.length === 0)}
                className="w-full h-12 text-base font-semibold gap-2"
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
