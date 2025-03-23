import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import { useUserProfile } from '@/context/UserProfileContext';
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
  Upload, 
  FileText, 
  Loader2,
  Users,
  Brain,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skill } from '@/components/ProfileCard';
import { generateText } from '@/integrations/gemini/client';

const ProfileSetup = () => {
  const [file, setFile] = useState<File | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSkills, setAnalyzedSkills] = useState<Skill[]>([]);
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  
  const { setSkillsAnalyzed } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !linkedInUrl && !additionalInfo) {
      toast({
        title: "Missing information",
        description: "Please provide a resume, LinkedIn URL, or additional information about your skills",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setStep('analyzing');
    
    try {
      // Extract text from file if it exists
      let resumeText = '';
      if (file) {
        resumeText = await file.text();
      }
      
      // Analyze with Gemini API
      const prompt = `
        You are an AI skill analyzer for a hackathon platform.
        
        Task: Analyze the provided information and extract a list of technical and non-technical skills.
        For each identified skill, assess the proficiency level (beginner, intermediate, expert) based on context clues.
        
        ${resumeText ? `RESUME CONTENT:\n${resumeText}\n\n` : ''}
        ${linkedInUrl ? `LINKEDIN URL: ${linkedInUrl}\n\n` : ''}
        ${additionalInfo ? `ADDITIONAL INFORMATION:\n${additionalInfo}\n\n` : ''}
        
        Format your response as a valid JSON array with the following structure:
        [
          { "name": "Skill Name", "level": "beginner/intermediate/expert" },
          { "name": "Another Skill", "level": "beginner/intermediate/expert" }
        ]
        
        Focus on professional and technical skills. Skip generic traits like "hard-working" unless specifically emphasized.
        Identify at least 5-10 skills if there is sufficient information.
        Return ONLY the JSON array, no additional text or explanation.
      `;
      
      const response = await generateText(prompt);
      
      // Parse the response into skill objects
      try {
        const skills = JSON.parse(response) as Skill[];
        setAnalyzedSkills(skills);
        setStep('results');
        
        toast({
          title: "Skills analyzed successfully",
          description: `We've identified ${skills.length} skills from your information.`,
        });
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        toast({
          title: "Analysis issue",
          description: "There was a problem processing the skill analysis. Please try again.",
          variant: "destructive",
        });
        setStep('input');
      }
    } catch (error) {
      console.error('Error analyzing skills with Gemini:', error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze your skills. Please try again or provide different information.",
        variant: "destructive",
      });
      setStep('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      // Save skills to user profile and mark as completed
      await setSkillsAnalyzed(analyzedSkills);
      
      toast({
        title: "Profile setup complete",
        description: "Your skills have been saved to your profile. You can now access teams."
      });
      
      // Navigate to teams page
      navigate('/teams');
    } catch (error) {
      console.error('Error saving skills:', error);
      toast({
        title: "Error saving profile",
        description: "There was a problem saving your skills. Please try again.",
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
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profile Setup</h1>
              <p className="text-muted-foreground mt-1">
                Complete your profile before joining or creating a team
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Step 1: Profile</span>
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                <Users className="h-3.5 w-3.5" />
                <span>Step 2: Teams</span>
              </Badge>
            </div>
          </div>

          {step === 'input' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Skill Analysis
                </CardTitle>
                <CardDescription>
                  Upload your resume, provide your LinkedIn profile, or list your skills for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-info">List Your Skills & Experience</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="Describe your skills, technologies you're familiar with, and past experiences. For example: 'I have 2 years of experience with React, JavaScript, and UI design. I've worked on several web applications and am familiar with REST APIs and Node.js.'"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  Your information is analyzed securely using Google's Gemini AI to identify your skills.
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  className="w-full sm:w-auto"
                >
                  <Brain size={16} className="mr-2" />
                  Analyze Skills
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 'analyzing' && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 size={40} className="animate-spin text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Analyzing Your Skills</h3>
                <p className="text-center text-muted-foreground max-w-md mb-6">
                  Our AI is analyzing your information to identify your technical and non-technical skills.
                </p>
                <div className="w-full max-w-md bg-secondary rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'results' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Skills Analysis Complete
                </CardTitle>
                <CardDescription>
                  We've analyzed your information and identified the following skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium mb-3">Your Skills</h3>
                  <div className="flex flex-wrap gap-2">
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

                <div className="space-y-1">
                  <h3 className="font-medium">Skill Breakdown</h3>
                  <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">
                        {analyzedSkills.filter(s => s.level === 'expert').length}
                      </span> Expert-level skills
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        {analyzedSkills.filter(s => s.level === 'intermediate').length}
                      </span> Intermediate-level skills
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        {analyzedSkills.filter(s => s.level === 'beginner').length}
                      </span> Beginner-level skills
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto order-2 sm:order-1"
                  onClick={() => setStep('input')}
                >
                  Redo Analysis
                </Button>
                <Button 
                  className="w-full sm:w-auto order-1 sm:order-2"
                  onClick={handleSaveAndContinue}
                >
                  Save and Continue to Teams
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSetup; 