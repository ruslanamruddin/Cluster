
// Sample schedule data that would typically come from an API/database
export const sampleSchedule = [
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

// Sample team tasks with completion times
export const sampleTeamTasks = [
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
