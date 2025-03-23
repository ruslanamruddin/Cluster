
import { Check, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export type TaskStatus = "todo" | "in-progress" | "completed" | "blocked";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: TaskMember;
  skills: string[];
}

interface TaskListProps {
  tasks: Task[];
  onAssignTask?: (taskId: string) => void;
  onViewTask?: (taskId: string) => void;
}

const TaskList = ({ tasks, onAssignTask, onViewTask }: TaskListProps) => {
  // Status styling
  const statusStyles = {
    "todo": {
      icon: Clock,
      color: "text-muted-foreground bg-muted/20" 
    },
    "in-progress": {
      icon: Clock,
      color: "text-blue-400 bg-blue-500/20"
    },
    "completed": {
      icon: Check,
      color: "text-green-400 bg-green-500/20"
    },
    "blocked": {
      icon: AlertCircle,
      color: "text-red-400 bg-red-500/20"
    }
  };
  
  // Priority styling
  const priorityStyles = {
    "low": "text-green-400 bg-green-500/20",
    "medium": "text-yellow-400 bg-yellow-500/20",
    "high": "text-red-400 bg-red-500/20"
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Skills Needed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${statusStyles[task.status].color}`}>
                  {(() => {
                    const StatusIcon = statusStyles[task.status].icon;
                    return <StatusIcon className="h-3 w-3 mr-1" />;
                  })()}
                  <span className="capitalize">{task.status.replace('-', ' ')}</span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${priorityStyles[task.priority]}`}>
                  <span className="capitalize">{task.priority}</span>
                </Badge>
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      {task.assignee.avatar ? (
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      ) : (
                        <AvatarFallback className="text-xs">
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {task.skills.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {task.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{task.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {!task.assignee && onAssignTask && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 bg-tech-accent1/10 hover:bg-tech-accent1/20 border-tech-accent1/20"
                      onClick={() => onAssignTask(task.id)}
                    >
                      Assign
                    </Button>
                  )}
                  {onViewTask && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8"
                      onClick={() => onViewTask(task.id)}
                    >
                      View
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
