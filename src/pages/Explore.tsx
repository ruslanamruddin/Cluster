
import { useEffect, useState } from "react";
import { Search, Filter, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileCard from "@/components/ProfileCard";
import AnimatedSection from "@/components/AnimatedSection";
import GlassmorphicCard from "@/components/GlassmorphicCard";

// Mock data
const mockProfiles = [
  {
    id: 1,
    name: "Alex Johnson",
    title: "Full Stack Developer",
    skills: [
      { name: "React", level: "expert" },
      { name: "Node.js", level: "expert" },
      { name: "TypeScript", level: "intermediate" },
      { name: "MongoDB", level: "intermediate" },
    ],
    availability: "available",
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "UI/UX Designer",
    skills: [
      { name: "Figma", level: "expert" },
      { name: "Adobe XD", level: "expert" },
      { name: "HTML/CSS", level: "intermediate" },
      { name: "JavaScript", level: "beginner" },
    ],
    availability: "available",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    title: "Machine Learning Engineer",
    skills: [
      { name: "Python", level: "expert" },
      { name: "TensorFlow", level: "expert" },
      { name: "Data Analysis", level: "intermediate" },
      { name: "Computer Vision", level: "intermediate" },
    ],
    availability: "busy",
  },
  {
    id: 4,
    name: "Jamie Taylor",
    title: "Mobile Developer",
    skills: [
      { name: "React Native", level: "expert" },
      { name: "Swift", level: "intermediate" },
      { name: "Kotlin", level: "intermediate" },
      { name: "Firebase", level: "beginner" },
    ],
    availability: "unavailable",
  },
  {
    id: 5,
    name: "Priya Patel",
    title: "Backend Developer",
    skills: [
      { name: "Go", level: "expert" },
      { name: "Rust", level: "intermediate" },
      { name: "Docker", level: "intermediate" },
      { name: "Kubernetes", level: "beginner" },
    ],
    availability: "available",
  },
  {
    id: 6,
    name: "David Kim",
    title: "DevOps Engineer",
    skills: [
      { name: "AWS", level: "expert" },
      { name: "CI/CD", level: "expert" },
      { name: "Terraform", level: "intermediate" },
      { name: "Security", level: "intermediate" },
    ],
    availability: "busy",
  },
];

// Skill categories for filtering
const skillCategories = [
  "Frontend", "Backend", "Mobile", "Design", "DevOps", "AI/ML"
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProfiles = mockProfiles.filter(profile => {
    const nameMatch = profile.name.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = profile.title.toLowerCase().includes(searchQuery.toLowerCase());
    const skillsMatch = profile.skills.some(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (nameMatch || titleMatch || skillsMatch);
  });

  return (
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
            <Button className="bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300">
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
            Browse through talented developers, designers, and creators to build your dream hackathon team
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
                  placeholder="Search by name, role or skill..."
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
        
        {/* Profiles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredProfiles.map((profile, index) => (
            <AnimatedSection 
              key={profile.id} 
              animation="scale-in" 
              delay={(index % 3) + 3 as 3 | 4 | 5}
            >
              <ProfileCard 
                name={profile.name}
                title={profile.title}
                skills={profile.skills as any}
                availability={profile.availability as any}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
