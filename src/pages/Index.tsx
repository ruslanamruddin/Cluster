
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import TeamList, { Team } from '@/components/TeamList';
import ResumeUpload from '@/components/ResumeUpload';
import TeamCreation from '@/components/TeamCreation';
import { Skill, UserProfile } from '@/components/ProfileCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Play, UserPlus, Users, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/Auth/AuthForm';

const Index = () => {
  const [mySkills, setMySkills] = useState<Skill[]>([]);
  const { toast } = useToast();
  const [activeTeams, setActiveTeams] = useState<Team[]>([
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
  ]);
  
  const availableMembers: UserProfile[] = [
    {
      id: '7',
      name: 'Riley Thompson',
      avatar: '',
      title: 'Machine Learning Engineer',
      skills: [
        { name: 'Python', level: 'expert' },
        { name: 'TensorFlow', level: 'expert' },
        { name: 'Data Analysis', level: 'intermediate' },
        { name: 'NLP', level: 'expert' },
        { name: 'Computer Vision', level: 'intermediate' }
      ],
      bio: 'ML engineer with a focus on NLP and computer vision applications.',
      linkedIn: 'https://linkedin.com/in/rileythompson'
    },
    {
      id: '8',
      name: 'Jamie Garcia',
      avatar: '',
      title: 'UI/UX Designer',
      skills: [
        { name: 'Figma', level: 'expert' },
        { name: 'UI Design', level: 'expert' },
        { name: 'User Research', level: 'intermediate' },
        { name: 'Prototyping', level: 'expert' },
        { name: 'Accessibility', level: 'intermediate' }
      ],
      bio: 'Designer creating accessible and beautiful interfaces for web and mobile.',
      github: 'https://github.com/jamiegarcia'
    },
    {
      id: '9',
      name: 'Blake Foster',
      avatar: '',
      title: 'DevOps Engineer',
      skills: [
        { name: 'Docker', level: 'expert' },
        { name: 'Kubernetes', level: 'intermediate' },
        { name: 'AWS', level: 'expert' },
        { name: 'CI/CD', level: 'expert' },
        { name: 'Terraform', level: 'intermediate' }
      ],
      bio: 'DevOps engineer specializing in cloud infrastructure and deployment pipelines.',
      linkedIn: 'https://linkedin.com/in/blakefoster'
    }
  ];

  const { user } = useAuth();

  const handleSkillsAnalyzed = (skills: Skill[]) => {
    setMySkills(skills);
  };

  const handleTeamCreated = (team: Omit<Team, 'id' | 'isRecruiting'>) => {
    const newTeam: Team = {
      ...team,
      id: `team-${activeTeams.length + 1}`,
      isRecruiting: true,
      skillsNeeded: []
    };
    setActiveTeams([...activeTeams, newTeam]);
  };

  const handleJoinRequest = (teamId: string) => {
    toast({
      title: "Join request sent",
      description: "Your request to join the team has been sent to the team admin.",
    });
  };

  return (
    <Layout className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">HackSync</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Build the perfect team for your next hackathon project and manage tasks efficiently
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link to="/explore">
              <Button size="lg" variant="default" className="gap-2">
                <UserPlus size={18} />
                Find Teammates
              </Button>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  <Play size={18} />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button size="lg" variant="outline" className="gap-2" onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <LogIn size={18} />
                Sign In / Register
              </Button>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Active Teams
          </h2>
          
          <TeamList 
            teams={activeTeams}
            onJoinRequest={handleJoinRequest}
          />
        </div>

        {!user ? (
          <div id="auth-section" className="mt-16 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Join HackSync</h2>
            <AuthForm />
          </div>
        ) : (
          <div className="mt-16">
            <Tabs defaultValue="analyze" className="w-full">
              <TabsList className="grid w-full md:w-96 mx-auto grid-cols-2">
                <TabsTrigger value="analyze">Analyze Skills</TabsTrigger>
                <TabsTrigger value="create">Create Team</TabsTrigger>
              </TabsList>
              <TabsContent value="analyze" className="mt-6">
                <ResumeUpload onSkillsAnalyzed={handleSkillsAnalyzed} />
              </TabsContent>
              <TabsContent value="create" className="mt-6">
                <TeamCreation 
                  availableMembers={availableMembers} 
                  onTeamCreated={handleTeamCreated} 
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
