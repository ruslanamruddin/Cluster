
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ScheduleCalendar, ScheduleContent } from '@/components/Schedule';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { sampleSchedule, sampleTeamTasks } from '@/data/sampleScheduleData';
import { useHackathon } from '@/context/HackathonContext';
import { useAuth } from '@/context/AuthContext';
import { HackathonSelector } from '@/components/Hackathon';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Events = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState(sampleSchedule);
  const [teamTasks, setTeamTasks] = useState(sampleTeamTasks);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { currentHackathon, isLoading: isHackathonLoading } = useHackathon();

  const handleScheduleProcessed = (processedSchedule: any) => {
    setSchedule(processedSchedule);
    toast({
      title: 'Schedule processed',
      description: 'Your hackathon schedule has been processed and displayed.',
    });
  };

  const findScheduleForDate = () => {
    if (!selectedDate) return null;
    
    const formattedDate = selectedDate.toDateString();
    return schedule.find(day => day.date.toDateString() === formattedDate);
  };

  const selectedDaySchedule = findScheduleForDate();

  if (loading || isHackathonLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Hackathon Events</h1>
          <HackathonSelector />
        </div>
        
        {!currentHackathon ? (
          <Card>
            <CardContent className="pt-6">
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No hackathon selected</AlertTitle>
                <AlertDescription>
                  Please select or create a hackathon from the dropdown above to view events.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <Alert variant="default">
                <AlertTitle>Current Hackathon: {currentHackathon.name}</AlertTitle>
                <AlertDescription>
                  {currentHackathon.description || 'No description provided'}
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ScheduleCalendar 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                schedule={schedule}
                onScheduleProcessed={handleScheduleProcessed}
              />
              
              <ScheduleContent 
                selectedDaySchedule={selectedDaySchedule}
                teamTasks={teamTasks}
                defaultTab="events"
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Events;
