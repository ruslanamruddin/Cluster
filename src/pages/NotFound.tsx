
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-tech-dark">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-tech-accent1/20 rounded-full filter blur-[100px] animate-glow-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-tech-accent2/20 rounded-full filter blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center">
        <AnimatedSection animation="fade-in" delay={1}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 bg-cta-gradient rounded-xl rotate-45" />
                <div className="absolute inset-1 bg-tech-navy rounded-lg rotate-45 flex items-center justify-center">
                  <Terminal className="text-tech-accent1 w-8 h-8 -rotate-45" />
                </div>
              </div>
            </div>
            
            <h1 className="text-8xl font-bold mb-6">
              <span className="text-gradient">404</span>
            </h1>
            
            <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
            
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Button 
              onClick={() => window.location.href = "/"}
              className="bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default NotFound;
