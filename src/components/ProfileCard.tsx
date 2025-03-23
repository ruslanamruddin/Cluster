
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
import { UserPlus, ExternalLink } from 'lucide-react';

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
}

interface ProfileCardProps {
  profile: UserProfile;
  onInvite?: (id: string) => void;
  isTeamMember?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onInvite,
  isTeamMember = false
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

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50">
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
          {profile.linkedIn && (
            <a 
              href={profile.linkedIn} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {profile.skills.slice(0, 6).map(skill => (
            <Badge 
              key={skill.name} 
              variant="secondary"
              className={`${getSkillBadgeColor(skill.level)} transition-all duration-200`}
            >
              {skill.name}
            </Badge>
          ))}
          {profile.skills.length > 6 && (
            <Badge variant="outline">+{profile.skills.length - 6} more</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        {onInvite && !isTeamMember ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onInvite(profile.id)}
          >
            <UserPlus size={16} className="mr-2" />
            Invite to Team
          </Button>
        ) : isTeamMember ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            Team Member
          </Badge>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
