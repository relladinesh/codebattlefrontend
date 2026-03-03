import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AvatarDisplayProps {
  username: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function AvatarDisplay({ username, color = "#8B5CF6", size = "md", className = "" }: AvatarDisplayProps) {
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback
        style={{ backgroundColor: color }}
        className="text-white font-bold"
      >
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
