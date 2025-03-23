
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { TimeField } from '@/components/ui/TimeField';
import { PlusCircle, Trash2, Edit, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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
  hackathon_id: string;
}

interface EventCreationFormProps {
  hackathonId: string;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ hackathonId }) => {
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('event');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<Date | undefined>(new Date());
  const [endTime, setEndTime] = useState<Date | undefined>(
    new Date(new Date().setHours(new Date().getHours() + 1))
  );
  const [day, setDay] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('hackathon_events')
          .select('*')
          .eq('hackathon_id', hackathonId)
          .order('day', { ascending: true })
          .order('start_time', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setEvents(data as HackathonEvent[]);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (hackathonId) {
      fetchEvents();
    }
  }, [hackathonId, refreshKey]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setEventType('event');
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date(new Date().setHours(new Date().getHours() + 1)));
    setDay(1);
    setIsEditing(false);
    setCurrentEventId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Format date and time
      const formattedDate = format(date!, 'yyyy-MM-dd');
      const formattedStartTime = format(startTime!, 'HH:mm:ss');
      const formattedEndTime = format(endTime!, 'HH:mm:ss');
      
      const eventData = {
        title,
        description: description || null,
        location: location || null,
        event_date: formattedDate,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        event_type: eventType,
        day,
        hackathon_id: hackathonId,
      };
      
      if (isEditing && currentEventId) {
        // Update existing event
        const { error } = await supabase
          .from('hackathon_events')
          .update(eventData)
          .eq('id', currentEventId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from('hackathon_events')
          .insert([eventData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
      
      // Reset form and refresh events list
      resetForm();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update event" : "Failed to create event",
        variant: "destructive",
      });
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: HackathonEvent) => {
    setTitle(event.title);
    setDescription(event.description || '');
    setLocation(event.location || '');
    setEventType(event.event_type);
    setDay(event.day);
    setDate(new Date(event.event_date));
    
    // Parse time strings
    const parseTimeString = (timeString: string) => {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date;
    };
    
    setStartTime(parseTimeString(event.start_time));
    setEndTime(parseTimeString(event.end_time));
    
    setIsEditing(true);
    setCurrentEventId(event.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('hackathon_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      
      // Refresh events list
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
      console.error('Error deleting event:', err);
    } finally {
      setLoading(false);
    }
  };

  const eventTypeOptions = [
    { value: 'event', label: 'General Event' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'meal', label: 'Meal' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'networking', label: 'Networking' },
    { value: 'task', label: 'Task' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event Title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event Description (optional)"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select
                  value={eventType}
                  onValueChange={setEventType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="day">Day Number*</Label>
                <Input
                  id="day"
                  type="number"
                  min={1}
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value, 10) || 1)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <DatePicker
                  date={date}
                  setDate={setDate}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time*</Label>
                <div className="flex items-center space-x-2">
                  <TimeField
                    value={startTime}
                    onChange={setStartTime}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time*</Label>
                <div className="flex items-center space-x-2">
                  <TimeField
                    value={endTime}
                    onChange={setEndTime}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={loading}
              >
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground">No events have been created yet.</p>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <div 
                  key={event.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Day {event.day} • {event.event_type} • 
                        {format(new Date(event.event_date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm">
                        {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                        {event.location && ` • ${event.location}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreationForm;
