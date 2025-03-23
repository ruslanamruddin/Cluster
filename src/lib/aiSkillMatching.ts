import { generateText, analyzeText } from '@/integrations/gemini/client';

interface SkillMatch {
  score: number;
  explanation: string;
}

interface TeamSuggestion {
  reason: string;
  compatibility: number;
  potentialRoles: string[];
}

/**
 * Analyzes a user's skills against a project's requirements
 * @param userSkills Array of user skills
 * @param projectRequirements Project description and required skills
 * @returns A match score and explanation
 */
export async function matchSkillsToProject(
  userSkills: string[],
  projectRequirements: string
): Promise<SkillMatch> {
  const prompt = `
    You are an AI skill matching specialist for a hackathon platform.
    
    USER SKILLS:
    ${userSkills.join(', ')}
    
    PROJECT REQUIREMENTS:
    ${projectRequirements}
    
    Analyze how well the user's skills match the project requirements.
    Provide a match score from 0 to 100, where 100 is a perfect match.
    Explain your reasoning briefly.
    
    Format your response exactly as follows:
    {"score": [number], "explanation": "[your explanation]"}
  `;

  try {
    const response = await generateText(prompt);
    return JSON.parse(response) as SkillMatch;
  } catch (error) {
    console.error('Error matching skills to project:', error);
    return {
      score: 0,
      explanation: 'Failed to analyze skill match. Please try again later.'
    };
  }
}

/**
 * Suggests potential team members based on skills and project needs
 * @param teamMembers Current team members with their skills
 * @param projectDescription Project description
 * @param candidateProfiles Candidate profiles to evaluate
 * @returns Suggestions for each candidate
 */
export async function suggestTeamMembers(
  teamMembers: Array<{ id: string; name: string; skills: string[] }>,
  projectDescription: string,
  candidateProfiles: Array<{ id: string; name: string; skills: string[] }>
): Promise<Record<string, TeamSuggestion>> {
  const prompt = `
    You are an AI team formation specialist for a hackathon platform.
    
    CURRENT TEAM MEMBERS:
    ${teamMembers.map(member => `${member.name}: ${member.skills.join(', ')}`).join('\n')}
    
    PROJECT DESCRIPTION:
    ${projectDescription}
    
    CANDIDATE PROFILES:
    ${candidateProfiles.map(candidate => `${candidate.name}: ${candidate.skills.join(', ')}`).join('\n')}
    
    For each candidate, analyze:
    1. How well they would complement the existing team
    2. What skills they bring that the team might be missing
    3. What roles they could potentially fill
    
    For each candidate, provide a JSON object with:
    - reason: Brief explanation of why they'd be a good fit
    - compatibility: Number from 0-100
    - potentialRoles: Array of possible roles they could fill
    
    Format your response as a JSON object with candidate names as keys:
    {
      "candidateName1": {"reason": "...", "compatibility": 85, "potentialRoles": ["...", "..."]},
      "candidateName2": {"reason": "...", "compatibility": 70, "potentialRoles": ["...", "..."]}
    }
  `;

  try {
    const response = await generateText(prompt);
    return JSON.parse(response) as Record<string, TeamSuggestion>;
  } catch (error) {
    console.error('Error suggesting team members:', error);
    const errorResult: Record<string, TeamSuggestion> = {};
    
    candidateProfiles.forEach(candidate => {
      errorResult[candidate.name] = {
        reason: 'Failed to analyze candidate compatibility. Please try again later.',
        compatibility: 0,
        potentialRoles: []
      };
    });
    
    return errorResult;
  }
}

/**
 * Analyzes project description to identify required skills
 * @param projectDescription Project description text
 * @returns List of skills that would be valuable for the project
 */
export async function extractRequiredSkills(projectDescription: string): Promise<string[]> {
  const prompt = `
    You are an AI skill analyzer for a hackathon platform.
    
    PROJECT DESCRIPTION:
    ${projectDescription}
    
    Based on this project description, identify the technical and non-technical skills that would be
    valuable for this project. Include both specific technologies and broader skill categories.
    
    Return ONLY a JSON array of strings representing the skills, without any additional text.
    For example: ["React", "UI/UX Design", "API Integration", "Project Management"]
  `;

  try {
    const response = await generateText(prompt);
    return JSON.parse(response) as string[];
  } catch (error) {
    console.error('Error extracting required skills:', error);
    return [];
  }
} 