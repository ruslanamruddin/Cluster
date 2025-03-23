
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TaskAssignment from '@/components/TaskAssignment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/components/ProfileCard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useHackathon } from '@/context/HackathonContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Team {
  id: string;
  name: string;
  description: string | null;
  project_idea: string | null;
}

const Tasks = () => {
  const [projectIdea, setProjectIdea] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { toast } = useToast();
  const { currentHackathon } = useHackathon();
  const { user } = useAuth();

  useEffect(() => {
    if (user && currentHackathon) {
      fetchUserTeams();
    }
  }, [user, currentHackathon]);

  useEffect(() => {
    if (selectedTeam) {
      setProjectIdea(selectedTeam.project_idea || '');
      fetchTeamMembers(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchUserTeams = async () => {
    if (!user || !currentHackathon) return;
    
    setIsLoading(true);
    try {
      // Get teams that the user is a member of in the current hackathon
      const { data: teamMemberships, error: membershipError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;
      
      if (teamMemberships && teamMemberships.length > 0) {
        const teamIds = teamMemberships.map(m => m.team_id);
        
        // Get the details of these teams
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .in('id', teamIds)
          .eq('hackathon_id', currentHackathon.id);
        
        if (teamError) throw teamError;
        
        setTeams(teamData as Team[]);
        
        // Set the first team as selected
        if (teamData && teamData.length > 0) {
          setSelectedTeam(teamData[0] as Team);
        }
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      toast({
        variant: "destructive",
        title: "Failed to load teams",
        description: `Error: ${(error as Error).message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      // Fetch team members with their profile information
      const { data, error } = await supabase
        .from('team_members_view')
        .select('*')
        .eq('team_id', teamId);
      
      if (error) throw error;
      
      // Convert the data to the UserProfile format
      const members: UserProfile[] = data.map(member => ({
        id: member.user_id,
        name: member.user_name || 'Unknown User',
        title: member.user_title || '',
        skills: [], // We'll fetch skills separately if needed
        bio: '',
        avatar: member.user_avatar,
      }));
      
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast({
        variant: "destructive",
        title: "Failed to load team members",
        description: `Error: ${(error as Error).message}`,
      });
      setTeamMembers([]);
    }
  };

  const handleTasksGenerated = (generatedTasks: any[]) => {
    setTasks(generatedTasks);
    
    toast({
      title: 'Tasks generated',
      description: `${generatedTasks.length} tasks have been generated and assigned based on team skills.`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (teams.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Task Management</h1>
          <Card>
            <CardHeader>
              <CardTitle>No Teams Found</CardTitle>
              <CardDescription>
                You need to be a member of a team to manage tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join or create a team in the teams section to get started with task management.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Task Management</h1>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>
                Select a team to manage tasks for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedTeam?.id || ''}
                  onChange={(e) => {
                    const selected = teams.find(team => team.id === e.target.value);
                    setSelectedTeam(selected || null);
                  }}
                >
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
          
          {selectedTeam && (
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
                <CardDescription>
                  Project idea from your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="E.g., We're building a real-time collaborative coding platform with AI-powered code suggestions..."
                    className="min-h-[120px]"
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                  />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {projectIdea.length} / 500 characters
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setProjectIdea(selectedTeam.project_idea || '')}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {teamMembers.length > 0 && (
            <TaskAssignment 
              projectIdea={projectIdea}
              teamMembers={teamMembers}
              onTasksGenerated={handleTasksGenerated}
            />
          )}
          
          {tasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Tasks ({tasks.length})</span>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Custom Task
                  </Button>
                </CardTitle>
                <CardDescription>
                  Tasks have been assigned based on team members' skills and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Tasks would be displayed here with more UI - using the existing component for now */}
                  <p className="text-muted-foreground">
                    View assigned tasks in the card above
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
