
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Users, UserPlus } from 'lucide-react';
import { Team } from './TeamList';
import { UserProfile } from './ProfileCard';
import TeamList from './TeamList';
import TeamDashboard from './TeamDashboard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserTeams();
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

  return (
    <div className="space-y-8">
      <TeamDashboard 
        userTeams={userTeams} 
        refreshTeams={refreshTeams}
      />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Other Teams</h2>
        <TeamList 
          teams={teams.filter(team => 
            team.isRecruiting && 
            !userTeams.some(ut => ut.id === team.id)
          )}
          onJoinRequest={onJoinRequest}
          onViewDetails={onViewDetails}
          isLoading={isLoadingTeams}
        />
      </div>
    </div>
  );
};

export default TeamTab;
