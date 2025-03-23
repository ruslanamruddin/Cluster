import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Main AI skill analysis function that can use different AI providers
async function analyzeSkillsWithAI(resumeText: string, linkedInUrl: string, additionalInfo: string) {
  console.log("Analyzing skills with AI");
  
  // Get AI provider settings
  const aiProvider = Deno.env.get("AI_PROVIDER") || "mock";
  console.log(`Using AI provider: ${aiProvider}`);
  
  // Combine all text sources
  const combinedText = `${resumeText} ${linkedInUrl} ${additionalInfo}`;
  
  if (aiProvider === "openai") {
    return await analyzeWithOpenAI(combinedText);
  } else if (aiProvider === "cohere") {
    return await analyzeWithCohere(combinedText);
  } else if (aiProvider === "anthropic") {
    return await analyzeWithAnthropic(combinedText);
  } else if (aiProvider === "gemini") {
    return await analyzeWithGemini(combinedText);
  } else {
    // Fallback to mock implementation
    return mockAnalyzeSkills(combinedText);
  }
}

// OpenAI-based analysis
async function analyzeWithOpenAI(text: string) {
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiApiKey) {
    console.error("OpenAI API key not found");
    throw new Error("OpenAI API key not configured");
  }
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert at analyzing resumes and professional profiles to identify and categorize technical and soft skills. Extract skills from the provided text and categorize them by proficiency level (beginner, intermediate, expert). Return the data in JSON format as an array of objects, each with 'name', 'level', and 'category' properties. Categories should be one of: 'Programming Languages', 'Web Technologies', 'Data Science', 'DevOps', 'Design', 'Mobile', or 'Soft Skills'.`
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing with OpenAI:", error);
    throw error;
  }
}

// Cohere-based analysis
async function analyzeWithCohere(text: string) {
  const cohereApiKey = Deno.env.get("COHERE_API_KEY");
  
  if (!cohereApiKey) {
    console.error("Cohere API key not found");
    throw new Error("Cohere API key not configured");
  }
  
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cohereApiKey}`
      },
      body: JSON.stringify({
        model: "command",
        prompt: `Extract technical and soft skills from the following text. Categorize them by proficiency level (beginner, intermediate, expert) and by category (Programming Languages, Web Technologies, Data Science, DevOps, Design, Mobile, Soft Skills). Return only a JSON array with objects containing 'name', 'level', and 'category' properties.\n\nText: ${text}\n\nJSON:`,
        max_tokens: 1000,
        temperature: 0.3,
        format: "json"
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("Cohere API error:", data.error);
      throw new Error(`Cohere API error: ${data.error.message}`);
    }

    // Parse the generated text as JSON
    const jsonMatch = data.generations[0].text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse Cohere response as JSON");
    }
  } catch (error) {
    console.error("Error analyzing with Cohere:", error);
    throw error;
  }
}

// Anthropic-based analysis
async function analyzeWithAnthropic(text: string) {
  const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
  
  if (!anthropicApiKey) {
    console.error("Anthropic API key not found");
    throw new Error("Anthropic API key not configured");
  }
  
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        messages: [
          {
            role: "user",
            content: `Extract technical and soft skills from the following text. Categorize them by proficiency level (beginner, intermediate, expert) and by category (Programming Languages, Web Technologies, Data Science, DevOps, Design, Mobile, Soft Skills). Return only a JSON array with objects containing 'name', 'level', and 'category' properties.\n\nText: ${text}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error("Anthropic API error:", data.error);
      throw new Error(`Anthropic API error: ${data.error.message}`);
    }

    // Parse the JSON from the content
    const content = data.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse Anthropic response as JSON");
    }
  } catch (error) {
    console.error("Error analyzing with Anthropic:", error);
    throw error;
  }
}

// Gemini-based analysis
async function analyzeWithGemini(text: string) {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  
  if (!geminiApiKey) {
    console.error("Gemini API key not found");
    throw new Error("Gemini API key not configured");
  }
  
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Extract technical and soft skills from the following text. Categorize them by proficiency level (beginner, intermediate, expert) and by category (Programming Languages, Web Technologies, Data Science, DevOps, Design, Mobile, Soft Skills). Return only a JSON array with objects containing 'name', 'level', and 'category' properties.

Text: ${text}

Respond only with valid JSON.`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(`Gemini API error: ${data.error.message}`);
    }

    // Extract the JSON response from Gemini's text output
    const content = data.candidates[0].content.parts[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse Gemini response as JSON");
    }
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    throw error;
  }
}

// Mock implementation (fallback if no AI providers are configured)
function mockAnalyzeSkills(combinedText: string) {
  console.log("Using mock skill analysis");
  
  // This would be replaced with a real AI API call (e.g., to Cohere or Gemini)
  // For now, we'll extract skills from the text using a simple matching approach
  
  const combinedTextLower = combinedText.toLowerCase();
  
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
    
    if (skillRegex.test(combinedTextLower)) {
      // Determine skill level
      let level = 'intermediate';
      
      const expertClues = ['expert', 'advanced', 'senior', 'lead', '5+ years', 'extensive experience'];
      const beginnerClues = ['beginner', 'basic', 'learning', 'junior', 'novice', 'entry'];
      
      if (expertClues.some(clue => combinedTextLower.includes(clue) && combinedTextLower.indexOf(clue) - combinedTextLower.indexOf(skillName) < 50)) {
        level = 'expert';
      } else if (beginnerClues.some(clue => combinedTextLower.includes(clue) && combinedTextLower.indexOf(clue) - combinedTextLower.indexOf(skillName) < 50)) {
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
    
    // Analyze skills using AI
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
