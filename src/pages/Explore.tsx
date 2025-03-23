import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProfileCard, { UserProfile } from '@/components/ProfileCard';
import TeamList, { Team } from '@/components/TeamList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'active-teams'>('active-teams');

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

  const filteredUsers = sampleUsers.filter(user => {
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
  
  const filteredTeams = sampleTeams.filter(team => {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">
            {activeTab === 'members' 
              ? 'Find Teammates' 
              : activeTab === 'teams' 
                ? 'Find Teams' 
                : 'Active Teams'}
          </h1>
          
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
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'members' | 'teams' | 'active-teams')} className="w-full mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="active-teams">Active Teams</TabsTrigger>
            <TabsTrigger value="members">Find Teammates</TabsTrigger>
            <TabsTrigger value="teams">Find Teams</TabsTrigger>
          </TabsList>
        
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
          
          <TabsContent value="active-teams" className="mt-0">
            <TeamList 
              teams={filteredActiveTeams}
              onJoinRequest={handleJoinRequest}
            />
            
            {filteredActiveTeams.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No active teams found</h3>
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
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <ProfileCard
                  key={user.id}
                  profile={user}
                  onInvite={handleInvite}
                />
              ))}

              {filteredUsers.length === 0 && (
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
          
          <TabsContent value="teams" className="mt-0">
            <TeamList 
              teams={filteredTeams}
              onJoinRequest={handleJoinRequest}
            />
            
            {filteredTeams.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No teams found</h3>
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Explore;
