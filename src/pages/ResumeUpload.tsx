
import { useEffect } from "react";
import ResumeDropzone from "@/components/ResumeDropzone";
import { Terminal } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const ResumeUpload = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-tech-dark">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="absolute top-1/3 left-1/5 w-64 h-64 bg-tech-accent1/20 rounded-full filter blur-[100px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-tech-accent2/20 rounded-full filter blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      
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
        
        {/* Title */}
        <AnimatedSection 
          animation="fade-in" 
          delay={2} 
          className="text-center max-w-2xl mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Upload your resume so we can help you find the perfect team based on your skills and experience
          </p>
        </AnimatedSection>
        
        {/* Resume dropzone */}
        <AnimatedSection animation="scale-in" delay={3}>
          <ResumeDropzone />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ResumeUpload;
