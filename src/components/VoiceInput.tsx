import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, UI_TEXT, VOICE_LANG_CODE } from "@/types/triage";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface VoiceInputProps {
  language: Language;
  onResult: (text: string) => void;
}

export const VoiceInput = ({ language, onResult }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const t = UI_TEXT[language];

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(t.voiceNotSupported);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = VOICE_LANG_CODE[language];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, language, onResult, t]);

  return (
    <button
      onClick={toggleListening}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:scale-[1.02] ${
        isListening
          ? "bg-destructive text-destructive-foreground border-destructive animate-pulse"
          : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent"
      }`}
    >
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.span key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <MicOff className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Mic className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
      {isListening ? t.voiceListening : t.voiceInput}
    </button>
  );
};
