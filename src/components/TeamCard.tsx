
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Users, Calendar, ChevronRight, Zap } from "lucide-react";
import GlassmorphicCard from "./GlassmorphicCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface TeamCardProps {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  tags: string[];
  recruiting: boolean;
  onClick?: () => void;
}

const TeamCard = ({ 
  name, 
  description, 
  members, 
  tags, 
  recruiting,
  onClick
}: TeamCardProps) => {
  return (
    <GlassmorphicCard 
      className="w-full cursor-pointer hover:shadow-neon-glow transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
          </div>
          {recruiting && (
            <Badge className="bg-tech-accent1 text-black">
              Recruiting
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap mb-4">
          {tags.slice(0, 5).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-tech-accent2/20 text-tech-accent2 border-tech-accent2/30"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 5 && (
            <Badge variant="outline" className="bg-transparent">
              +{tags.length - 5} more
            </Badge>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center mb-4">
            <div className="flex -space-x-3 mr-3">
              {members.slice(0, 4).map((member, index) => (
                <Avatar key={index} className="border-2 border-tech-dark">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback className="bg-tech-accent1/20 text-tech-accent1">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
              {members.length > 4 && (
                <Avatar className="border-2 border-tech-dark bg-tech-accent2/20 text-tech-accent2">
                  <AvatarFallback>+{members.length - 4}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full bg-tech-accent1/10 hover:bg-tech-accent1/20 border-tech-accent1/20"
          >
            <span>View Team</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default TeamCard;
