import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { UserProfile } from './ProfileCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Users, X, Plus, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Hackathon {
  id: string;
  name: string;
}

interface TeamCreationProps {
  availableMembers: UserProfile[];
  onTeamCreated: (team: {
    name: string;
    description: string;
    members: UserProfile[];
    projectIdea: string;
  }) => void;
}

const TeamCreation: React.FC<TeamCreationProps> = ({ 
  availableMembers, 
  onTeamCreated 
}) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<UserProfile[]>([]);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string>('');
  const [loadingHackathons, setLoadingHackathons] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoadingHackathons(true);
      const { data, error } = await supabase
        .from('hackathons')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) throw error;
      
      setHackathons(data || []);
      
      // If there's only one hackathon, select it by default
      if (data && data.length === 1) {
        setSelectedHackathon(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast({
        title: "Failed to load hackathons",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingHackathons(false);
    }
  };

  const handleAddMember = (member: UserProfile) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleRemoveMember = (id: string) => {
    setSelectedMembers(selectedMembers.filter(member => member.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a team",
        variant: "destructive",
      });
      return;
    }
    
    if (!teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please provide a name for your team",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedMembers.length === 0) {
      toast({
        title: "Team members required",
        description: "Please add at least one team member",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create team in Supabase
      const teamData = {
        name: teamName,
        description,
        project_idea: projectIdea,
        is_recruiting: true,
        hackathon_id: selectedHackathon || null
      };
      
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert(teamData)
        .select()
        .single();
      
      if (teamError) throw teamError;
      
      // Add team members
      const teamMembersToInsert = selectedMembers.map((member, index) => ({
        team_id: team.id,
        user_id: member.id,
        is_admin: index === 0, // First member is admin
      }));
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert(teamMembersToInsert);
      
      if (memberError) throw memberError;
      
      // Reset form
      setTeamName('');
      setDescription('');
      setProjectIdea('');
      setSelectedMembers([]);
      setSelectedHackathon('');
      
      // Call the callback to update UI
      onTeamCreated({
        name: teamName,
        description,
        members: selectedMembers,
        projectIdea,
      });
      
      toast({
        title: "Team created successfully",
        description: `${teamName} has been created with ${selectedMembers.length} members.`,
      });
      
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Failed to create team",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const remainingMembers = availableMembers.filter(
    member => !selectedMembers.find(m => m.id === member.id)
  );

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a Team</CardTitle>
          <CardDescription>
            Build your dream team for the hackathon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hackathon">Hackathon</Label>
            <Select 
              value={selectedHackathon} 
              onValueChange={setSelectedHackathon}
              disabled={loadingHackathons}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hackathon" />
              </SelectTrigger>
              <SelectContent>
                {hackathons.map(hackathon => (
                  <SelectItem key={hackathon.id} value={hackathon.id}>
                    {hackathon.name}
                  </SelectItem>
                ))}
                {hackathons.length === 0 && !loadingHackathons && (
                  <SelectItem value="none" disabled>
                    No active hackathons
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Team Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your team and its goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Team Members</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="h-8 text-xs"
                onClick={() => setShowMemberSelector(!showMemberSelector)}
              >
                <Plus size={14} className="mr-1" />
                Add Member
              </Button>
            </div>
            
            {selectedMembers.length > 0 ? (
              <div className="flex flex-col gap-2 mt-2">
                {selectedMembers.map((member, index) => (
                  <div 
                    key={member.id}
                    className="flex justify-between items-center p-2 rounded-md border border-border bg-card"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.title}</p>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs mt-1">Team Admin</Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-md p-4 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 h-24">
                <Users size={24} className="opacity-50" />
                <p className="text-sm">No members added yet</p>
              </div>
            )}
          </div>
          
          {showMemberSelector && (
            <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Available Members</p>
              <div className="space-y-2">
                {remainingMembers.length > 0 ? (
                  remainingMembers.map(member => (
                    <div 
                      key={member.id}
                      className="flex justify-between items-center p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.skills.slice(0, 3).map(skill => (
                              <Badge 
                                key={skill.name} 
                                variant="secondary"
                                className="text-xs py-0 px-1.5"
                              >
                                {skill.name}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{member.skills.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleAddMember(member)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No more members available
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="project-idea">Project Idea</Label>
            <Textarea
              id="project-idea"
              placeholder="Describe your project idea..."
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="flex items-center" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Create Team
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TeamCreation;
