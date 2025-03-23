
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ResumeUpload from '@/components/ResumeUpload';
import TeamCreation from '@/components/TeamCreation';
import TaskAssignment from '@/components/TaskAssignment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skill, UserProfile } from '@/components/ProfileCard';
import { FileText, Users, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [projectIdea, setProjectIdea] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const handleSkillsAnalyzed = (skills: Skill[]) => {
    setUserSkills(skills);
    
    // Create user profile with analyzed skills
    const userProfile: UserProfile = {
      id: 'current-user',
      name: 'You',
      title: skills.some(s => s.level === 'expert') 
        ? `${skills.find(s => s.level === 'expert')?.name} Expert` 
        : 'Hackathon Participant',
      skills: skills,
      bio: `Skilled in ${skills.slice(0, 3).map(s => s.name).join(', ')} and more.`,
    };
    
    // Add user to team members
    setTeamMembers([userProfile]);
    
    // Automatically move to team tab after skills analysis
    setActiveTab('team');
  };

  const handleTeamCreated = (team: {
    name: string;
    description: string;
    members: UserProfile[];
    projectIdea: string;
  }) => {
    setTeamMembers(team.members);
    setProjectIdea(team.projectIdea);
    
    // Automatically move to tasks tab after team creation
    setActiveTab('tasks');
  };

  const handleTasksGenerated = (generatedTasks: any[]) => {
    setTasks(generatedTasks);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-x-1">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Profile & Skills</CardTitle>
                <CardDescription>
                  Analyze your resume and LinkedIn to identify your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeUpload onSkillsAnalyzed={handleSkillsAnalyzed} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6 animate-fade-in">
            <TeamCreation 
              onTeamCreated={handleTeamCreated} 
            />
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6 animate-fade-in">
            <TaskAssignment 
              projectIdea={projectIdea} 
              teamMembers={teamMembers}
              onTasksGenerated={handleTasksGenerated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
