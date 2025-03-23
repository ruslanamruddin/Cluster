
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Hackathon {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

interface HackathonContextType {
  currentHackathon: Hackathon | null;
  setCurrentHackathon: (hackathon: Hackathon | null) => void;
  hackathons: Hackathon[];
  isLoading: boolean;
  joinHackathon: (hackathonId: string) => Promise<void>;
  createHackathon: (name: string, description: string) => Promise<void>;
  refreshHackathons: () => Promise<void>;
}

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

export const HackathonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHackathon, setCurrentHackathon] = useState<Hackathon | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshHackathons = async () => {
    if (!user) {
      setHackathons([]);
      setCurrentHackathon(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get hackathons that the user is a member of
      const { data: memberships, error: membershipError } = await supabase
        .from('hackathon_members')
        .select('hackathon_id')
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;
      
      if (memberships && memberships.length > 0) {
        const hackathonIds = memberships.map(m => m.hackathon_id);
        
        // Get the details of these hackathons
        const { data: hackathonData, error: hackathonError } = await supabase
          .from('hackathons')
          .select('*')
          .in('id', hackathonIds)
          .order('name');
        
        if (hackathonError) throw hackathonError;
        
        setHackathons(hackathonData as Hackathon[]);
        
        // If we don't have a current hackathon set but we have hackathons, set the first one
        if (!currentHackathon && hackathonData && hackathonData.length > 0) {
          setCurrentHackathon(hackathonData[0] as Hackathon);
          localStorage.setItem('currentHackathonId', hackathonData[0].id);
        }
      } else {
        // If user isn't a member of any hackathons, try to get all public ones
        const { data: publicHackathons, error: publicError } = await supabase
          .from('hackathons')
          .select('*')
          .eq('is_active', true)
          .order('name');
          
        if (publicError) throw publicError;
        
        setHackathons(publicHackathons as Hackathon[]);
      }
    } catch (error) {
      console.error('Error loading hackathons:', error);
      toast({
        variant: "destructive",
        title: "Failed to load hackathons",
        description: `Error: ${(error as Error).message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinHackathon = async (hackathonId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to join a hackathon",
      });
      return;
    }

    try {
      // Check if user is already a member
      const { data: existingMembership, error: checkError } = await supabase
        .from('hackathon_members')
        .select('id')
        .eq('hackathon_id', hackathonId)
        .eq('user_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found is fine
        throw checkError;
      }
      
      if (existingMembership) {
        // User is already a member, just set as current
        const { data: hackathon, error: hackathonError } = await supabase
          .from('hackathons')
          .select('*')
          .eq('id', hackathonId)
          .single();
          
        if (hackathonError) throw hackathonError;
        
        setCurrentHackathon(hackathon as Hackathon);
        localStorage.setItem('currentHackathonId', hackathonId);
        
        toast({
          title: "Hackathon selected",
          description: `You've switched to ${hackathon.name}`,
        });
        return;
      }
      
      // Join the hackathon
      const { error: joinError } = await supabase
        .from('hackathon_members')
        .insert({ hackathon_id: hackathonId, user_id: user.id });
        
      if (joinError) throw joinError;
      
      // Get the hackathon details
      const { data: hackathon, error: hackathonError } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', hackathonId)
        .single();
        
      if (hackathonError) throw hackathonError;
      
      setCurrentHackathon(hackathon as Hackathon);
      localStorage.setItem('currentHackathonId', hackathonId);
      
      // Refresh hackathons to include the new one
      await refreshHackathons();
      
      toast({
        title: "Joined hackathon",
        description: `You've successfully joined ${hackathon.name}`,
      });
    } catch (error) {
      console.error('Error joining hackathon:', error);
      toast({
        variant: "destructive",
        title: "Failed to join hackathon",
        description: `Error: ${(error as Error).message}`,
      });
    }
  };

  const createHackathon = async (name: string, description: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a hackathon",
      });
      return;
    }

    try {
      // Create the hackathon
      const { data: newHackathon, error: createError } = await supabase
        .from('hackathons')
        .insert({ 
          name, 
          description, 
          created_by: user.id 
        })
        .select()
        .single();
        
      if (createError) throw createError;
      
      // Join the newly created hackathon
      const { error: joinError } = await supabase
        .from('hackathon_members')
        .insert({ 
          hackathon_id: newHackathon.id, 
          user_id: user.id,
          role: 'organizer'  // Make creator an organizer
        });
        
      if (joinError) throw joinError;
      
      setCurrentHackathon(newHackathon as Hackathon);
      localStorage.setItem('currentHackathonId', newHackathon.id);
      
      await refreshHackathons();
      
      toast({
        title: "Hackathon created",
        description: `You've successfully created and joined ${name}`,
      });
    } catch (error) {
      console.error('Error creating hackathon:', error);
      toast({
        variant: "destructive",
        title: "Failed to create hackathon",
        description: `Error: ${(error as Error).message}`,
      });
    }
  };

  // On initial load, try to get the hackathon from localStorage
  useEffect(() => {
    const loadSavedHackathon = async () => {
      const savedHackathonId = localStorage.getItem('currentHackathonId');
      
      if (savedHackathonId && user) {
        try {
          const { data, error } = await supabase
            .from('hackathons')
            .select('*')
            .eq('id', savedHackathonId)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setCurrentHackathon(data as Hackathon);
          }
        } catch (error) {
          console.error('Error loading saved hackathon:', error);
          localStorage.removeItem('currentHackathonId');
        }
      }
      
      refreshHackathons();
    };
    
    loadSavedHackathon();
  }, [user]);

  return (
    <HackathonContext.Provider value={{
      currentHackathon,
      setCurrentHackathon,
      hackathons,
      isLoading,
      joinHackathon,
      createHackathon,
      refreshHackathons
    }}>
      {children}
    </HackathonContext.Provider>
  );
};

export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (context === undefined) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
