
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface TimeFieldProps {
  value?: Date;
  onChange: (date: Date) => void;
}

export const TimeField: React.FC<TimeFieldProps> = ({ value, onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '15', '30', '45'];

  const selectedHour = value ? value.getHours() : 0;
  const selectedMinute = value ? Math.floor(value.getMinutes() / 15) * 15 : 0;

  const handleHourChange = (hourStr: string) => {
    const hour = parseInt(hourStr, 10);
    const newDate = new Date(value || new Date());
    newDate.setHours(hour);
    onChange(newDate);
  };

  const handleMinuteChange = (minuteStr: string) => {
    const minute = parseInt(minuteStr, 10);
    const newDate = new Date(value || new Date());
    newDate.setMinutes(minute);
    onChange(newDate);
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
  };

  return (
    <div className="flex space-x-2">
      <Select
        value={selectedHour.toString()}
        onValueChange={handleHourChange}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour.toString()}>
              {formatHour(hour)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={selectedMinute.toString()}
        onValueChange={handleMinuteChange}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
