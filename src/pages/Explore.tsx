import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProfileCard, { UserProfile } from '@/components/ProfileCard';
import TeamList, { Team } from '@/components/TeamList';
import TeamCreation from '@/components/TeamCreation';
import TeamTab from '@/components/TeamTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Users, 
  PlusCircle, 
  ArrowLeft,
  LightbulbIcon,
  UserPlus,
  Shield,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { categorizeSkills } from '@/lib/skillAnalysis';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Explore = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'active-teams' | 'create-team' | 'team-details'>('teams');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamCreation, setShowTeamCreation] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const sampleUsers: UserProfile[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: '',
      title: 'Frontend Developer',
      skills: [
        { name: 'React', level: 'expert' },
        { name: 'TypeScript', level: 'intermediate' },
        { name: 'UI/UX', level: 'intermediate' },
        { name: 'Tailwind CSS', level: 'expert' },
        { name: 'JavaScript', level: 'expert' }
      ],
      bio: 'Passionate frontend developer with 3 years of experience building web applications.',
      linkedIn: 'https://linkedin.com/in/alexjohnson'
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
      bio: 'Backend developer specializing in API development and database optimization.',
      github: 'https://github.com/samrodriguez'
    },
    {
      id: '3',
      name: 'Taylor Kim',
      avatar: '',
      title: 'Full Stack Developer',
      skills: [
        { name: 'JavaScript', level: 'expert' },
        { name: 'React', level: 'intermediate' },
        { name: 'Node.js', level: 'beginner' },
        { name: 'MongoDB', level: 'intermediate' },
        { name: 'GraphQL', level: 'beginner' }
      ],
      bio: 'Full stack developer with a focus on creating seamless user experiences.',
      linkedIn: 'https://linkedin.com/in/taylorkim'
    },
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
      bio: 'Designer focused on creating intuitive and beautiful user interfaces.',
      linkedIn: 'https://linkedin.com/in/jordanpatel'
    },
    {
      id: '5',
      name: 'Morgan Williams',
      avatar: '',
      title: 'Data Scientist',
      skills: [
        { name: 'Python', level: 'expert' },
        { name: 'Machine Learning', level: 'expert' },
        { name: 'Data Analysis', level: 'expert' },
        { name: 'TensorFlow', level: 'intermediate' },
        { name: 'SQL', level: 'intermediate' }
      ],
      bio: 'Data scientist with a background in machine learning and predictive modeling.',
      linkedIn: 'https://linkedin.com/in/morganwilliams'
    },
    {
      id: '6',
      name: 'Casey Chen',
      avatar: '',
      title: 'Mobile Developer',
      skills: [
        { name: 'Swift', level: 'expert' },
        { name: 'Kotlin', level: 'intermediate' },
        { name: 'React Native', level: 'beginner' },
        { name: 'UI Design', level: 'intermediate' },
        { name: 'Firebase', level: 'intermediate' }
      ],
      bio: 'Mobile app developer specializing in native iOS applications.',
      github: 'https://github.com/caseychen'
    }
  ];

  const activeTeams: Team[] = [
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
          ],
          bio: 'Frontend developer with 3 years of experience'
        },
        {
          id: '2',
          name: 'Sam Rodriguez',
          avatar: '',
          title: 'Backend Engineer',
          skills: [
            { name: 'Node.js', level: 'expert' },
            { name: 'Python', level: 'intermediate' },
          ],
          bio: 'Backend developer specializing in APIs'
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
          ],
          bio: 'Data scientist with expertise in visualization'
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
          ],
          bio: 'Designer focused on creating intuitive interfaces'
        },
        {
          id: '5',
          name: 'Morgan Williams',
          avatar: '',
          title: 'Full Stack Developer',
          skills: [
            { name: 'React', level: 'intermediate' },
            { name: 'Node.js', level: 'intermediate' },
          ],
          bio: 'Full stack developer with focus on sustainable tech'
        },
        {
          id: '6',
          name: 'Casey Chen',
          avatar: '',
          title: 'Mobile Developer',
          skills: [
            { name: 'React Native', level: 'expert' },
            { name: 'UI Design', level: 'intermediate' },
          ],
          bio: 'Mobile app developer specializing in React Native'
        }
      ],
      projectIdea: 'A mobile app that helps users track the environmental impact of their daily choices and suggests more sustainable alternatives.',
      isRecruiting: false
    }
  ];

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
          ],
          bio: 'Frontend developer with 3 years of experience'
        },
        {
          id: '2',
          name: 'Sam Rodriguez',
          avatar: '',
          title: 'Backend Engineer',
          skills: [
            { name: 'Node.js', level: 'expert' },
            { name: 'Python', level: 'intermediate' },
          ],
          bio: 'Backend developer specializing in APIs'
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
          ],
          bio: 'Data scientist with expertise in visualization'
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
          ],
          bio: 'Designer focused on creating intuitive interfaces'
        },
        {
          id: '5',
          name: 'Morgan Williams',
          avatar: '',
          title: 'Full Stack Developer',
          skills: [
            { name: 'React', level: 'intermediate' },
            { name: 'Node.js', level: 'intermediate' },
          ],
          bio: 'Full stack developer with focus on sustainable tech'
        }
      ],
      projectIdea: 'A mobile app that helps users track the environmental impact of their daily choices and suggests more sustainable alternatives.',
      isRecruiting: false
    },
  ];

  const fetchTeams = async () => {
    try {
      setIsLoadingTeams(true);
      
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          description,
          projectIdea,
          isRecruiting,
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
        .order('created_at', { ascending: false });
      
      if (teamsError) throw teamsError;
      
      const transformedTeams: Team[] = teamsData.map(teamData => {
        const members: UserProfile[] = teamData.team_members
          .filter((member: any) => member.profiles) 
          .map((member: any) => ({
            id: member.profiles.id,
            name: member.profiles.name,
            avatar: member.profiles.avatar_url || '',
            title: member.profiles.title || '',
            bio: member.profiles.bio || '',
            skills: [], 
          }));
          
        const skillsNeeded = teamData.team_skills_needed
          .filter((skill: any) => skill.skills) 
          .map((skill: any) => skill.skills.name);
        
        return {
          id: teamData.id,
          name: teamData.name,
          description: teamData.description || '',
          members,
          projectIdea: teamData.projectIdea || '',
          isRecruiting: teamData.isRecruiting,
          skillsNeeded,
        };
      });
      
      setTeams(transformedTeams);
      
      if (id) {
        const foundTeam = transformedTeams.find(t => t.id === id);
        if (foundTeam) {
          setSelectedTeam(foundTeam);
          setActiveTab('team-details');
        }
      }
      
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Failed to load teams",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          title,
          bio,
          avatar_url,
          github,
          linkedin,
          user_skills (
            level,
            skill_id,
            skills (
              id,
              name
            )
          )
        `);
      
      if (profilesError) throw profilesError;
      
      const transformedUsers: UserProfile[] = profilesData.map(profile => ({
        id: profile.id,
        name: profile.name || 'HackHub Member',
        title: profile.title || 'HackHub Member',
        bio: profile.bio || 'No bio provided',
        avatar: profile.avatar_url || '',
        github: profile.github || '',
        linkedIn: profile.linkedin || '',
        skills: (profile.user_skills || [])
          .filter((skill: any) => skill?.skills) // Filter out any null skills
          .map((skill: any) => ({
            name: skill.skills.name,
            level: skill.level
          }))
      }));
      
      console.log('Fetched users with skills:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Failed to load users",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
    
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('create') === 'true') {
      setShowTeamCreation(true);
      setActiveTab('create-team');
    }
  }, [location.search]);
  
  useEffect(() => {
    if (id) {
      const foundTeam = teams.find(t => t.id === id);
      if (foundTeam) {
        setSelectedTeam(foundTeam);
        setActiveTab('team-details');
      }
    } else {
      setSelectedTeam(null);
      if (activeTab === 'team-details') {
        setActiveTab('teams');
      }
    }
  }, [id, teams]);

  const availableFilters = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 
    'UI/UX', 'Database', 'Machine Learning', 'Mobile', 'Data Visualization'
  ];

  const handleInvite = (id: string) => {
    toast({
      title: "Invitation sent",
      description: "An invitation has been sent to join your team.",
    });
  };
  
  const handleJoinRequest = (teamId: string) => {
    toast({
      title: "Join request sent",
      description: "Your request to join the team has been sent to the team admin.",
    });
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  const handleTeamCreated = (team: {
    name: string;
    description: string;
    members: UserProfile[];
    projectIdea: string;
  }) => {
    fetchTeams();
    
    setActiveTab('teams');
    setShowTeamCreation(false);
    
    toast({
      title: "Team created",
      description: "Your team has been successfully created.",
    });
  };

  const handleViewTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setActiveTab('team-details');
    navigate(`/explore/${team.id}`);
  };

  const handleBackToTeams = () => {
    setSelectedTeam(null);
    setActiveTab('teams');
    navigate('/explore');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.some(filter => 
        user.skills.some(skill => skill.name.toLowerCase().includes(filter.toLowerCase()))
      );
    
    return matchesSearch && matchesFilters;
  });
  
  const filteredTeams = teams.filter(team => {
    const matchesSearch = searchTerm === '' || 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.projectIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.skillsNeeded && team.skillsNeeded.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilters = activeFilters.length === 0 || 
      (team.skillsNeeded && activeFilters.some(filter => 
        team.skillsNeeded!.some(skill => skill.toLowerCase().includes(filter.toLowerCase()))
      ));
    
    return matchesSearch && matchesFilters;
  });

  const filteredActiveTeams = activeTeams.filter(team => {
    const matchesSearch = searchTerm === '' || 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.projectIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some(member => member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.skillsNeeded && team.skillsNeeded.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilters = activeFilters.length === 0 || 
      (team.skillsNeeded && activeFilters.some(filter => 
        team.skillsNeeded!.some(skill => skill.toLowerCase().includes(filter.toLowerCase()))
      ));
    
    return matchesSearch && matchesFilters;
  });

  if (activeTab === 'team-details' && selectedTeam) {
    const allTeamSkills = selectedTeam.members.flatMap(member => member.skills);
    const skillCounts = allTeamSkills.reduce((acc, skill) => {
      acc[skill.name] = (acc[skill.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const teamSkillNames = new Set(allTeamSkills.map(skill => skill.name));
    const skillGaps = selectedTeam.skillsNeeded?.filter(skill => !teamSkillNames.has(skill)) || [];
    
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-4 gap-2"
            onClick={handleBackToTeams}
          >
            <ArrowLeft size={16} />
            Back to Teams
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedTeam.name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {selectedTeam.description}
                      </CardDescription>
                    </div>
                    {selectedTeam.isRecruiting && (
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
                    <p className="mt-2 text-muted-foreground">{selectedTeam.projectIdea}</p>
                  </div>
                  
                  {selectedTeam.isRecruiting && skillGaps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Skills Needed
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skillGaps.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      {selectedTeam.isRecruiting && (
                        <div className="mt-4">
                          <Button onClick={() => handleJoinRequest(selectedTeam.id)} className="gap-2">
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
                      Team Members ({selectedTeam.members.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTeam.members.map((member, index) => (
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
              
              {selectedTeam.isRecruiting && (
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
                      onClick={() => handleJoinRequest(selectedTeam.id)} 
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
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">
            {activeTab === 'members' 
              ? 'Find Teammates' 
              : activeTab === 'teams' || activeTab === 'active-teams'
                ? 'Find Teams' 
                : 'Create Team'}
          </h1>
          
          <div className="flex items-center gap-2">
            {activeTab !== 'create-team' && (
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Search size={18} />
                </div>
                <Input
                  type="search"
                  placeholder={`Search for ${
                    activeTab === 'members' 
                      ? 'skills, roles...' 
                      : 'teams, projects...'
                  }`}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            
            {!showTeamCreation && activeTab !== 'create-team' && user && (
              <Button 
                onClick={() => {
                  setShowTeamCreation(true);
                  setActiveTab('create-team');
                }}
                className="whitespace-nowrap"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            )}
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            if (value !== 'create-team') {
              setShowTeamCreation(false);
            }
            setActiveTab(value as 'members' | 'teams' | 'active-teams' | 'create-team' | 'team-details');
          }} 
          className="w-full mb-6"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="members">Find Teammates</TabsTrigger>
          </TabsList>

          {activeTab !== 'create-team' && activeTab !== 'team-details' && (
            <div className="mb-6 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Filter size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium">Filter by skills:</span>
                
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={clearFilters}
                  >
                    <X size={14} className="mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availableFilters.map(filter => (
                  <Badge
                    key={filter}
                    variant={activeFilters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <TabsContent value="teams" className="mt-0">
            <TeamTab
              teams={filteredTeams}
              isLoadingTeams={isLoadingTeams}
              searchTerm={searchTerm}
              activeFilters={activeFilters}
              onJoinRequest={handleJoinRequest}
              onViewDetails={handleViewTeamDetails}
              refreshTeams={fetchTeams}
            />
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingUsers ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <ProfileCard
                    key={user.id}
                    profile={user}
                    onInvite={handleInvite}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No members found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                  {(searchTerm || activeFilters.length > 0) && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="create-team" className="mt-0">
            {(showTeamCreation || activeTab === 'create-team') && (
              <TeamCreation 
                availableMembers={sampleUsers} 
                onTeamCreated={handleTeamCreated} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Explore;
