
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { supabaseApi } from '@/integrations/supabase/api';
import { Skill } from '@/components/ProfileCard';
import { Database } from '@/integrations/supabase/types';

interface UserProfileState {
  hasCompletedSkillAnalysis: boolean;
  skills: Skill[];
  isLoading: boolean;
}

interface UserProfileContextType extends UserProfileState {
  setSkillsAnalyzed: (skills: Skill[]) => Promise<void>;
  resetSkillAnalysis: () => void;
}

interface UserProfileData {
  has_completed_skill_analysis?: boolean;
  skills?: Skill[];
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
        const response = await supabaseApi.getById<Database['public']['Tables']['user_profiles']['Row']>(
          'user_profiles',
          user.id,
          'user_id',
          'skills, has_completed_skill_analysis'
        );

        if (response.error && response.status !== 404) {
          console.error('Error fetching user profile:', response.error);
          throw new Error(response.error);
        }

        if (response.data) {
          setState({
            hasCompletedSkillAnalysis: response.data.has_completed_skill_analysis || false,
            skills: (response.data.skills as Skill[]) || [],
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
      // Check if profile exists
      const existingProfile = await supabaseApi.getById(
        'user_profiles',
        user.id,
        'user_id',
        'id'
      );

      const profileData = {
        user_id: user.id,
        skills,
        has_completed_skill_analysis: true,
        updated_at: new Date().toISOString()
      };

      // If profile exists, update it; otherwise, create a new one
      if (existingProfile.data) {
        await supabaseApi.update(
          'user_profiles',
          user.id,
          profileData,
          'user_id'
        );
      } else {
        // Add created_at for new profiles
        await supabaseApi.insert(
          'user_profiles',
          {
            ...profileData,
            created_at: new Date().toISOString()
          }
        );
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
  const resetSkillAnalysis = async () => {
    setState(prev => ({
      ...prev,
      hasCompletedSkillAnalysis: false,
      skills: [],
    }));
    
    if (user) {
      const response = await supabaseApi.update(
        'user_profiles',
        user.id,
        {
          has_completed_skill_analysis: false,
          skills: [],
        },
        'user_id'
      );
      
      if (response.error) {
        console.error('Error resetting skill analysis:', response.error);
      }
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
