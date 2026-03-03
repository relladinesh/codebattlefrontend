import { motion } from "framer-motion";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function XPBar({ currentXP, maxXP, level, showLabel = true, size = "md" }: XPBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/40">
              <span className="text-sm font-bold text-primary">{level}</span>
            </div>
            <span className="text-sm font-medium">Level {level}</span>
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className={`relative w-full ${sizeClasses[size]} bg-muted rounded-full overflow-hidden`}>
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-chart-2 to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ left: ["-20%", "120%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
