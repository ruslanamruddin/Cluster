import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  FileUp, 
  Link as LinkIcon, 
  Loader2,
  Brain,
  AlertCircle,
  PencilIcon
} from 'lucide-react';
import { Skill } from './ProfileCard';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { useSkillAnalysis } from '@/hooks/useSkillAnalysis';
import { extractTextFromPDF } from '@/utils/pdfParser';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ResumeUploadProps {
  onSkillsAnalyzed: (skills: Skill[]) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onSkillsAnalyzed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const { user } = useAuth();
  const { skills: savedSkills } = useUserProfile();
  const { toast } = useToast();
  
  const { 
    isAnalyzing, 
    analyzedSkills, 
    analyzeSkills, 
    saveSkills 
  } = useSkillAnalysis({
    onSuccess: (skills) => {
      // Call parent callback
      onSkillsAnalyzed(skills);
      
      // Save to user profile if logged in
      if (user) {
        saveSkills(skills);
      }
    }
  });

  // Pre-populate with any existing skills
  useEffect(() => {
    if (savedSkills && savedSkills.length > 0) {
      onSkillsAnalyzed(savedSkills);
    }
  }, [savedSkills, onSkillsAnalyzed]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !linkedInUrl && !additionalInfo) {
      toast({
        title: "Missing information",
        description: "Please provide a resume, LinkedIn URL, or additional information",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extract text from PDF or other file formats
      let resumeText = '';
      
      if (file) {
        try {
          if (file.type === 'application/pdf') {
            resumeText = await extractTextFromPDF(file);
            console.log('Extracted PDF text:', resumeText.substring(0, 500) + '...');
          } else {
            // Use built-in text extraction for other formats
            resumeText = await file.text();
          }
        } catch (extractionError) {
          console.error('File extraction error:', extractionError);
          toast({
            title: "File reading issue",
            description: "We had trouble reading your file. Try uploading a different format or enter your skills manually.",
            variant: "destructive",
          });
        }
      }
      
      // If no text was extracted successfully and there's no other info, show error
      if (!resumeText && !linkedInUrl && !additionalInfo) {
        toast({
          title: "Missing information",
          description: "We couldn't extract information from your file. Please provide details manually.",
          variant: "destructive",
        });
        return;
      }
      
      // Call the analyze skills function from our hook
      await analyzeSkills({
        resumeText,
        linkedInUrl,
        additionalInfo
      });
      
      toast({
        title: "Skills analyzed successfully",
        description: `We've identified ${analyzedSkills.length} skills from your information.`,
      });
    } catch (error) {
      console.error('Error analyzing skills:', error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze your skills. Please try again or enter your skills manually.",
        variant: "destructive",
      });
    }
  };

  const getSkillBadgeColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Skill Analysis
        </CardTitle>
        <CardDescription>
          Upload your resume or provide your LinkedIn profile to analyze your skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {file && file.type === 'application/pdf' && (
          <Alert variant="default" className="mb-4 border-yellow-500/50 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>PDF Processing Note</AlertTitle>
            <AlertDescription>
              If PDF analysis fails, you can manually list your skills in the "Additional Information" section.
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs underline"
                onClick={() => setAdditionalInfo(prev => 
                  prev + (prev ? '\n\n' : '') + 'My key skills include: '
                )}
              >
                <PencilIcon className="h-3 w-3 mr-1" />
                Add template
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="resume">Resume (PDF, DOCX)</Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="border border-input rounded-md px-3 py-2 flex justify-between items-center bg-background">
                <span className="text-sm text-muted-foreground truncate">
                  {file ? file.name : "No file selected"}
                </span>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Label htmlFor="resume" className="cursor-pointer">
                  <FileUp size={18} className="text-primary" />
                </Label>
              </div>
            </div>
            {file && (
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => setFile(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                     className="h-4 w-4">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <LinkIcon size={16} />
              </div>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                className="pl-10"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setLinkedInUrl('')}
              disabled={!linkedInUrl}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                   className="h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-info">Additional Information</Label>
          <Textarea
            id="additional-info"
            placeholder="Add any other skills, experiences, or information you'd like to include in the analysis..."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={4}
          />
        </div>

        {analyzedSkills.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <Label>Identified Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {analyzedSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className={getSkillBadgeColor(skill.level)}
                >
                  {skill.name} ({skill.level})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2 sm:justify-between">
        <div className="text-xs text-muted-foreground">
          Your information is analyzed securely using Google's Gemini AI.
          {!user && (
            <span className="ml-1 text-primary">Sign in to save your skills to your profile.</span>
          )}
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
          className="sm:min-w-32"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain size={16} className="mr-2" />
              Analyze Skills
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeUpload;
