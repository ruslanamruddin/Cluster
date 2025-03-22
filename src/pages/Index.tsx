
import { useState, useEffect } from "react";
import GetStartedButton from "@/components/GetStartedButton";
import AnimatedSection from "@/components/AnimatedSection";
import { Terminal, Code, Cpu, Braces } from "lucide-react";

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-tech-dark">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-tech-accent1/30 rounded-full filter blur-[100px] animate-glow-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-tech-accent2/30 rounded-full filter blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Main content */}
      <div className="container relative z-10 mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center">
        {/* Logo */}
        <AnimatedSection 
          animation="fade-in" 
          delay={1} 
          className="mb-8"
        >
          <div className="w-20 h-20 relative mb-4 mx-auto">
            <div className="absolute inset-0 bg-cta-gradient rounded-2xl rotate-45 animate-float" />
            <div className="absolute inset-1 bg-tech-navy rounded-xl rotate-45 flex items-center justify-center">
              <Terminal className="text-tech-accent1 w-8 h-8 -rotate-45" />
            </div>
          </div>
        </AnimatedSection>
        
        {/* Hero content */}
        <AnimatedSection 
          animation="fade-in" 
          delay={2} 
          className="text-center max-w-3xl mb-8"
        >
          <h1 className="font-bold mb-6">
            <span className="block text-gradient">HackHub</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-muted-foreground mt-2">
              Build amazing things together
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate platform for finding teammates, managing projects, and showcasing your hackathon creations.
          </p>
        </AnimatedSection>
        
        {/* CTA Button */}
        <AnimatedSection 
          animation="scale-in" 
          delay={3} 
          className="mb-16"
        >
          <GetStartedButton className="text-lg px-10 py-5" />
        </AnimatedSection>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <AnimatedSection animation="slide-up" delay={3}>
            <div className="glass p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-tech-accent1/20 flex items-center justify-center mb-4">
                <Terminal className="text-tech-accent1 w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Find Your Team</h3>
              <p className="text-muted-foreground">
                Connect with like-minded developers, designers, and visionaries to form the perfect hackathon team.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slide-up" delay={4}>
            <div className="glass p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-tech-accent2/20 flex items-center justify-center mb-4">
                <Code className="text-tech-accent2 w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Collaborate Seamlessly</h3>
              <p className="text-muted-foreground">
                Organize tasks, share resources, and communicate effectively within your hackathon team.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slide-up" delay={5}>
            <div className="glass p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-tech-accent3/20 flex items-center justify-center mb-4">
                <Cpu className="text-tech-accent3 w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Showcase Projects</h3>
              <p className="text-muted-foreground">
                Present your hackathon projects to the world with beautiful profiles and detailed showcases.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Index;
