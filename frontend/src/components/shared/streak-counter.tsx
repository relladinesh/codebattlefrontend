import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCounterProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakCounter({ streak, size = "md" }: StreakCounterProps) {
  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-base gap-2",
    lg: "text-xl gap-2",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  return (
    <motion.div
      className={`flex items-center ${sizeClasses[size]}`}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [-5, 5, -5]
        }}
        transition={{ 
          duration: 0.5, 
          repeat: Infinity, 
          repeatDelay: 2 
        }}
      >
        <Flame className={`${iconSizes[size]} text-orange-500`} />
      </motion.div>
      <span className="font-bold font-mono">{streak}</span>
      <span className="text-muted-foreground">day streak</span>
    </motion.div>
  );
}
