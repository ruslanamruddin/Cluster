
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/components/ui/use-toast';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import ScheduleContent from '@/components/ScheduleContent';
import { sampleSchedule, sampleTeamTasks } from '@/data/sampleScheduleData';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState(sampleSchedule);
  const [teamTasks, setTeamTasks] = useState(sampleTeamTasks);
  const { toast } = useToast();

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
          <ScheduleCalendar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            schedule={schedule}
            onScheduleProcessed={handleScheduleProcessed}
          />
          
          <ScheduleContent 
            selectedDaySchedule={selectedDaySchedule}
            teamTasks={teamTasks}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
