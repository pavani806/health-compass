import { motion } from "framer-motion";
import { RiskLevel } from "@/types/triage";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  animate?: boolean;
}

const LEVEL_CONFIG: Record<RiskLevel, { color: string; bgClass: string }> = {
  Low: { color: "hsl(152, 60%, 45%)", bgClass: "bg-risk-low" },
  Moderate: { color: "hsl(43, 90%, 50%)", bgClass: "bg-risk-moderate" },
  High: { color: "hsl(20, 90%, 55%)", bgClass: "bg-risk-high" },
  Critical: { color: "hsl(0, 72%, 55%)", bgClass: "bg-risk-critical" },
};

export const RiskGauge = ({ score, level, animate = true }: RiskGaugeProps) => {
  const config = LEVEL_CONFIG[level];
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-28 overflow-hidden">
        {/* Background arc */}
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(152, 60%, 45%)" />
              <stop offset="33%" stopColor="hsl(43, 90%, 50%)" />
              <stop offset="66%" stopColor="hsl(20, 90%, 55%)" />
              <stop offset="100%" stopColor="hsl(0, 72%, 55%)" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animate ? score / 100 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-1 left-1/2 origin-bottom"
          style={{ width: 3, height: 60, marginLeft: -1.5 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: animate ? rotation : -90 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{ background: config.color }}
          />
        </motion.div>

        {/* Center dot */}
        <div
          className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 translate-y-1/2"
          style={{ background: config.color }}
        />
      </div>

      {/* Score number */}
      <motion.div
        className="text-center -mt-1"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-4xl font-display font-bold" style={{ color: config.color }}>
          {score}
        </span>
        <span className="text-muted-foreground text-sm">/100</span>
      </motion.div>

      {/* Risk level badge */}
      <motion.div
        className="px-4 py-1.5 rounded-full text-sm font-semibold text-primary-foreground"
        style={{ background: config.color }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {level}
      </motion.div>
    </div>
  );
};
