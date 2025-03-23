
/**
 * Utility functions to transform data between database format (snake_case) and UI format (camelCase)
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
    members: dbTeam.members || [], 
    projectIdea: dbTeam.project_idea || dbTeam.projectIdea || '',
    isRecruiting: dbTeam.is_recruiting === true || dbTeam.isRecruiting === true,
    skillsNeeded: dbTeam.skillsNeeded || [], 
    hackathonId: dbTeam.hackathon_id || dbTeam.hackathonId
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

/**
 * Converts a team from UI format (camelCase) to database format (snake_case)
 * 
 * @param team Team object in UI format
 * @returns Team record in database format
 */
export const transformTeamToDB = (team: Partial<Team>): Record<string, any> => {
  const dbTeam: Record<string, any> = {
    name: team.name,
    description: team.description,
  };
  
  if ('projectIdea' in team) {
    dbTeam.project_idea = team.projectIdea;
  }
  
  if ('isRecruiting' in team) {
    dbTeam.is_recruiting = team.isRecruiting;
  }
  
  if ('hackathonId' in team) {
    dbTeam.hackathon_id = team.hackathonId;
  }
  
  return dbTeam;
};

/**
 * Converts a camelCase team from view to the Team interface
 * 
 * @param viewTeam Team object from camelcase_teams view
 * @returns Team interface-compliant object
 */
export const transformViewTeamToInterface = (viewTeam: any): Team => {
  if (!viewTeam || !viewTeam.team) {
    console.error('Invalid team data from view:', viewTeam);
    return {
      id: '',
      name: '',
      description: '',
      members: [],
      projectIdea: '',
      isRecruiting: false,
      skillsNeeded: []
    };
  }
  
  const teamData = viewTeam.team;
  
  return {
    id: teamData.id,
    name: teamData.name,
    description: teamData.description || '',
    members: teamData.members || [],
    projectIdea: teamData.projectIdea || '',
    isRecruiting: teamData.isRecruiting === true,
    skillsNeeded: teamData.skillsNeeded || [],
    hackathonId: teamData.hackathonId
  };
};

/**
 * Transforms a database join request to a normalized format
 */
export const transformJoinRequest = (request: any) => {
  return {
    id: request.id,
    teamId: request.team_id,
    userId: request.user_id,
    status: request.status,
    createdAt: request.created_at,
    updatedAt: request.updated_at
  };
};
