
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Shield
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Teams = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // In a real app, this would fetch team data from an API
  useEffect(() => {
    // Mock team data for demonstration
    const sampleTeams: Team[] = [
      {
        id: '1',
        name: 'CodeCrafters',
        description: 'Building an AI-powered code assistant for hackathons',
        members: [
          {
            id: '1',
            name: 'Alex Johnson',
            avatar: '',
            title: 'Frontend Developer',
            skills: [
              { name: 'React', level: 'expert' },
              { name: 'TypeScript', level: 'intermediate' },
              { name: 'JavaScript', level: 'expert' },
              { name: 'HTML/CSS', level: 'expert' },
              { name: 'Tailwind CSS', level: 'intermediate' },
            ],
            bio: 'Frontend developer with 3 years of experience building web applications.'
          },
          {
            id: '2',
            name: 'Sam Rodriguez',
            avatar: '',
            title: 'Backend Engineer',
            skills: [
              { name: 'Node.js', level: 'expert' },
              { name: 'Python', level: 'intermediate' },
              { name: 'Database Design', level: 'expert' },
              { name: 'AWS', level: 'intermediate' },
              { name: 'Docker', level: 'beginner' }
            ],
            bio: 'Backend developer specializing in API development and database optimization.'
          }
        ],
        projectIdea: 'An AI-powered code assistant that helps hackathon participants debug their code and suggests improvements in real-time.',
        isRecruiting: true,
        skillsNeeded: ['Machine Learning', 'NLP', 'UI Design']
      },
      {
        id: '2',
        name: 'DataViz Pioneers',
        description: 'Creating interactive data visualizations for complex datasets',
        members: [
          {
            id: '3',
            name: 'Taylor Kim',
            avatar: '',
            title: 'Data Scientist',
            skills: [
              { name: 'Python', level: 'expert' },
              { name: 'Data Analysis', level: 'expert' },
              { name: 'Machine Learning', level: 'intermediate' },
              { name: 'SQL', level: 'expert' },
              { name: 'Data Visualization', level: 'expert' }
            ],
            bio: 'Data scientist with expertise in visualization techniques and statistical analysis.'
          }
        ],
        projectIdea: 'A platform that transforms complex CSV datasets into interactive and insightful visualizations with minimal setup.',
        isRecruiting: true,
        skillsNeeded: ['D3.js', 'React', 'Data Visualization', 'UI/UX Design']
      },
      {
        id: '3',
        name: 'EcoTrack',
        description: 'Sustainability tracking application for everyday decisions',
        members: [
          {
            id: '4',
            name: 'Jordan Patel',
            avatar: '',
            title: 'UX/UI Designer',
            skills: [
              { name: 'Figma', level: 'expert' },
              { name: 'UI Design', level: 'expert' },
              { name: 'Prototyping', level: 'intermediate' },
              { name: 'User Research', level: 'intermediate' },
              { name: 'HTML/CSS', level: 'beginner' }
            ],
            bio: 'Designer focused on creating intuitive and beautiful user interfaces.'
          },
          {
            id: '5',
            name: 'Morgan Williams',
            avatar: '',
            title: 'Full Stack Developer',
            skills: [
              { name: 'JavaScript', level: 'expert' },
              { name: 'React', level: 'intermediate' },
              { name: 'Node.js', level: 'beginner' },
              { name: 'MongoDB', level: 'intermediate' },
              { name: 'GraphQL', level: 'beginner' }
            ],
            bio: 'Full stack developer with a focus on creating seamless user experiences.'
          }
        ],
        projectIdea: 'A mobile app that helps users track the environmental impact of their daily choices and suggests more sustainable alternatives.',
        isRecruiting: false
      },
    ];
    
    const foundTeam = sampleTeams.find(t => t.id === id);
    
    // Simulate API request delay
    setTimeout(() => {
      setTeam(foundTeam || null);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleJoinTeam = () => {
    toast({
      title: "Join request sent",
      description: "Your request to join the team has been sent to the team admin.",
    });
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
                    
                    {team.isRecruiting && (
                      <div className="mt-4">
                        <Button onClick={handleJoinTeam} className="gap-2">
                          <UserPlus size={16} />
                          Request to Join Team
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
                            {index === 0 && (
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
            
            {team.isRecruiting && (
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Teams;
