
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mock AI skill analysis function (to be replaced with actual AI API call)
async function analyzeSkillsWithAI(resumeText: string, linkedInUrl: string, additionalInfo: string) {
  console.log("Analyzing skills with mock AI");
  
  // This would be replaced with a real AI API call (e.g., to Cohere or Gemini)
  // For now, we'll extract skills from the text using a simple matching approach
  
  const combinedText = `${resumeText} ${linkedInUrl} ${additionalInfo}`.toLowerCase();
  
  // Skills to look for
  const progLanguages = [
    'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'go', 
    'rust', 'ruby', 'php', 'swift', 'kotlin', 'dart', 'scala'
  ];
  
  const webTech = [
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 
    'flask', 'rails', 'graphql', 'rest apis', 'redux', 'css', 'html', 
    'sass', 'tailwind css', 'bootstrap', 'material ui', 'websockets'
  ];
  
  const dataScience = [
    'machine learning', 'deep learning', 'data analysis', 'tensorflow', 
    'pytorch', 'pandas', 'numpy', 'r', 'data visualization', 'sql', 
    'statistics', 'computer vision', 'nlp', 'jupyter', 'big data'
  ];
  
  const devOps = [
    'docker', 'kubernetes', 'ci/cd', 'aws', 'azure', 'gcp', 'terraform', 
    'jenkins', 'gitlab ci', 'github actions', 'linux', 'bash', 'monitoring'
  ];
  
  const allSkills = [
    ...progLanguages.map(s => ({ name: s, category: 'Programming Languages' })),
    ...webTech.map(s => ({ name: s, category: 'Web Technologies' })),
    ...dataScience.map(s => ({ name: s, category: 'Data Science' })),
    ...devOps.map(s => ({ name: s, category: 'DevOps' }))
  ];
  
  // Array to store detected skills
  const detectedSkills = [];
  
  // Extract skills from text
  for (const skill of allSkills) {
    const skillName = skill.name;
    const skillRegex = new RegExp(`\\b${skillName}\\b|\\b${skillName}[.,-]|${skillName}\\b`, 'i');
    
    if (skillRegex.test(combinedText)) {
      // Determine skill level
      let level = 'intermediate';
      
      const expertClues = ['expert', 'advanced', 'senior', 'lead', '5+ years', 'extensive experience'];
      const beginnerClues = ['beginner', 'basic', 'learning', 'junior', 'novice', 'entry'];
      
      if (expertClues.some(clue => combinedText.includes(clue) && combinedText.indexOf(clue) - combinedText.indexOf(skillName) < 50)) {
        level = 'expert';
      } else if (beginnerClues.some(clue => combinedText.includes(clue) && combinedText.indexOf(clue) - combinedText.indexOf(skillName) < 50)) {
        level = 'beginner';
      }
      
      detectedSkills.push({
        name: skillName,
        level: level,
        category: skill.category
      });
    }
  }
  
  // If no skills detected, add some default ones
  if (detectedSkills.length === 0) {
    detectedSkills.push(
      { name: 'JavaScript', level: 'intermediate', category: 'Programming Languages' },
      { name: 'React', level: 'beginner', category: 'Web Technologies' },
      { name: 'HTML/CSS', level: 'intermediate', category: 'Web Technologies' }
    );
  }
  
  return detectedSkills;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { resumeText, linkedInUrl, additionalInfo, userId } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Analyze skills using AI (or mock AI for now)
    const skills = await analyzeSkillsWithAI(resumeText || "", linkedInUrl || "", additionalInfo || "");
    
    // If userId is provided, save the skills to the database
    if (userId) {
      const { data, error } = await supabase.rpc(
        'save_user_skills',
        { 
          p_user_id: userId,
          p_skills: skills
        }
      );
      
      if (error) {
        console.error("Error saving skills:", error);
        return new Response(
          JSON.stringify({ error: "Failed to save skills to database" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log("Skills saved to database:", data);
    }
    
    return new Response(
      JSON.stringify({ skills }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
