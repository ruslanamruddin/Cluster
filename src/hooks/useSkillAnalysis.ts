import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { generateText } from '@/integrations/gemini/client';
import { useUserProfile } from '@/context/UserProfileContext';
import { Skill } from '@/components/ProfileCard';

interface UseSkillAnalysisProps {
  onSuccess?: (skills: Skill[]) => void;
}

interface AnalysisInput {
  resumeText?: string;
  linkedInUrl?: string;
  additionalInfo?: string;
}

export function useSkillAnalysis({ onSuccess }: UseSkillAnalysisProps = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSkills, setAnalyzedSkills] = useState<Skill[]>([]);
  const { toast } = useToast();
  const { setSkillsAnalyzed } = useUserProfile();

  const analyzeSkills = async ({ resumeText = '', linkedInUrl = '', additionalInfo = '' }: AnalysisInput) => {
    if (!resumeText && !linkedInUrl && !additionalInfo) {
      toast({
        title: "Missing information",
        description: "Please provide a resume, LinkedIn URL, or additional information",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    
    try {
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
      
      // Log the input prompt
      console.log('=== SKILL ANALYSIS PROMPT ===');
      console.log(prompt);
      console.log('===========================');
      
      // Use forceValidJson option to ensure proper JSON response
      const response = await generateText(prompt, { forceValidJson: true });
      
      // Log the raw AI response
      console.log('=== SKILL ANALYSIS RAW RESPONSE ===');
      console.log(response);
      console.log('==================================');
      
      // Parse the response into skill objects
      try {
        // No need for extensive cleaning as the generateText function now handles it
        const cleanedResponse = response.trim();
        
        // Log the cleaned response before parsing
        console.log('=== SKILL ANALYSIS CLEANED RESPONSE ===');
        console.log(cleanedResponse);
        console.log('======================================');
        
        const skills = JSON.parse(cleanedResponse) as Skill[];
        
        // Log the parsed skills
        console.log('=== SKILL ANALYSIS PARSED SKILLS ===');
        console.log(JSON.stringify(skills, null, 2));
        console.log('==================================');
        
        setAnalyzedSkills(skills);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(skills);
        }
        
        toast({
          title: "Skills analyzed successfully",
          description: `We've identified ${skills.length} skills from your information.`,
        });
        
        return skills;
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        toast({
          title: "Analysis issue",
          description: "There was a problem processing the skill analysis. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Error analyzing skills:', error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze your skills. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveSkills = async (skills: Skill[]) => {
    try {
      await setSkillsAnalyzed(skills);
      toast({
        title: "Skills saved",
        description: "Your skills have been saved to your profile.",
      });
      return true;
    } catch (error) {
      console.error('Error saving skills:', error);
      toast({
        title: "Error saving skills",
        description: "We couldn't save your skills to your profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isAnalyzing,
    analyzedSkills,
    analyzeSkills,
    saveSkills
  };
} 