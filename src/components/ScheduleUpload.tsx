
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ScheduleUploadProps {
  onScheduleProcessed: (schedule: any) => void;
}

const ScheduleUpload: React.FC<ScheduleUploadProps> = ({ onScheduleProcessed }) => {
  const [scheduleText, setScheduleText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProcessSchedule = async () => {
    if (!scheduleText.trim()) {
      toast({
        title: 'Empty input',
        description: 'Please enter a schedule to process.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would call an API to process the schedule
      // using AI. For now, we'll simulate a response.
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sample AI-processed schedule (with dates based on current date)
      const now = new Date();
      const day1 = new Date(now);
      const day2 = new Date(now);
      day2.setDate(day2.getDate() + 1);
      const day3 = new Date(now);
      day3.setDate(day3.getDate() + 2);

      const processedSchedule = [
        {
          id: '1',
          day: 'Day 1',
          date: day1,
          events: [
            { id: '1-1', time: '09:00 AM', title: 'Registration', location: 'Main Hall', duration: 60 },
            { id: '1-2', time: '10:00 AM', title: 'Kickoff', location: 'Auditorium', duration: 60 },
            { id: '1-3', time: '11:00 AM', title: 'Ideation Workshop', location: 'Workshop Room', duration: 90 },
          ]
        },
        {
          id: '2',
          day: 'Day 2',
          date: day2,
          events: [
            { id: '2-1', time: '09:00 AM', title: 'Morning Check-in', location: 'Main Hall', duration: 30 },
            { id: '2-2', time: '12:00 PM', title: 'Mentor Sessions', location: 'Mentoring Area', duration: 180 },
          ]
        },
        {
          id: '3',
          day: 'Day 3',
          date: day3,
          events: [
            { id: '3-1', time: '10:00 AM', title: 'Final Submissions', location: 'Main Hall', duration: 120 },
            { id: '3-2', time: '01:00 PM', title: 'Presentations', location: 'Auditorium', duration: 180 },
            { id: '3-3', time: '05:00 PM', title: 'Awards Ceremony', location: 'Auditorium', duration: 60 },
          ]
        }
      ];

      onScheduleProcessed(processedSchedule);
      
      toast({
        title: 'Schedule processed successfully',
        description: 'Your hackathon schedule has been analyzed and processed.',
      });
    } catch (error) {
      toast({
        title: 'Processing failed',
        description: 'There was an error processing your schedule.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste your hackathon schedule here... (e.g., 'Day 1: 9:00 AM - Registration, 10:00 AM - Opening Ceremony...')"
        value={scheduleText}
        onChange={(e) => setScheduleText(e.target.value)}
        className="min-h-[150px]"
      />
      
      <Button 
        onClick={handleProcessSchedule} 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Process Schedule
          </>
        )}
      </Button>
    </div>
  );
};

export default ScheduleUpload;
