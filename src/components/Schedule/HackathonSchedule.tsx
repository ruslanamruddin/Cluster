
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Loader2, Calendar, Clock, MapPin } from 'lucide-react';

interface HackathonEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  event_date: string;
  event_type: string;
  day: number;
}

interface HackathonScheduleProps {
  hackathonId: string;
}

const HackathonSchedule: React.FC<HackathonScheduleProps> = ({ hackathonId }) => {
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<number[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('hackathon_events')
          .select('*')
          .eq('hackathon_id', hackathonId)
          .order('start_time', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setEvents(data as HackathonEvent[]);
          
          // Get unique days
          const uniqueDays = [...new Set(data.map(event => event.day))].sort((a, b) => a - b);
          setDays(uniqueDays);
          
          // Set current day to the first day if available
          if (uniqueDays.length > 0) {
            setCurrentDay(uniqueDays[0]);
          }
        }
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (hackathonId) {
      fetchEvents();
    }
  }, [hackathonId]);

  const formatTime = (timeString: string) => {
    try {
      // Parse time string (format: HH:MM:SS)
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return format(date, 'h:mm a'); // Format as "1:30 PM"
    } catch (err) {
      console.error('Error formatting time:', err);
      return timeString;
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'meal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'presentation':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'networking':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'task':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No events have been scheduled yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Hackathon Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        {days.length > 0 && (
          <Tabs 
            value={currentDay.toString()} 
            onValueChange={(value) => setCurrentDay(parseInt(value, 10))}
          >
            <TabsList className="mb-4">
              {days.map(day => (
                <TabsTrigger key={day} value={day.toString()}>
                  Day {day}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {days.map(day => (
              <TabsContent key={day} value={day.toString()}>
                <div className="space-y-4">
                  {events
                    .filter(event => event.day === day)
                    .map(event => (
                      <div 
                        key={event.id} 
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type}
                          </Badge>
                        </div>
                        
                        {event.description && (
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(event.start_time)} - {formatTime(event.end_time)}
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default HackathonSchedule;
