
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Badge
} from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Alert,
  AlertTitle,
  AlertDescription 
} from "@/components/ui/alert";
import { UserPlus, ExternalLink, Brain, Github, AlertTriangle } from 'lucide-react';

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  skills: Skill[];
  bio: string;
  linkedIn?: string;
  github?: string;
  skillsAnalyzed?: boolean;
}

interface ProfileCardProps {
  profile: UserProfile;
  onInvite?: (userId: string) => void;
  isTeamMember?: boolean;
  showSkillsCount?: boolean;
  showWarning?: boolean;
  warningMessage?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onInvite,
  isTeamMember = false,
  showSkillsCount = false,
  showWarning = false,
  warningMessage = 'This profile has some missing information.'
}) => {
  const getSkillBadgeColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'expert':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Count skills by level
  const skillCounts = profile.skills.reduce((acc, skill) => {
    acc[skill.level] = (acc[skill.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50">
      {showWarning && (
        <Alert variant="warning" className="mx-6 mt-6 mb-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm font-medium">Warning</AlertTitle>
          <AlertDescription className="text-xs">
            {warningMessage}
          </AlertDescription>
        </Alert>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex space-x-4 items-center">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              <CardDescription>{profile.title}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {profile.linkedIn && (
              <a 
                href={profile.linkedIn} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="LinkedIn Profile"
              >
                <ExternalLink size={18} />
              </a>
            )}
            {profile.github && (
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub Profile"
              >
                <Github size={18} />
              </a>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>
        
        {profile.skillsAnalyzed && (
          <div className="mb-2 flex items-center">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
              <Brain size={12} />
              AI-Analyzed Skills
            </Badge>
          </div>
        )}
        
        <div className="space-y-3">
          {Object.entries(
            profile.skills.reduce((acc, skill) => {
              if (!acc[skill.level]) acc[skill.level] = [];
              acc[skill.level].push(skill);
              return acc;
            }, {} as Record<string, Skill[]>)
          ).map(([level, skills]) => (
            <div key={level} className="space-y-1">
              <div className="text-xs text-muted-foreground capitalize">{level}</div>
              <div className="flex flex-wrap gap-1">
                {skills.map(skill => (
                  <Badge 
                    key={skill.name} 
                    variant="secondary"
                    className={`${getSkillBadgeColor(skill.level)} transition-all duration-200`}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {!isTeamMember && onInvite && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onInvite(profile.id)}
              className="w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite to Team
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
