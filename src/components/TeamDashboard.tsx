
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  UserPlus, 
  LogOut, 
  Edit2, 
  Save, 
  X, 
  AlertCircle,
  Sparkles 
} from 'lucide-react';
import { Team } from './TeamList';
import { UserProfile } from './ProfileCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TeamDashboardProps {
  userTeams: Team[];
  refreshTeams: () => Promise<void>;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ 
  userTeams,
  refreshTeams
}) => {
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editedProjectIdea, setEditedProjectIdea] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewTeam = (teamId: string) => {
    navigate(`/explore/${teamId}`);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team.id);
    setEditedProjectIdea(team.projectIdea);
    setEditedDescription(team.description);
  };

  const handleCancelEdit = () => {
    setEditingTeam(null);
    setEditedProjectIdea('');
    setEditedDescription('');
  };

  const handleSaveTeamChanges = async (teamId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('teams')
        .update({
          project_idea: editedProjectIdea,
          description: editedDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', teamId);
      
      if (error) throw error;
      
      await refreshTeams();
      setEditingTeam(null);
      
      toast({
        title: "Team updated",
        description: "Team information has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: "Update failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get the team to check if user is the last member
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('id, is_admin')
        .eq('team_id', teamId);
      
      if (membersError) throw membersError;
      
      const isLastMember = teamMembers.length === 1;
      const isAdmin = teamMembers.some(member => member.is_admin);
      
      if (isLastMember) {
        // If user is the last member, ask if they want to delete the team
        if (!window.confirm("You are the last member of this team. Leaving will delete the team. Are you sure?")) {
          setIsLoading(false);
          return;
        }
        
        // Delete the team
        const { error: deleteError } = await supabase
          .from('teams')
          .delete()
          .eq('id', teamId);
          
        if (deleteError) throw deleteError;
        
        toast({
          title: "Team deleted",
          description: "The team has been deleted as you were the last member.",
        });
      } else {
        // Just remove the user from the team
        const { error: leaveError } = await supabase
          .from('team_members')
          .delete()
          .match({ 
            team_id: teamId,
            user_id: user.id
          });
          
        if (leaveError) throw leaveError;
        
        toast({
          title: "Team left",
          description: "You have successfully left the team.",
        });
      }
      
      await refreshTeams();
    } catch (error) {
      console.error('Error leaving team:', error);
      toast({
        title: "Action failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (userTeams.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Users className="h-8 w-8 text-primary/80" />
          </div>
          <h3 className="text-lg font-medium mb-2">You're not in any teams yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Join a team to collaborate with other hackathon participants or create your own team.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/explore')} variant="outline">
              Find Teams
            </Button>
            <Button onClick={() => navigate('/explore?create=true')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Your Teams
      </h2>
      
      {userTeams.map(team => (
        <Card key={team.id} className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex justify-between items-start">
              <span>{team.name}</span>
              <Badge 
                variant={team.isRecruiting ? "default" : "secondary"} 
                className="ml-2"
              >
                {team.isRecruiting ? 'Recruiting' : 'Closed'}
              </Badge>
            </CardTitle>
            
            {editingTeam !== team.id ? (
              <CardDescription className="line-clamp-2">{team.description}</CardDescription>
            ) : (
              <div className="mt-2">
                <Input
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Team description"
                  className="mb-2"
                />
              </div>
            )}
          </CardHeader>
          
          <CardContent className="pb-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Project Idea</h3>
              {editingTeam !== team.id ? (
                <p className="text-sm text-muted-foreground">{team.projectIdea}</p>
              ) : (
                <Textarea
                  value={editedProjectIdea}
                  onChange={(e) => setEditedProjectIdea(e.target.value)}
                  placeholder="Project idea"
                  rows={3}
                />
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Team Members ({team.members.length})</h3>
              <div className="flex -space-x-2 overflow-hidden">
                {team.members.map((member) => (
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
          </CardContent>
          
          <CardFooter className="pt-2 flex justify-between">
            {editingTeam !== team.id ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewTeam(team.id)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditTeam(team)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleSaveTeamChanges(team.id)}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleLeaveTeam(team.id)}
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Leave
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TeamDashboard;
