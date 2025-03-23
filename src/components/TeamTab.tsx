import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Users, UserPlus } from 'lucide-react';
import { Team } from './TeamList';
import { useAuth } from '@/context/AuthContext';
import { supabase, JoinRequestResponse, TeamJoinRequest } from '@/integrations/supabase/client';
import { supabaseApi } from '@/integrations/supabase/api';
import TeamList from './TeamList';
import TeamDashboard from './TeamDashboard';

interface TeamTabProps {
  teams: Team[];
  isLoadingTeams: boolean;
  searchTerm: string;
  activeFilters: string[];
  onJoinRequest: (teamId: string) => void;
  onViewDetails: (team: Team) => void;
  refreshTeams: () => Promise<void>;
}

const TeamTab: React.FC<TeamTabProps> = ({
  teams,
  isLoadingTeams,
  searchTerm,
  activeFilters,
  onJoinRequest,
  onViewDetails,
  refreshTeams
}) => {
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinRequests, setJoinRequests] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserTeams();
      fetchJoinRequests();
    } else {
      setUserTeams([]);
      setIsLoading(false);
    }
  }, [user, teams]);

  const fetchUserTeams = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);
      
      if (memberError) throw memberError;
      
      if (memberData && memberData.length > 0) {
        const userTeamIds = memberData.map(m => m.team_id);
        const userTeams = teams.filter(team => userTeamIds.includes(team.id));
        setUserTeams(userTeams);
      } else {
        setUserTeams([]);
      }
    } catch (error) {
      console.error('Error fetching user teams:', error);
      toast({
        title: "Failed to load your teams",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    if (!user) return;
    
    try {
      const response = await supabaseApi.getMany<TeamJoinRequest[]>('team_join_requests', {
        select: 'team_id, status',
        filters: { user_id: user.id }
      });
      
      if (response.error) throw new Error(response.error);
      
      const requestMap: Record<string, string> = {};
      if (response.data) {
        response.data.forEach((req) => {
          requestMap[req.team_id] = req.status;
        });
      }
      
      setJoinRequests(requestMap);
    } catch (error) {
      console.error('Error fetching join requests:', error);
    }
  };

  const handleJoinRequest = async (teamId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      const response = await supabaseApi.rpc<JoinRequestResponse>(
        'request_to_join_team',
        { 
          p_team_id: teamId,
          p_user_id: user.id
        }
      );
      
      if (response.error) {
        toast({
          title: "Join Request Failed",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      
      setJoinRequests(prev => ({
        ...prev,
        [teamId]: 'pending'
      }));
      
      toast({
        title: "Join Request Sent",
        description: "Your request to join the team has been sent to the team admin.",
      });
      
      fetchJoinRequests();
    } catch (error) {
      console.error('Error sending join request:', error);
      toast({
        title: "Request Failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="space-y-8">
        <div className="bg-muted/50 border rounded-lg p-6 text-center">
          <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Join or Create a Team</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign in to create your own team or join an existing one for the hackathon.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth?signup=true')}>
              Create Account
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Available Teams</h2>
          <TeamList 
            teams={teams.filter(team => team.isRecruiting)}
            onJoinRequest={onJoinRequest}
            onViewDetails={onViewDetails}
            isLoading={isLoadingTeams}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  const availableTeams = teams.filter(team => 
    team.isRecruiting && 
    !userTeams.some(ut => ut.id === team.id)
  );

  return (
    <div className="space-y-8">
      <TeamDashboard 
        userTeams={userTeams} 
        refreshTeams={refreshTeams}
      />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Other Teams</h2>
        <TeamList 
          teams={availableTeams}
          onJoinRequest={handleJoinRequest}
          onViewDetails={onViewDetails}
          isLoading={isLoadingTeams}
          joinRequests={joinRequests}
        />
      </div>
    </div>
  );
};

export default TeamTab;
