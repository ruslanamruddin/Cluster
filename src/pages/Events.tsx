
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useHackathon } from '@/context/HackathonContext';
import HackathonSchedule from '@/components/Schedule/HackathonSchedule';
import EventCreationForm from '@/components/Schedule/EventCreationForm';

const Events = () => {
  const { user } = useAuth();
  const { currentHackathon, isLoading: hackathonLoading } = useHackathon();
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    if (user && currentHackathon) {
      // Check if the user is an organizer for this hackathon
      const checkOrganizer = async () => {
        try {
          const { data, error } = await fetch(
            `/api/check-organizer?hackathonId=${currentHackathon.id}`
          ).then(res => res.json());
          
          setIsOrganizer(data?.isOrganizer || false);
        } catch (error) {
          console.error("Error checking organizer status:", error);
          setIsOrganizer(false);
        }
      };
      
      checkOrganizer();
    }
  }, [user, currentHackathon]);

  if (hackathonLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!currentHackathon) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Events</h1>
          <p>Please select a hackathon to view its events.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">
          {currentHackathon.name} - Schedule
        </h1>
        
        <Tabs defaultValue="schedule">
          <TabsList>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            {isOrganizer && (
              <TabsTrigger value="manage">Manage Events</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="schedule">
            <HackathonSchedule hackathonId={currentHackathon.id} />
          </TabsContent>
          
          {isOrganizer && (
            <TabsContent value="manage">
              <EventCreationForm hackathonId={currentHackathon.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Events;
