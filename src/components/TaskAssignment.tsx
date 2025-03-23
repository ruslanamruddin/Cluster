
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from './ProfileCard';
import { Loader2, CheckCircle2, AlertCircle, ArrowRightCircle } from 'lucide-react';
import { delegateTasks } from '@/lib/taskDelegation';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
}

interface TaskAssignmentProps {
  projectIdea: string;
  teamMembers: UserProfile[];
  onTasksGenerated: (tasks: Task[]) => void;
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  projectIdea,
  teamMembers,
  onTasksGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const handleGenerateTasks = async () => {
    if (!projectIdea.trim()) {
      toast({
        title: "Project idea required",
        description: "Please provide a project idea to generate tasks",
        variant: "destructive",
      });
      return;
    }

    if (teamMembers.length === 0) {
      toast({
        title: "Team members required",
        description: "Please add team members before generating tasks",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const tasks = await delegateTasks(projectIdea, teamMembers);
      setGeneratedTasks(tasks);
      onTasksGenerated(tasks);
      
      toast({
        title: "Tasks generated successfully",
        description: `${tasks.length} tasks have been created and assigned.`,
      });
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast({
        title: "Failed to generate tasks",
        description: "An error occurred while generating tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedMember = (memberId: string) => {
    return teamMembers.find(member => member.id === memberId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Assignment</CardTitle>
        <CardDescription>
          Generate and assign tasks based on your project idea and team skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-accent p-4">
            <h3 className="text-sm font-medium mb-1">Project Idea</h3>
            <p className="text-sm text-muted-foreground">
              {projectIdea || "No project idea provided"}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center space-x-1 bg-background border border-border rounded-full pl-1 pr-2 py-1"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-[10px]">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{member.name}</span>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-sm text-muted-foreground">No team members added yet</p>
              )}
            </div>
          </div>
          
          {generatedTasks.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium">Generated Tasks</h3>
              {generatedTasks.map(task => {
                const assignedMember = getAssignedMember(task.assignedTo);
                
                return (
                  <div 
                    key={task.id}
                    className="border border-border rounded-md p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge 
                        variant="secondary"
                        className={getDifficultyColor(task.difficulty)}
                      >
                        {task.difficulty} · {task.estimatedHours}h
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    {assignedMember && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={assignedMember.avatar} alt={assignedMember.name} />
                            <AvatarFallback className="text-[10px]">
                              {assignedMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{assignedMember.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          AI will distribute tasks based on skills and experience.
        </div>
        <Button 
          onClick={handleGenerateTasks} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : generatedTasks.length > 0 ? (
            <>
              <ArrowRightCircle size={16} className="mr-2" />
              Regenerate Tasks
            </>
          ) : (
            <>
              <CheckCircle2 size={16} className="mr-2" />
              Generate Tasks
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskAssignment;
