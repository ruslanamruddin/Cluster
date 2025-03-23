
import { Github, Linkedin, Globe, MapPin, Calendar, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlassmorphicCard from "./GlassmorphicCard";
import SkillTag, { SkillLevel } from "./SkillTag";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SocialLink {
  type: "github" | "linkedin" | "website";
  url: string;
}

export interface SocialProfileProps {
  id: string;
  name: string;
  title: string;
  location?: string;
  avatar?: string;
  bio: string;
  skills: Skill[];
  experience?: {
    years: number;
    companies: string[];
  };
  links: SocialLink[];
  onInvite?: (id: string) => void;
}

const SocialProfileCard = ({
  id,
  name,
  title,
  location,
  avatar,
  bio,
  skills,
  experience,
  links,
  onInvite
}: SocialProfileProps) => {
  // Icon mapping
  const linkIcons = {
    github: Github,
    linkedin: Linkedin,
    website: Globe
  };

  return (
    <GlassmorphicCard className="w-full max-w-lg shadow-neon-glow">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar and basic info */}
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-3">
            {avatar ? (
              <AvatarImage src={avatar} alt={name} />
            ) : (
              <AvatarFallback className="text-xl">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
          
          {/* Social links */}
          <div className="flex space-x-2 mt-2">
            {links.map((link, index) => {
              const LinkIcon = linkIcons[link.type];
              return (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
        
        <div className="flex-1">
          {/* Name, title, location */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-muted-foreground">{title}</p>
            
            <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2 text-sm text-muted-foreground">
              {location && (
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{location}</span>
                </div>
              )}
              
              {experience && (
                <div className="flex items-center">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  <span>{experience.years}+ years</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Bio */}
          <p className="text-sm mb-4">{bio}</p>
          
          {/* Skills */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <SkillTag 
                  key={index}
                  name={skill.name}
                  level={skill.level}
                />
              ))}
            </div>
          </div>
          
          {/* Experience */}
          {experience && experience.companies && experience.companies.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-1">Previous Experience</h3>
              <div className="text-sm text-muted-foreground">
                {experience.companies.slice(0, 3).join(", ")}
                {experience.companies.length > 3 && ` + ${experience.companies.length - 3} more`}
              </div>
            </div>
          )}
          
          {/* Invite button */}
          {onInvite && (
            <Button 
              className="w-full bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300 mt-2"
              onClick={() => onInvite(id)}
            >
              Invite to Team
            </Button>
          )}
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default SocialProfileCard;
