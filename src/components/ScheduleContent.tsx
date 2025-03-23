
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarClock, ListChecks } from 'lucide-react';
import ScheduleDisplay from '@/components/ScheduleDisplay';
import TaskProgress from '@/components/TaskProgress';

interface ScheduleContentProps {
  selectedDaySchedule: any;
  teamTasks: any[];
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  selectedDaySchedule,
  teamTasks,
}) => {
  return (
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
  );
};

export default ScheduleContent;
