import { Language, LANGUAGE_NAMES } from "@/types/triage";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  language: Language;
  onChange: (lang: Language) => void;
}

const languages: Language[] = ["en", "hi", "te"];

export const LanguageToggle = ({ language, onChange }: LanguageToggleProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center bg-muted rounded-full p-1 gap-0.5">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onChange(lang)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
              language === lang
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>
    </div>
  );
};
