import { Language } from "@/types/triage";

interface LanguageToggleProps {
  language: Language;
  onChange: (lang: Language) => void;
}

export const LanguageToggle = ({ language, onChange }: LanguageToggleProps) => {
  return (
    <div className="flex items-center bg-muted rounded-full p-1 gap-1">
      <button
        onClick={() => onChange("en")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          language === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange("hi")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          language === "hi"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
