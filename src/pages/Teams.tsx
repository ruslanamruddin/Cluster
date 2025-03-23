import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Team } from '@/components/TeamList';
import ProfileCard from '@/components/ProfileCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { categorizeSkills } from '@/lib/skillAnalysis';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  LightbulbIcon,
  UserPlus,
  Shield,
  LogOut
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Create a new interface that extends UserProfile to include isAdmin
interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  bio: string;
  skills: any[];
  isAdmin?: boolean;
}

const Teams = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserMember, setIsUserMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch the team data
  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select(`
            id,
            name,
            description,
            project_idea,
            is_recruiting,
            team_members (
              id,
              is_admin,
              user_id,
              profiles:user_id (
                id,
                name,
                title,
                avatar_url,
                bio
              )
            ),
            team_skills_needed (
              id,
              skills:skill_id (
                id,
                name
              )
            )
          `)
          .eq('id', id)
          .single();
        
        if (teamError) throw teamError;
        
        // Transform the data
        const members: TeamMember[] = teamData.team_members
          .filter((member: any) => member.profiles)
          .map((member: any) => ({
            id: member.profiles.id,
            name: member.profiles.name,
            avatar: member.profiles.avatar_url || '',
            title: member.profiles.title || '',
            bio: member.profiles.bio || '',
            skills: [], // We'll get skills in another query
            isAdmin: member.is_admin
          }));
          
        const skillsNeeded = teamData.team_skills_needed
          .filter((skill: any) => skill.skills)
          .map((skill: any) => skill.skills.name);
        
        const transformedTeam: Team = {
          id: teamData.id,
          name: teamData.name,
          description: teamData.description || '',
          members,
          projectIdea: teamData.project_idea || '',
          isRecruiting: teamData.is_recruiting,
          skillsNeeded,
        };
        
        setTeam(transformedTeam);
        
        // Check if the user is a member of this team
        if (user) {
          const isMember = members.some(m => m.id === user.id);
          setIsUserMember(isMember);
          
          const userAdmin = members.find(m => m.id === user.id)?.isAdmin || false;
          setIsAdmin(userAdmin);
        }
        
      } catch (error) {
        console.error('Error fetching team:', error);
        toast({
          title: "Failed to load team",
          description: `Error: ${(error as Error).message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeam();
  }, [id, user]);
  
  const handleJoinTeam = () => {
    toast({
      title: "Join request sent",
      description: "Your request to join the team has been sent to the team admin.",
    });
  };
  
  const handleLeaveTeam = async () => {
    if (!user || !team) return;
    
    try {
      // Get the team to check if user is the last member
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('id, is_admin')
        .eq('team_id', team.id);
      
      if (membersError) throw membersError;
      
      const isLastMember = teamMembers.length === 1;
      
      if (isLastMember) {
        // If user is the last member, ask if they want to delete the team
        if (!window.confirm("You are the last member of this team. Leaving will delete the team. Are you sure?")) {
          return;
        }
        
        // Delete the team
        const { error: deleteError } = await supabase
          .from('teams')
          .delete()
          .eq('id', team.id);
          
        if (deleteError) throw deleteError;
        
        toast({
          title: "Team deleted",
          description: "The team has been deleted as you were the last member.",
        });
        
        // Navigate back to explore
        navigate('/explore');
      } else {
        // Just remove the user from the team
        const { error: leaveError } = await supabase
          .from('team_members')
          .delete()
          .match({ 
            team_id: team.id,
            user_id: user.id
          });
          
        if (leaveError) throw leaveError;
        
        toast({
          title: "Team left",
          description: "You have successfully left the team.",
        });
        
        // Navigate back to explore
        navigate('/explore');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      toast({
        title: "Action failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading team information...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!team) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Link to="/explore">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft size={16} />
              Back to Explore
            </Button>
          </Link>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Team not found</h3>
            <p className="text-muted-foreground max-w-md">
              The team you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/explore">
              <Button className="mt-6">
                Browse Available Teams
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Get team skill sets
  const allTeamSkills = team.members.flatMap(member => member.skills);
  const skillCounts = allTeamSkills.reduce((acc, skill) => {
    acc[skill.name] = (acc[skill.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Find skill gaps (skills needed but not present in the team)
  const teamSkillNames = new Set(allTeamSkills.map(skill => skill.name));
  const skillGaps = team.skillsNeeded?.filter(skill => !teamSkillNames.has(skill)) || [];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/explore">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft size={16} />
            Back to Explore
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{team.name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {team.description}
                    </CardDescription>
                  </div>
                  {team.isRecruiting && (
                    <Badge variant="outline" className="flex items-center gap-1 border-primary/30 text-primary">
                      <UserPlus size={12} />
                      Recruiting
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-amber-500" />
                    Project Idea
                  </h3>
                  <p className="mt-2 text-muted-foreground">{team.projectIdea}</p>
                </div>
                
                {team.isRecruiting && skillGaps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Skills Needed
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillGaps.map(skill => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    {team.isRecruiting && !isUserMember && user && (
                      <div className="mt-4">
                        <Button onClick={handleJoinTeam} className="gap-2">
                          <UserPlus size={16} />
                          Request to Join Team
                        </Button>
                      </div>
                    )}
                    
                    {isUserMember && (
                      <div className="mt-4">
                        <Button 
                          onClick={handleLeaveTeam} 
                          variant="outline"
                          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        >
                          <LogOut size={16} />
                          Leave Team
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    Team Members ({team.members.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.members.map((member, index) => (
                      <div key={member.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                        <Avatar className="h-10 w-10 border-2 border-border">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">{member.title}</p>
                            </div>
                            {(member.isAdmin || index === 0) && (
                              <Badge variant="outline" className="flex items-center gap-1 border-amber-300 text-amber-700 bg-amber-50">
                                <Shield size={10} />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.skills.slice(0, 3).map(skill => (
                              <Badge 
                                key={skill.name} 
                                variant="secondary"
                                className="text-xs py-0"
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
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Team Skills</CardTitle>
                <CardDescription>
                  Skills present in the team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categorizeSkills(allTeamSkills)).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(new Set(skills.map(skill => skill.name))).map(skillName => {
                          const count = skillCounts[skillName];
                          return (
                            <Badge 
                              key={skillName} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {skillName}
                              {count > 1 && (
                                <span className="ml-1 bg-primary/20 text-primary rounded-full px-1.5 text-xs">
                                  {count}
                                </span>
                              )}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {team.isRecruiting && !isUserMember && user && (
              <Card>
                <CardHeader className="pb-3 bg-primary/5 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Join This Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    This team is looking for members with the following skills:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skillGaps.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    onClick={handleJoinTeam} 
                    className="w-full gap-2"
                  >
                    <UserPlus size={16} />
                    Request to Join
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {isUserMember && (
              <Card>
                <CardHeader className="pb-3 bg-destructive/5 border-b">
                  <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                    <LogOut className="h-5 w-5" />
                    Leave Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to leave this team? This action cannot be undone.
                  </p>
                  <Button 
                    onClick={handleLeaveTeam} 
                    variant="outline"
                    className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <LogOut size={16} />
                    Leave Team
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Teams;
