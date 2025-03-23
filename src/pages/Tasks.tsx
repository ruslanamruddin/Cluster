
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TaskAssignment from '@/components/TaskAssignment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/components/ProfileCard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';

// Sample team members - in a real app, these would be fetched from the database
const sampleTeamMembers: UserProfile[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    title: 'Frontend Developer',
    skills: [
      { name: 'React', level: 'expert' },
      { name: 'TypeScript', level: 'intermediate' },
      { name: 'UI/UX', level: 'intermediate' }
    ],
    bio: 'Passionate frontend developer with 3 years of experience building web applications.',
    linkedIn: 'https://linkedin.com/in/alexjohnson'
  },
  {
    id: '2',
    name: 'Sam Rodriguez',
    title: 'Backend Engineer',
    skills: [
      { name: 'Node.js', level: 'expert' },
      { name: 'Python', level: 'intermediate' },
      { name: 'Database Design', level: 'expert' }
    ],
    bio: 'Backend developer specializing in API development and database optimization.',
    github: 'https://github.com/samrodriguez'
  },
  {
    id: '3',
    name: 'Taylor Kim',
    title: 'Full Stack Developer',
    skills: [
      { name: 'JavaScript', level: 'expert' },
      { name: 'React', level: 'intermediate' },
      { name: 'Node.js', level: 'beginner' }
    ],
    bio: 'Full stack developer with a focus on creating seamless user experiences.',
    linkedIn: 'https://linkedin.com/in/taylorkim'
  }
];

const Tasks = () => {
  const [projectIdea, setProjectIdea] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>(sampleTeamMembers);
  const { toast } = useToast();

  const handleTasksGenerated = (generatedTasks: any[]) => {
    setTasks(generatedTasks);
    
    toast({
      title: 'Tasks generated',
      description: `${generatedTasks.length} tasks have been generated and assigned based on team skills.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Task Management</h1>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
              <CardDescription>
                Describe your project idea to generate appropriate tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="E.g., We're building a real-time collaborative coding platform with AI-powered code suggestions..."
                  className="min-h-[120px]"
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                />
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {projectIdea.length} / 500 characters
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setProjectIdea('')}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <TaskAssignment 
            projectIdea={projectIdea}
            teamMembers={teamMembers}
            onTasksGenerated={handleTasksGenerated}
          />
          
          {tasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Tasks ({tasks.length})</span>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Custom Task
                  </Button>
                </CardTitle>
                <CardDescription>
                  Tasks have been assigned based on team members' skills and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Tasks would be displayed here with more UI - using the existing component for now */}
                  <p className="text-muted-foreground">
                    View assigned tasks in the card above
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;
