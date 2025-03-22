
import { useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import { Terminal } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const Auth = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-tech-dark">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-tech-accent1/20 rounded-full filter blur-[100px] animate-glow-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-tech-accent2/20 rounded-full filter blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-10 min-h-screen flex flex-col items-center justify-center">
        {/* Logo */}
        <AnimatedSection 
          animation="fade-in" 
          delay={1} 
          className="mb-8"
        >
          <a href="/" className="flex items-center justify-center">
            <div className="w-12 h-12 relative mr-2">
              <div className="absolute inset-0 bg-cta-gradient rounded-lg rotate-45" />
              <div className="absolute inset-1 bg-tech-navy rounded-md rotate-45 flex items-center justify-center">
                <Terminal className="text-tech-accent1 w-6 h-6 -rotate-45" />
              </div>
            </div>
            <span className="text-xl font-semibold text-gradient">HackHub</span>
          </a>
        </AnimatedSection>
        
        {/* Auth form */}
        <AnimatedSection animation="fade-in" delay={2}>
          <AuthForm />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Auth;
