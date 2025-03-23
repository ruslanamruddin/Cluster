
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  UserPlus, 
  LogOut, 
  Edit2, 
  Save, 
  X, 
  AlertCircle,
  Sparkles,
  BellDot,
  MessageSquare
} from 'lucide-react';
import { Team } from './TeamList';
import { UserProfile } from './ProfileCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TeamJoinRequests from './TeamJoinRequests';
import TeamChat from './TeamChat';

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
  const [requestCounts, setRequestCounts] = useState<Record<string, number>>({});
  const [userRoles, setUserRoles] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("details");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (userTeams.length > 0) {
      setSelectedTeam(userTeams[0]);
      fetchTeamAdminStatus(userTeams);
      fetchPendingRequestCounts(userTeams);
    }
  }, [userTeams]);

  const fetchTeamAdminStatus = async (teams: Team[]) => {
    if (!user) return;
    
    try {
      // For each team, check if current user is an admin
      const promises = teams.map(async (team) => {
        const { data, error } = await supabase
          .from('team_members')
          .select('is_admin')
          .eq('team_id', team.id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        return { teamId: team.id, isAdmin: data?.is_admin || false };
      });
      
      const results = await Promise.all(promises);
      
      const rolesMap: Record<string, boolean> = {};
      results.forEach(result => {
        rolesMap[result.teamId] = result.isAdmin;
      });
      
      setUserRoles(rolesMap);
    } catch (error) {
      console.error('Error fetching admin status:', error);
    }
  };

  const fetchPendingRequestCounts = async (teams: Team[]) => {
    if (!user) return;
    
    try {
      // For each team, get count of pending requests if user is admin
      const promises = teams.map(async (team) => {
        const { data, error } = await supabase
          .from('team_join_requests')
          .select('id', { count: 'exact' })
          .eq('team_id', team.id)
          .eq('status', 'pending');
        
        if (error) throw error;
        
        return { teamId: team.id, count: data?.length || 0 };
      });
      
      const results = await Promise.all(promises);
      
      const countsMap: Record<string, number> = {};
      results.forEach(result => {
        countsMap[result.teamId] = result.count;
      });
      
      setRequestCounts(countsMap);
    } catch (error) {
      console.error('Error fetching request counts:', error);
    }
  };

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

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          {userTeams.map(team => (
            <Card 
              key={team.id} 
              className={`overflow-hidden cursor-pointer hover:border-primary/40 transition-colors ${
                selectedTeam?.id === team.id ? 'border-primary' : ''
              }`}
              onClick={() => handleSelectTeam(team)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  {requestCounts[team.id] > 0 && userRoles[team.id] && (
                    <Badge className="bg-primary text-primary-foreground">
                      <BellDot className="h-3 w-3 mr-1" />
                      {requestCounts[team.id]}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {team.members.length} members
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <div className="md:col-span-3">
          {selectedTeam && (
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle>{selectedTeam.name}</CardTitle>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={selectedTeam.isRecruiting ? "default" : "secondary"} 
                    >
                      {selectedTeam.isRecruiting ? 'Recruiting' : 'Closed'}
                    </Badge>
                    
                    {userRoles[selectedTeam.id] && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        Team Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-0 pt-2">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger 
                      value="requests" 
                      className="flex items-center gap-1"
                      disabled={!userRoles[selectedTeam.id]}
                    >
                      <UserPlus className="h-4 w-4" />
                      Requests
                      {requestCounts[selectedTeam.id] > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                          {requestCounts[selectedTeam.id]}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <TabsContent value="details" className="m-0">
                  <CardContent className="pt-6 space-y-4">
                    {editingTeam !== selectedTeam.id ? (
                      <>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Description</h3>
                          <p className="text-sm text-muted-foreground">{selectedTeam.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Project Idea</h3>
                          <p className="text-sm text-muted-foreground">{selectedTeam.projectIdea}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Description</h3>
                          <Input
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Team description"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Project Idea</h3>
                          <Textarea
                            value={editedProjectIdea}
                            onChange={(e) => setEditedProjectIdea(e.target.value)}
                            placeholder="Project idea"
                            rows={3}
                          />
                        </div>
                      </>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Team Members ({selectedTeam.members.length})</h3>
                      <div className="flex -space-x-2 overflow-hidden">
                        {selectedTeam.members.map((member) => (
                          <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {selectedTeam.members.length > 5 && (
                          <div className="flex items-center justify-center bg-muted text-muted-foreground rounded-full border-2 border-background h-8 w-8 text-xs">
                            +{selectedTeam.members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-2 border-t">
                    {editingTeam !== selectedTeam.id ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewTeam(selectedTeam.id)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTeam(selectedTeam)}
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
                          onClick={() => handleSaveTeamChanges(selectedTeam.id)}
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
                      onClick={() => handleLeaveTeam(selectedTeam.id)}
                      disabled={isLoading}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Leave
                    </Button>
                  </CardFooter>
                </TabsContent>
                
                <TabsContent value="chat" className="m-0 p-0">
                  <TeamChat 
                    teamId={selectedTeam.id}
                    teamMembers={selectedTeam.members.map(member => ({
                      id: member.id,
                      name: member.name,
                      avatar: member.avatar
                    }))}
                  />
                </TabsContent>
                
                <TabsContent value="requests" className="m-0">
                  <CardContent className="pt-6">
                    <TeamJoinRequests 
                      teamId={selectedTeam.id}
                      isAdmin={userRoles[selectedTeam.id] || false}
                    />
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
