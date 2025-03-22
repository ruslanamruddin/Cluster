
import { useState, useCallback } from "react";
import { FileText, UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import GlassmorphicCard from "./GlassmorphicCard";
import AnimatedSection from "./AnimatedSection";

type FileStatus = "idle" | "uploading" | "complete" | "error";

const ResumeDropzone = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fileStatus, setFileStatus] = useState<FileStatus>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith('.docx'))) {
      processFile(file);
    } else {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    setFileName(file.name);
    setFileStatus("uploading");
    
    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setFileStatus("complete");
        
        // Simulate parsing delay then navigate
        setTimeout(() => {
          toast({
            title: "Resume processed successfully",
            description: "We've parsed your resume and extracted your skills and experience.",
            variant: "default",
          });
          navigate("/explore");
        }, 1500);
      }
    }, 150);
  };

  return (
    <GlassmorphicCard className="w-full max-w-xl">
      <AnimatedSection animation="fade-in" delay={1}>
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-gradient">Upload Your Resume</h2>
          <p className="text-muted-foreground">
            Drag and drop your resume or click to browse
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="scale-in" delay={2}>
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 text-center ${
            isDragging 
              ? "border-tech-accent1 bg-tech-accent1/10" 
              : fileStatus === "complete" 
                ? "border-green-500/30 bg-green-500/5" 
                : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
          <input
            type="file"
            id="resume-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            disabled={fileStatus === "uploading" || fileStatus === "complete"}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            {fileStatus === "idle" && (
              <>
                <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-2">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Upload your resume</p>
                  <p className="text-sm text-muted-foreground">
                    Support for PDF, DOCX up to 10MB
                  </p>
                </div>
              </>
            )}

            {fileStatus === "uploading" && (
              <>
                <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-2">
                  <Loader2 className="h-10 w-10 text-tech-accent1 animate-spin" />
                </div>
                <div className="space-y-4 w-full max-w-xs">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm truncate">{fileName}</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-muted/20" />
                  <p className="text-sm text-muted-foreground">
                    Uploading and parsing your resume...
                  </p>
                </div>
              </>
            )}

            {fileStatus === "complete" && (
              <>
                <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Resume uploaded successfully!</p>
                  <p className="text-sm text-muted-foreground">
                    We're analyzing your skills and experience...
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={3} className="mt-6">
        <div className="flex justify-center">
          {fileStatus === "complete" ? (
            <Button 
              onClick={() => navigate("/explore")}
              className="bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300"
            >
              Continue to Explore
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your resume will help us match you with the perfect team
            </p>
          )}
        </div>
      </AnimatedSection>
    </GlassmorphicCard>
  );
};

export default ResumeDropzone;
