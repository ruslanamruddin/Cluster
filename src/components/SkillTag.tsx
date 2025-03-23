
import { Badge } from "@/components/ui/badge";

export type SkillLevel = "beginner" | "intermediate" | "expert";

export interface SkillTagProps {
  name: string;
  level: SkillLevel;
  className?: string;
}

const SkillTag = ({ name, level, className = "" }: SkillTagProps) => {
  // Map skill level to colors
  const levelStyles = {
    beginner: "bg-muted/20 text-muted-foreground border-muted/30",
    intermediate: "bg-tech-accent1/20 text-tech-accent1 border-tech-accent1/30",
    expert: "bg-tech-accent2/20 text-tech-accent2 border-tech-accent2/30"
  };

  return (
    <Badge 
      variant="outline" 
      className={`${levelStyles[level]} ${className}`}
    >
      {name}
      {level !== "beginner" && (
        <span className="ml-1 opacity-60">
          {level === "intermediate" ? "●●" : "●●●"}
        </span>
      )}
    </Badge>
  );
};

export default SkillTag;
