import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from '@/components/ui/use-toast';
import { MoreVertical, Pencil, Trash2, Users, UserPlus } from 'lucide-react';
import { Team } from '@/components/TeamList';
import { UserProfile } from '@/components/ProfileCard';
import TeamList from '@/components/TeamList';
import TeamDashboard from '@/components/TeamDashboard';
import TeamTab from '@/components/TeamTab';
import { useAuth } from '@/context/AuthContext';
import { supabase, TeamJoinRequest } from '@/integrations/supabase/client';
import { supabaseApi, showResponseToast } from '@/integrations/supabase/api';
import { transformTeamsFromDB, transformTeamToDB } from '@/utils/dataTransformers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TeamsProps {
  userProfile?: UserProfile | null;
}

const Teams: React.FC<TeamsProps> = ({ userProfile }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const [isProcessRequestsOpen, setIsProcessRequestsOpen] = useState(false);
  const [teamToProcessRequests, setTeamToProcessRequests] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamProjectIdea, setTeamProjectIdea] = useState('');
  const [isRecruiting, setIsRecruiting] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.getMany('teams');
      if (response.data) {
        const transformedTeams = transformTeamsFromDB(Array.isArray(response.data) ? response.data : []);
        setTeams(transformedTeams);
      } else if (response.error) {
        console.error('Error fetching teams:', response.error);
        toast({
          title: "Failed to load teams",
          description: `Error: ${response.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Failed to load teams",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const handleTeamCreate = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!teamName || !teamDescription || !teamProjectIdea) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to create a team.",
        variant: "destructive",
      });
      return;
    }

    try {
      const teamData = transformTeamToDB({
        name: teamName,
        description: teamDescription,
        projectIdea: teamProjectIdea,
        isRecruiting: isRecruiting
      });
      
      // Add timestamps
      teamData.created_at = new Date().toISOString();
      teamData.updated_at = new Date().toISOString();

      const response = await supabaseApi.insert('teams', teamData);

      if (response.error) {
        toast({
          title: "Team Creation Failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Team Created",
        description: "Your team has been successfully created.",
      });

      setIsCreateTeamOpen(false);
      setTeamName('');
      setTeamDescription('');
      setTeamProjectIdea('');
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Creation Failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleTeamUpdate = async () => {
    if (!user || !selectedTeam) {
      navigate('/auth');
      return;
    }

    if (!teamName || !teamDescription || !teamProjectIdea) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to update the team.",
        variant: "destructive",
      });
      return;
    }

    try {
      const teamData = transformTeamToDB({
        name: teamName,
        description: teamDescription,
        projectIdea: teamProjectIdea,
        isRecruiting: isRecruiting
      });
      
      // Add updated timestamp
      teamData.updated_at = new Date().toISOString();

      const response = await supabaseApi.update('teams', selectedTeam.id, teamData);

      if (response.error) {
        toast({
          title: "Team Update Failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Team Updated",
        description: "Your team has been successfully updated.",
      });

      setIsEditTeamOpen(false);
      setTeamName('');
      setTeamDescription('');
      setTeamProjectIdea('');
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: "Update Failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleTeamDelete = async () => {
    if (!user || !selectedTeam) {
      navigate('/auth');
      return;
    }

    try {
      const response = await supabaseApi.delete('teams', selectedTeam.id);

      if (response.error) {
        toast({
          title: "Team Deletion Failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Team Deleted",
        description: "Your team has been successfully deleted.",
      });

      setIsDeleteTeamOpen(false);
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Deletion Failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  const handleJoinRequest = (teamId: string) => {
    console.log(`Request to join team with ID: ${teamId}`);
  };

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailsOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamName(team.name);
    setTeamDescription(team.description || '');
    setTeamProjectIdea(team.projectIdea || '');
    setIsRecruiting(team.isRecruiting || true);
    setIsEditTeamOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteTeamOpen(true);
  };

  const handleProcessRequests = (team: Team) => {
    setTeamToProcessRequests(team);
    setIsProcessRequestsOpen(true);
  };

  const filteredTeams = teams.filter(team => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm =
      team.name.toLowerCase().includes(searchTermLower) ||
      (team.description && team.description.toLowerCase().includes(searchTermLower)) ||
      (team.projectIdea && team.projectIdea.toLowerCase().includes(searchTermLower));

    return matchesSearchTerm;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Teams</h1>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search for teams..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 lg:w-1/3"
        />
      </div>

      <TeamTab
        teams={filteredTeams}
        isLoadingTeams={isLoading}
        searchTerm={searchTerm}
        activeFilters={activeFilters}
        onJoinRequest={handleJoinRequest}
        onViewDetails={handleViewDetails}
        refreshTeams={fetchTeams}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedTeam?.name}</DialogTitle>
            <DialogDescription>
              {selectedTeam?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-idea" className="text-right">
                Project Idea
              </Label>
              <Input
                type="text"
                id="project-idea"
                value={selectedTeam?.projectIdea || 'No project idea provided.'}
                className="col-span-3"
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Create a new team for the hackathon.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                type="text"
                id="description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-idea" className="text-right">
                Project Idea
              </Label>
              <Input
                type="text"
                id="project-idea"
                value={teamProjectIdea}
                onChange={(e) => setTeamProjectIdea(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-recruiting" className="text-right">
                Recruiting?
              </Label>
              <input
                type="checkbox"
                id="is-recruiting"
                checked={isRecruiting}
                onChange={(e) => setIsRecruiting(e.target.checked)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleTeamCreate}>Create team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Edit the details of the selected team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                type="text"
                id="description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-idea" className="text-right">
                Project Idea
              </Label>
              <Input
                type="text"
                id="project-idea"
                value={teamProjectIdea}
                onChange={(e) => setTeamProjectIdea(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-recruiting" className="text-right">
                Recruiting?
              </Label>
              <input
                type="checkbox"
                id="is-recruiting"
                checked={isRecruiting}
                onChange={(e) => setIsRecruiting(e.target.checked)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleTeamUpdate}>Update team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteTeamOpen} onOpenChange={setIsDeleteTeamOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" onClick={handleTeamDelete}>Delete team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DialogTrigger asChild>
        <Button variant="outline">Create Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Make a new team to collaborate with other people.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project_idea" className="text-right">
              Project Idea
            </Label>
            <Input id="project_idea" value={teamProjectIdea} onChange={(e) => setTeamProjectIdea(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleTeamCreate}>Create Team</Button>
        </DialogFooter>
      </DialogContent>

      {teamToProcessRequests && (
        <ProcessRequestsDialog
          team={teamToProcessRequests}
          open={isProcessRequestsOpen}
          onClose={() => setIsProcessRequestsOpen(false)}
          onTeamUpdated={fetchTeams}
        />
      )}
    </div>
  );
};

interface ProcessRequestsDialogProps {
  team: Team;
  open: boolean;
  onClose: () => void;
  onTeamUpdated: () => void;
}

const ProcessRequestsDialog: React.FC<ProcessRequestsDialogProps> = ({ 
  team, 
  open, 
  onClose, 
  onTeamUpdated 
}) => {
  const [requests, setRequests] = useState<TeamJoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchRequests();
  }, [team]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.getMany<TeamJoinRequest[]>('team_join_requests', {
        filters: { team_id: team.id, status: 'pending' }
      });

      if (response.error) {
        toast({
          title: "Failed to load requests",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      if (response.data) {
        setRequests(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Failed to load requests",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processRequest = async (status: string, request: TeamJoinRequest) => {
    if (!user) return;
    
    setProcessing(true);
    
    try {
      const response = await supabaseApi.rpc(
        'process_join_request',
        { 
          p_request_id: request.id, 
          p_status: status, 
          p_admin_user_id: user.id 
        }
      );
      
      if (response.error) {
        toast({
          title: "Request Failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Request Processed",
        description: `The join request has been ${status}.`,
      });
      
      onClose();
      if (onTeamUpdated) onTeamUpdated();
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Join Requests for {team.name}</DialogTitle>
          <DialogDescription>
            Approve or deny pending join requests for this team.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-4">No pending join requests.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests.map(request => (
              <li key={request.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    Request from user {request.user_id}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => processRequest('approved', request)}
                      disabled={processing}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => processRequest('denied', request)}
                      disabled={processing}
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <DialogFooter>
          <Button type="submit" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Teams;
