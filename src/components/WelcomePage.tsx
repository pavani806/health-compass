import { motion } from "framer-motion";
import { Language, UI_TEXT } from "@/types/triage";
import { Activity, Stethoscope, Globe, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface WelcomePageProps {
  language: Language;
  onStart: () => void;
}

export const WelcomePage = ({ language, onStart }: WelcomePageProps) => {
  const t = UI_TEXT[language];

  const features = [
    { icon: <Stethoscope className="w-6 h-6" />, label: t.features1 },
    { icon: <Globe className="w-6 h-6" />, label: t.features2 },
    { icon: <ShieldAlert className="w-6 h-6" />, label: t.features3 },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="blob blob-delay-2 absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-accent/40 blur-3xl" />
        <div className="blob blob-delay-4 absolute -bottom-16 left-1/4 w-80 h-80 rounded-full bg-primary/15 blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
        >
          <Activity className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t.welcomeTitle}
        </motion.h1>

        <motion.p
          className="text-lg font-display font-semibold text-primary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t.welcomeSubtitle}
        </motion.p>

        <motion.p
          className="text-sm text-muted-foreground mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t.welcomeDesc}
        </motion.p>

        {/* Feature chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl shadow-card text-sm font-medium text-foreground hover:shadow-elevated hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <span className="text-primary">{f.icon}</span>
              {f.label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="h-14 px-10 text-lg font-semibold gap-3 rounded-2xl shadow-elevated hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {t.getStarted}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
