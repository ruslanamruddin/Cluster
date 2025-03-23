
/**
 * Utility functions to transform data between database format and UI format
 */

import { Team } from '@/components/TeamList';

/**
 * Converts a team record from database format (snake_case) to UI format (camelCase)
 * 
 * @param dbTeam Team record from database
 * @returns Team object in the format expected by UI components
 */
export const transformTeamFromDB = (dbTeam: any): Team => {
  return {
    id: dbTeam.id,
    name: dbTeam.name,
    description: dbTeam.description || '',
    members: [], // This would need to be populated separately
    projectIdea: dbTeam.project_idea || '',
    isRecruiting: dbTeam.is_recruiting === true,
    skillsNeeded: [], // This would need to be populated separately
    hackathonId: dbTeam.hackathon_id
  };
};

/**
 * Converts an array of team records from database format to UI format
 */
export const transformTeamsFromDB = (dbTeams: any[]): Team[] => {
  if (!Array.isArray(dbTeams)) {
    console.error('Expected teams to be an array but got:', dbTeams);
    return [];
  }
  
  return dbTeams.map(transformTeamFromDB);
};
