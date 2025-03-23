
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import ScheduleUpload from '@/components/ScheduleUpload';
import { useAuth } from '@/context/AuthContext';

interface ScheduleCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  schedule: any[];
  onScheduleProcessed: (processedSchedule: any) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  selectedDate,
  setSelectedDate,
  schedule,
  onScheduleProcessed,
}) => {
  const { user } = useAuth();

  return (
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
          disabled={(date) => {
            // Only enable dates that have scheduled events
            return !schedule.some(day => day.date.toDateString() === date.toDateString());
          }}
        />
        
        {user && (
          <div className="mt-6">
            <ScheduleUpload onScheduleProcessed={onScheduleProcessed} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
