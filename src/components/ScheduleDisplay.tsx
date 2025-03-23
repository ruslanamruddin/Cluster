
import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface Event {
  id: string;
  time: string;
  title: string;
  location: string;
  duration: number;
}

interface DaySchedule {
  id: string;
  day: string;
  date: Date;
  events: Event[];
}

interface ScheduleDisplayProps {
  daySchedule: DaySchedule;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ daySchedule }) => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{daySchedule.day}</h2>
        <p className="text-muted-foreground">
          {daySchedule.date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Time</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {daySchedule.events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {event.time}
                </div>
              </TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {event.location}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {event.duration > 0 ? `${event.duration} min` : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleDisplay;
