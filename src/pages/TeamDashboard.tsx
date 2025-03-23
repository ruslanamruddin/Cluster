
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, BrainCircuit, ListTodo, Settings, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import AnimatedSection from "@/components/AnimatedSection";
import TaskList, { Task } from "@/components/TaskList";
import SocialProfileCard, { SocialProfileProps } from "@/components/SocialProfileCard";
import PageTransition from "@/components/PageTransition";

// Mock data - this would come from Supabase in the real implementation
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design user interface mockups",
    description: "Create high-fidelity mockups for the main dashboard and team pages",
    status: "completed",
    priority: "high",
    skills: ["UI/UX", "Figma"],
    assignee: {
      id: "user1",
      name: "Sarah Chen",
      avatar: undefined
    }
  },
  {
    id: "2",
    title: "Implement authentication flow",
    description: "Set up user registration, login, and password reset functionality",
    status: "in-progress",
    priority: "high",
    skills: ["Firebase", "React"],
    assignee: {
      id: "user2",
      name: "Alex Johnson",
    }
  },
  {
    id: "3",
    title: "Create database schema",
    description: "Design and implement the database schema for users, teams, and projects",
    status: "todo",
    priority: "medium",
    skills: ["Database", "SQL", "Supabase"],
  },
  {
    id: "4",
    title: "Implement team invitation system",
    description: "Create functionality for inviting users to teams via email",
    status: "todo",
    priority: "medium",
    skills: ["Backend", "Email"],
  },
  {
    id: "5",
    title: "Deploy application to production",
    description: "Set up CI/CD pipeline and deploy the application to production",
    status: "blocked",
    priority: "low",
    skills: ["DevOps", "CI/CD"],
  }
];

const mockTeamMembers: SocialProfileProps[] = [
  {
    id: "user1",
    name: "Sarah Chen",
    title: "UI/UX Designer",
    location: "San Francisco, CA",
    bio: "Passionate designer with experience in creating user-centered designs for web and mobile applications.",
    skills: [
      { name: "UI Design", level: "expert" },
      { name: "UX Research", level: "expert" },
      { name: "Figma", level: "expert" },
      { name: "Adobe XD", level: "intermediate" },
      { name: "HTML/CSS", level: "intermediate" }
    ],
    experience: {
      years: 4,
      companies: ["DesignCo", "CreativeLabs"]
    },
    links: [
      { type: "linkedin", url: "https://linkedin.com/" },
      { type: "github", url: "https://github.com/" },
      { type: "website", url: "https://example.com/" }
    ]
  },
  {
    id: "user2",
    name: "Alex Johnson",
    title: "Full Stack Developer",
    location: "New York, NY",
    bio: "Experienced developer with a passion for building scalable and performant web applications.",
    skills: [
      { name: "React", level: "expert" },
      { name: "Node.js", level: "expert" },
      { name: "TypeScript", level: "intermediate" },
      { name: "Firebase", level: "intermediate" },
      { name: "MongoDB", level: "beginner" }
    ],
    experience: {
      years: 5,
      companies: ["TechCorp", "Startup Inc."]
    },
    links: [
      { type: "github", url: "https://github.com/" },
      { type: "linkedin", url: "https://linkedin.com/" }
    ]
  }
];

const TeamDashboard = () => {
  const { teamId } = useParams();
  const { toast } = useToast();
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerateTasks = () => {
    setIsGeneratingTasks(true);
    
    // Simulate API call to generate tasks
    setTimeout(() => {
      setIsGeneratingTasks(false);
      
      toast({
        title: "Tasks generated",
        description: "AI has suggested tasks based on team skills and project goals.",
      });
    }, 2500);
  };
  
  const handleInviteMember = (id: string) => {
    toast({
      title: "Invitation sent",
      description: `Invitation has been sent to join the team.`,
    });
  };

  const handleAssignTask = (taskId: string) => {
    // This would open a dialog to assign the task to a team member
    console.log("Assign task", taskId);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full overflow-hidden relative bg-tech-dark">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/3 left-1/5 w-64 h-64 bg-tech-accent1/20 rounded-full filter blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-tech-accent2/20 rounded-full filter blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-10">
          <AnimatedSection animation="fade-in" delay={1}>
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Project Phoenix</h1>
                <Button
                  variant="outline"
                  className="bg-tech-accent1/10 hover:bg-tech-accent1/20 border-tech-accent1/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
              
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex -space-x-2">
                  {mockTeamMembers.map((member, i) => (
                    <Avatar key={i} className="border-2 border-tech-dark">
                      {member.avatar ? (
                        <AvatarImage src={member.avatar} alt={member.name} />
                      ) : (
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  ))}
                  <Avatar className="bg-tech-accent1/20 border-2 border-tech-dark">
                    <UserPlus className="h-4 w-4 text-tech-accent1" />
                  </Avatar>
                </div>
                
                <span className="text-muted-foreground">
                  {mockTeamMembers.length} team members
                </span>
                
                <div className="flex-grow"></div>
                
                <Button
                  onClick={handleGenerateTasks}
                  disabled={isGeneratingTasks}
                  className="bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300"
                >
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  {isGeneratingTasks ? "Generating Tasks..." : "AI Generate Tasks"}
                </Button>
              </div>
            </header>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-in" delay={2}>
            <Tabs defaultValue="tasks">
              <TabsList className="w-full bg-black/20 p-1 mb-6">
                <TabsTrigger value="tasks" className="flex-1">
                  <ListTodo className="h-4 w-4 mr-2" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="members" className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Team Members
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-6">
                <GlassmorphicCard className="w-full overflow-hidden">
                  <div className="flex items-center justify-between mb-4 px-4 pt-4">
                    <h2 className="text-xl font-semibold">Project Tasks</h2>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                  <TaskList 
                    tasks={mockTasks} 
                    onAssignTask={handleAssignTask}
                    onViewTask={(id) => console.log("View task", id)}
                  />
                </GlassmorphicCard>
              </TabsContent>
              
              <TabsContent value="members" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockTeamMembers.map((member, index) => (
                    <SocialProfileCard
                      key={index}
                      {...member}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
};

export default TeamDashboard;
