
import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  User,
  AlertCircle,
  Timer,
  CircleAlert
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'completed' | 'in-progress' | 'pending';
  startTime: string;
  completionTime: string | null;
  duration?: number; // Actual duration if completed
  estimatedDuration?: number; // Estimated duration if not completed
}

interface TaskProgressProps {
  tasks: Task[];
}

const TaskProgress: React.FC<TaskProgressProps> = ({ tasks }) => {
  const formatTimeSpent = (startTime: string, completionTime: string | null) => {
    if (!completionTime) return 'In progress';
    
    const start = new Date(startTime);
    const end = new Date(completionTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'pending':
        return <CircleAlert className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getProgressValue = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        if (task.estimatedDuration) {
          // Calculate approximately how much time has passed since the start
          const start = new Date(task.startTime).getTime();
          const now = new Date().getTime();
          const elapsed = now - start;
          const estimatedMs = task.estimatedDuration * 60 * 1000;
          const progress = Math.min(Math.floor((elapsed / estimatedMs) * 100), 99);
          return progress;
        }
        return 50; // Default value if we don't have enough information
      case 'pending':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No tasks assigned yet.</p>
        </div>
      ) : (
        tasks.map((task) => {
          const progressValue = getProgressValue(task);
          
          return (
            <Card key={task.id} className={cn(
              "overflow-hidden transition-all",
              task.status === 'completed' && "border-green-200 bg-green-50/50",
              task.status === 'in-progress' && "border-amber-200 bg-amber-50/50",
            )}>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-medium">{task.title}</h3>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeSpent(task.startTime, task.completionTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{task.status === 'completed' ? 'Completed' : `${progressValue}% complete`}</span>
                      {task.estimatedDuration && task.status !== 'completed' && (
                        <span className="flex items-center space-x-1">
                          <Timer className="h-3 w-3" />
                          <span>Est. {task.estimatedDuration} min</span>
                        </span>
                      )}
                    </div>
                    <Progress value={progressValue} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default TaskProgress;
