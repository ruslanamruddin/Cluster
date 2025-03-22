
import { User } from "lucide-react";
import GlassmorphicCard from "./GlassmorphicCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileSkill {
  name: string;
  level: "beginner" | "intermediate" | "expert";
}

interface ProfileCardProps {
  name: string;
  title: string;
  skills: ProfileSkill[];
  availability: "available" | "busy" | "unavailable";
  image?: string;
}

const ProfileCard = ({ 
  name, 
  title, 
  skills, 
  availability,
  image 
}: ProfileCardProps) => {
  // Map availability to colors
  const availabilityColor = {
    available: "bg-green-500/20 text-green-300",
    busy: "bg-yellow-500/20 text-yellow-300",
    unavailable: "bg-red-500/20 text-red-300",
  };

  // Map skill level to colors
  const skillLevelColor = {
    beginner: "bg-muted/20 text-muted-foreground",
    intermediate: "bg-tech-accent1/20 text-tech-accent1",
    expert: "bg-tech-accent2/20 text-tech-accent2",
  };

  return (
    <GlassmorphicCard className="w-full max-w-sm hover:shadow-neon-glow transition-all duration-300">
      <div className="flex flex-col items-center">
        {/* Profile image */}
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-muted/20 flex items-center justify-center">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="h-10 w-10 text-muted-foreground" />
          )}
        </div>

        {/* Basic info */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-medium">{name}</h3>
          <p className="text-muted-foreground">{title}</p>
          <Badge 
            variant="outline"
            className={`mt-2 ${availabilityColor[availability]}`}
          >
            {availability === "available" ? "Available for teams" : 
             availability === "busy" ? "Limited availability" : "Currently unavailable"}
          </Badge>
        </div>

        {/* Skills */}
        <div className="w-full mb-4">
          <h4 className="text-sm font-medium mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill.name}
                variant="outline"
                className={skillLevelColor[skill.level]}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full mt-2 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 border-white/10 hover:bg-white/5 transition-colors"
          >
            View Profile
          </Button>
          <Button 
            className="flex-1 bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300"
          >
            Invite to Team
          </Button>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default ProfileCard;
