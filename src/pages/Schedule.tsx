
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ScheduleDisplay, ScheduleUpload } from '@/components/Schedule';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useHackathon } from '@/context/HackathonContext';
import { HackathonSelector } from '@/components/Hackathon';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const { user, loading } = useAuth();
  const { currentHackathon, isLoading: isHackathonLoading } = useHackathon();

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

  // Convert the flat schedule array to a format expected by ScheduleDisplay
  const currentDaySchedule = schedule.length > 0 ? {
    id: schedule[0]?.id || '1',
    day: schedule[0]?.day || 'Day 1',
    date: schedule[0]?.date || new Date(),
    events: schedule[0]?.events || []
  } : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Hackathon Schedule</h1>
          <HackathonSelector />
        </div>

        {!currentHackathon ? (
          <Card>
            <CardContent className="pt-6">
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No hackathon selected</AlertTitle>
                <AlertDescription>
                  Please select or create a hackathon from the dropdown above to manage schedules.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScheduleUpload onScheduleProcessed={setSchedule} />
            {currentDaySchedule && <ScheduleDisplay daySchedule={currentDaySchedule} />}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Schedule;
