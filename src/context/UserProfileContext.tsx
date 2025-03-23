import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skill } from '@/components/ProfileCard';

interface UserProfileState {
  hasCompletedSkillAnalysis: boolean;
  skills: Skill[];
  isLoading: boolean;
}

interface UserProfileContextType extends UserProfileState {
  setSkillsAnalyzed: (skills: Skill[]) => Promise<void>;
  resetSkillAnalysis: () => void;
}

const initialState: UserProfileState = {
  hasCompletedSkillAnalysis: false,
  skills: [],
  isLoading: true,
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserProfileState>(initialState);
  const { user } = useAuth();

  // Fetch user profile data when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setState({ ...initialState, isLoading: false });
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      try {
        // Check if user has profile data with skills in Supabase
        const { data, error } = await supabase
          .from('user_profiles')
          .select('skills, has_completed_skill_analysis')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          throw error;
        }

        if (data) {
          setState({
            hasCompletedSkillAnalysis: data.has_completed_skill_analysis || false,
            skills: data.skills || [],
            isLoading: false,
          });
        } else {
          setState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  // Save skills to profile and mark skill analysis as completed
  const setSkillsAnalyzed = async (skills: Skill[]) => {
    if (!user) return;

    try {
      // Get existing profile or create new one
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        await supabase
          .from('user_profiles')
          .update({
            skills,
            has_completed_skill_analysis: true,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        // Create new profile
        await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            skills,
            has_completed_skill_analysis: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }

      // Update local state
      setState(prev => ({
        ...prev,
        hasCompletedSkillAnalysis: true,
        skills,
      }));
    } catch (error) {
      console.error('Error saving skills analysis:', error);
      throw error;
    }
  };

  // Reset skill analysis status (for testing purposes)
  const resetSkillAnalysis = () => {
    setState(prev => ({
      ...prev,
      hasCompletedSkillAnalysis: false,
      skills: [],
    }));
    
    if (user) {
      supabase
        .from('user_profiles')
        .update({
          has_completed_skill_analysis: false,
          skills: [],
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error resetting skill analysis:', error);
        });
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        ...state,
        setSkillsAnalyzed,
        resetSkillAnalysis,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}; 