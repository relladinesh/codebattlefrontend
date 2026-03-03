import { motion } from "framer-motion";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
};

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  return (
    <motion.div
      className={`relative ${sizeClasses[size]} flex items-center justify-center`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />
      <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-primary to-chart-2 border-2 border-primary-foreground/20">
        <span className="font-bold text-primary-foreground">{level}</span>
      </div>
    </motion.div>
  );
}
