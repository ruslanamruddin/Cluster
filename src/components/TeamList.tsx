
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserProfile } from './ProfileCard';
import { Users, ArrowRight, UserPlus, Clock, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface Team {
  id: string;
  name: string;
  description: string;
  members: UserProfile[];
  projectIdea: string;  // Changed from project_idea to match our usage in Teams.tsx
  isRecruiting: boolean;
  skillsNeeded?: string[];
  hackathonId?: string;
}

interface TeamListProps {
  teams: Team[];
  onJoinRequest?: (teamId: string) => void;
  onViewDetails?: (team: Team) => void;
  isLoading?: boolean;
  joinRequests?: Record<string, string>;
}

const TeamList: React.FC<TeamListProps> = ({ 
  teams, 
  onJoinRequest, 
  onViewDetails,
  isLoading = false,
  joinRequests = {}
}) => {
  const { toast } = useToast();
  
  // Sort teams: recruiting teams first, then alphabetically
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.isRecruiting && !b.isRecruiting) return -1;
    if (!a.isRecruiting && b.isRecruiting) return 1;
    return a.name.localeCompare(b.name);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse opacity-70">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-8 bg-muted rounded-full w-8"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getJoinRequestButton = (teamId: string) => {
    const status = joinRequests[teamId];
    
    if (!status) {
      return (
        <Button 
          onClick={() => onJoinRequest && onJoinRequest(teamId)} 
          variant="outline" 
          size="sm"
          className="gap-1"
        >
          <UserPlus size={14} />
          Request to Join
        </Button>
      );
    }
    
    if (status === 'pending') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          disabled
        >
          <Clock size={14} />
          Request Pending
        </Button>
      );
    }
    
    if (status === 'approved') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          disabled
        >
          <Check size={14} />
          Approved
        </Button>
      );
    }
    
    if (status === 'rejected') {
      return (
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          disabled
        >
          <X size={14} />
          Rejected
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {sortedTeams.length > 0 ? (
        sortedTeams.map((team) => (
          <Card 
            key={team.id}
            className={`overflow-hidden transition-all hover:shadow-md ${
              team.isRecruiting ? 'border-primary/30 bg-primary/5' : ''
            }`}
          >
            {team.isRecruiting && (
              <div className="bg-primary text-primary-foreground text-xs px-4 py-1 text-center font-medium">
                Actively Recruiting
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{team.name}</CardTitle>
                {team.isRecruiting && (
                  <Badge variant="outline" className="flex items-center gap-1 border-primary/30 text-primary">
                    <UserPlus size={12} />
                    Recruiting
                  </Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {team.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Project Idea</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {team.projectIdea}
                </p>
              </div>
              
              {team.isRecruiting && team.skillsNeeded && team.skillsNeeded.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills Needed</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {team.skillsNeeded.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Team Members ({team.members.length})</h4>
                <div className="flex -space-x-2 overflow-hidden">
                  {team.members.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 5 && (
                    <div className="flex items-center justify-center bg-muted text-muted-foreground rounded-full border-2 border-background h-8 w-8 text-xs">
                      +{team.members.length - 5}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => onViewDetails && onViewDetails(team)}
                >
                  View Details
                  <ArrowRight size={14} />
                </Button>
                
                {team.isRecruiting && onJoinRequest && (
                  getJoinRequestButton(team.id)
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No teams yet</h3>
          <p className="mt-1 text-muted-foreground">
            Start by creating a new team or joining an existing one
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamList;
