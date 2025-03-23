
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter, Terminal, Users, BrainCircuit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import TeamCard, { TeamCardProps } from "@/components/TeamCard";
import CreateTeamForm from "@/components/CreateTeamForm";

// Mock data - this would come from Supabase in the real implementation
const mockTeams: TeamCardProps[] = [
  {
    id: "1",
    name: "PixelPioneers",
    description: "Building a next-gen design collaboration platform for remote teams.",
    members: [
      { id: "user1", name: "Sarah Chen", role: "UI/UX Designer" },
      { id: "user2", name: "Alex Johnson", role: "Full Stack Developer" },
    ],
    tags: ["React", "Firebase", "UI/UX", "TypeScript"],
    recruiting: true,
  },
  {
    id: "2",
    name: "CodeCrafters",
    description: "Developing an AI-powered code review and mentorship platform for junior developers.",
    members: [
      { id: "user3", name: "Michael Lee", role: "Backend Developer" },
      { id: "user4", name: "Jennifer Wong", role: "ML Engineer" },
      { id: "user5", name: "David Kim", role: "Frontend Developer" },
    ],
    tags: ["Python", "Machine Learning", "Node.js", "React"],
    recruiting: true,
  },
  {
    id: "3",
    name: "DataDynamos",
    description: "Creating a visual analytics platform for complex datasets using cutting-edge visualization techniques.",
    members: [
      { id: "user6", name: "Emma Clark", role: "Data Scientist" },
      { id: "user7", name: "James Wilson", role: "Visualization Expert" },
    ],
    tags: ["Data Visualization", "D3.js", "Python", "React"],
    recruiting: false,
  },
  {
    id: "4",
    name: "CloudChasers",
    description: "Building a simplified cloud infrastructure management tool for small businesses.",
    members: [
      { id: "user8", name: "Robert Garcia", role: "DevOps Engineer" },
      { id: "user9", name: "Sophia Martinez", role: "Full Stack Developer" },
    ],
    tags: ["AWS", "Infrastructure", "Terraform", "TypeScript"],
    recruiting: true,
  },
  {
    id: "5",
    name: "MobileMonarchs",
    description: "Developing a cross-platform mobile app for sustainable living and eco-friendly habits.",
    members: [
      { id: "user10", name: "Daniel Brown", role: "Mobile Developer" },
      { id: "user11", name: "Olivia Taylor", role: "UI/UX Designer" },
    ],
    tags: ["React Native", "Firebase", "UI/UX", "Sustainability"],
    recruiting: false,
  }
];

// Skill categories for filtering
const skillCategories = [
  "Frontend", "Backend", "Mobile", "AI/ML", "Design", "DevOps", "Data"
];

const Teams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredTeams = mockTeams
    .sort((a, b) => (a.recruiting === b.recruiting ? 0 : a.recruiting ? -1 : 1))
    .filter(team => {
      const nameMatch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = team.description.toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = team.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Category filter
      const categoryMatch = !selectedCategory || team.tags.some(tag => {
        if (selectedCategory === "Frontend") return ["React", "Angular", "Vue", "HTML", "CSS", "JavaScript", "TypeScript"].includes(tag);
        if (selectedCategory === "Backend") return ["Node.js", "Express", "Django", "Flask", "Spring", "ASP.NET"].includes(tag);
        if (selectedCategory === "Mobile") return ["React Native", "Flutter", "Android", "iOS", "Swift", "Kotlin"].includes(tag);
        if (selectedCategory === "AI/ML") return ["Machine Learning", "AI", "TensorFlow", "PyTorch", "NLP"].includes(tag);
        if (selectedCategory === "Design") return ["UI/UX", "Figma", "Sketch", "Adobe XD", "Design"].includes(tag);
        if (selectedCategory === "DevOps") return ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "Terraform"].includes(tag);
        if (selectedCategory === "Data") return ["Data Visualization", "D3.js", "Data Science", "Analytics", "BI"].includes(tag);
        return false;
      });
      
      return (nameMatch || descMatch || tagMatch) && categoryMatch;
    });

  return (
    <PageTransition>
      <div className="min-h-screen w-full overflow-hidden relative bg-tech-dark">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-tech-accent1/10 rounded-full filter blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-tech-accent2/10 rounded-full filter blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-10">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between py-6">
            <AnimatedSection animation="fade-in" delay={1}>
              <a href="/" className="flex items-center mb-4 sm:mb-0">
                <div className="w-10 h-10 relative mr-2">
                  <div className="absolute inset-0 bg-cta-gradient rounded-lg rotate-45" />
                  <div className="absolute inset-1 bg-tech-navy rounded-md rotate-45 flex items-center justify-center">
                    <Terminal className="text-tech-accent1 w-5 h-5 -rotate-45" />
                  </div>
                </div>
                <span className="text-xl font-semibold text-gradient">HackHub</span>
              </a>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in" delay={2}>
              <Button 
                className="bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300"
                onClick={() => setIsCreateTeamOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </AnimatedSection>
          </header>
          
          {/* Title */}
          <AnimatedSection 
            animation="fade-in" 
            delay={2} 
            className="text-center max-w-2xl mx-auto mb-10 mt-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Find Your Perfect Team</h1>
            <p className="text-muted-foreground">
              Browse through hackathon teams or create your own
            </p>
          </AnimatedSection>
          
          {/* Search and filters */}
          <AnimatedSection 
            animation="slide-up" 
            delay={3}
            className="mb-8 max-w-4xl mx-auto"
          >
            <GlassmorphicCard className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by team name, description or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 focus:border-tech-accent1/50"
                  />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hidden">
                  <Filter className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  {skillCategories.map(category => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedCategory === category 
                          ? "bg-tech-accent1 text-black"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === category ? null : category
                        );
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </GlassmorphicCard>
          </AnimatedSection>
          
          {/* Stats */}
          <AnimatedSection animation="slide-up" delay={4} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <GlassmorphicCard className="text-center p-4">
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 mb-2 text-tech-accent1" />
                  <h3 className="text-2xl font-bold">{mockTeams.length}</h3>
                  <p className="text-muted-foreground">Active Teams</p>
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard className="text-center p-4">
                <div className="flex flex-col items-center">
                  <BrainCircuit className="h-6 w-6 mb-2 text-tech-accent2" />
                  <h3 className="text-2xl font-bold">
                    {mockTeams.filter(t => t.recruiting).length}
                  </h3>
                  <p className="text-muted-foreground">Recruiting</p>
                </div>
              </GlassmorphicCard>
              
              <GlassmorphicCard className="text-center p-4">
                <div className="flex flex-col items-center">
                  <Terminal className="h-6 w-6 mb-2 text-tech-accent1" />
                  <h3 className="text-2xl font-bold">48</h3>
                  <p className="text-muted-foreground">Hours Left</p>
                </div>
              </GlassmorphicCard>
            </div>
          </AnimatedSection>
          
          {/* Teams grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredTeams.map((team, index) => (
              <AnimatedSection 
                key={team.id} 
                animation="scale-in" 
                delay={(index % 3) + 5 as 5 | 6 | 7}
              >
                <TeamCard 
                  {...team}
                  onClick={() => navigate(`/team/${team.id}`)}
                />
              </AnimatedSection>
            ))}
          </div>
          
          {/* Create Team Dialog */}
          <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
            <DialogContent className="max-w-2xl bg-tech-dark border-white/10">
              <DialogHeader>
                <DialogTitle>Create a New Team</DialogTitle>
              </DialogHeader>
              <CreateTeamForm onSubmitSuccess={() => setIsCreateTeamOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageTransition>
  );
};

export default Teams;
