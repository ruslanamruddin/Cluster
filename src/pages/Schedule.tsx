import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import ScheduleDisplay from '@/components/ScheduleDisplay';
import TaskProgress from '@/components/TaskProgress';
import ScheduleUpload from '@/components/ScheduleUpload';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CalendarClock, ListChecks } from 'lucide-react';

// Sample schedule data - in a real app, this would come from an API/database
const sampleSchedule = [
  {
    id: '1',
    day: 'Day 1',
    date: new Date('2023-07-15'),
    events: [
      { id: '1-1', time: '09:00 AM', title: 'Registration & Check-in', location: 'Main Hall', duration: 60 },
      { id: '1-2', time: '10:00 AM', title: 'Opening Ceremony', location: 'Auditorium', duration: 60 },
      { id: '1-3', time: '11:00 AM', title: 'Team Formation', location: 'Collaboration Space', duration: 90 },
      { id: '1-4', time: '12:30 PM', title: 'Lunch Break', location: 'Cafeteria', duration: 60 },
      { id: '1-5', time: '01:30 PM', title: 'Hacking Begins', location: 'All Spaces', duration: 0 },
      { id: '1-6', time: '03:00 PM', title: 'Workshop: API Integration', location: 'Workshop Room A', duration: 60 },
      { id: '1-7', time: '06:00 PM', title: 'Dinner', location: 'Cafeteria', duration: 60 },
      { id: '1-8', time: '08:00 PM', title: 'Networking Event', location: 'Lounge', duration: 120 },
    ]
  },
  {
    id: '2',
    day: 'Day 2',
    date: new Date('2023-07-16'),
    events: [
      { id: '2-1', time: '08:00 AM', title: 'Breakfast', location: 'Cafeteria', duration: 60 },
      { id: '2-2', time: '09:00 AM', title: 'Workshop: UI/UX Design', location: 'Workshop Room B', duration: 60 },
      { id: '2-3', time: '12:00 PM', title: 'Lunch Break', location: 'Cafeteria', duration: 60 },
      { id: '2-4', time: '02:00 PM', title: 'Mentorship Sessions', location: 'Mentoring Booths', duration: 180 },
      { id: '2-5', time: '06:00 PM', title: 'Dinner', location: 'Cafeteria', duration: 60 },
      { id: '2-6', time: '08:00 PM', title: 'Game Night', location: 'Recreation Room', duration: 120 },
    ]
  },
  {
    id: '3',
    day: 'Day 3',
    date: new Date('2023-07-17'),
    events: [
      { id: '3-1', time: '08:00 AM', title: 'Breakfast', location: 'Cafeteria', duration: 60 },
      { id: '3-2', time: '09:00 AM', title: 'Final Hacking Hour', location: 'All Spaces', duration: 180 },
      { id: '3-3', time: '12:00 PM', title: 'Hacking Ends', location: 'All Spaces', duration: 0 },
      { id: '3-4', time: '12:30 PM', title: 'Lunch Break', location: 'Cafeteria', duration: 60 },
      { id: '3-5', time: '01:30 PM', title: 'Project Presentations', location: 'Auditorium', duration: 180 },
      { id: '3-6', time: '04:30 PM', title: 'Judging Period', location: 'Judging Area', duration: 90 },
      { id: '3-7', time: '06:00 PM', title: 'Awards Ceremony', location: 'Auditorium', duration: 60 },
      { id: '3-8', time: '07:00 PM', title: 'Closing Remarks', location: 'Auditorium', duration: 30 },
      { id: '3-9', time: '07:30 PM', title: 'After Party', location: 'Lounge', duration: 150 },
    ]
  }
];

// Sample team tasks with completion times - updating the status values to match the expected union type
const sampleTeamTasks = [
  {
    id: '1',
    title: 'Project Planning',
    assignedTo: 'Alex Johnson',
    status: 'completed' as const,
    startTime: '2023-07-15T13:30:00',
    completionTime: '2023-07-15T15:30:00',
    duration: 120, // minutes
  },
  {
    id: '2',
    title: 'API Integration',
    assignedTo: 'Sam Rodriguez',
    status: 'completed' as const,
    startTime: '2023-07-15T16:00:00',
    completionTime: '2023-07-15T19:00:00',
    duration: 180,
  },
  {
    id: '3',
    title: 'Frontend Implementation',
    assignedTo: 'Taylor Kim',
    status: 'in-progress' as const,
    startTime: '2023-07-16T09:00:00',
    completionTime: null,
    estimatedDuration: 480,
  },
  {
    id: '4',
    title: 'Database Design',
    assignedTo: 'Jordan Patel',
    status: 'pending' as const,
    startTime: '2023-07-16T13:00:00',
    completionTime: null,
    estimatedDuration: 240,
  },
  {
    id: '5',
    title: 'Testing',
    assignedTo: 'Casey Chen',
    status: 'pending' as const,
    startTime: '2023-07-17T09:00:00',
    completionTime: null,
    estimatedDuration: 180,
  },
];

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState(sampleSchedule);
  const [teamTasks, setTeamTasks] = useState(sampleTeamTasks);
  const { toast } = useToast();
  const { user } = useAuth();

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hackathon Schedule</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="mx-auto"
                disabled={date => {
                  // Only enable dates that have scheduled events
                  return !schedule.some(day => day.date.toDateString() === date.toDateString());
                }}
              />
              
              {user && (
                <div className="mt-6">
                  <ScheduleUpload onScheduleProcessed={handleScheduleProcessed} />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="events">
                <TabsList className="mb-4">
                  <TabsTrigger value="events" className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    Events
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Team Tasks
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="events">
                  {selectedDaySchedule ? (
                    <ScheduleDisplay daySchedule={selectedDaySchedule} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No events scheduled for the selected date.</p>
                      <p className="text-sm mt-2">Please select a date with scheduled events.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tasks">
                  <TaskProgress tasks={teamTasks} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
