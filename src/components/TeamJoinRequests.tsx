
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react';

interface TeamJoinRequest {
  id: string;
  user_id: string;
  team_id: string;
  status: string;
  created_at: string;
  user_name: string;
  user_avatar: string;
  user_title: string;
  user_skills: any;
}

interface TeamJoinRequestsProps {
  teamId: string;
  isAdmin: boolean;
}

const TeamJoinRequests: React.FC<TeamJoinRequestsProps> = ({ 
  teamId,
  isAdmin
}) => {
  const [requests, setRequests] = useState<TeamJoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchJoinRequests();
    
    // Set up real-time subscription for new join requests
    const channel = supabase
      .channel('join-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_join_requests',
          filter: `team_id=eq.${teamId}`
        },
        () => {
          fetchJoinRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  const fetchJoinRequests = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('team_join_requests_view')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching join requests:', error);
      toast({
        title: "Failed to load join requests",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    if (!isAdmin) return;
    
    try {
      setProcessingIds(prev => [...prev, requestId]);
      
      const { data, error } = await supabase.rpc(
        'process_join_request',
        {
          p_request_id: requestId,
          p_status: action,
          p_admin_user_id: (await supabase.auth.getUser()).data.user?.id
        }
      );
      
      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      toast({
        title: action === 'approved' ? "Request Approved" : "Request Rejected",
        description: data.message,
      });
      
      fetchJoinRequests();
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Action Failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== requestId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/20 rounded-lg border border-dashed">
        <User className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium">No Join Requests</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are currently no pending requests to join this team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className={
          request.status === 'pending' 
            ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/10'
            : request.status === 'approved'
              ? 'border-green-200 bg-green-50 dark:bg-green-950/10'
              : 'border-red-200 bg-red-50 dark:bg-red-950/10'
        }>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={request.user_avatar} />
                  <AvatarFallback>
                    {request.user_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-base">{request.user_name}</h3>
                  <p className="text-sm text-muted-foreground">{request.user_title || 'Team Member'}</p>
                </div>
              </div>
              <Badge
                className={
                  request.status === 'pending' 
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                    : request.status === 'approved'
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : 'bg-red-100 text-red-800 hover:bg-red-100'
                }
              >
                {request.status === 'pending' ? (
                  <Clock className="h-3 w-3 mr-1" />
                ) : request.status === 'approved' ? (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {request.user_skills && Array.isArray(request.user_skills) 
                    ? request.user_skills.map((skill: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.name}
                          {skill.level && (
                            <span className="ml-1 opacity-70">
                              ({skill.level})
                            </span>
                          )}
                        </Badge>
                      ))
                    : <span className="text-sm text-muted-foreground">No skills listed</span>
                  }
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Request submitted: {formatDate(request.created_at)}
                </span>
              </div>

              {isAdmin && request.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRequestAction(request.id, 'approved')}
                    disabled={processingIds.includes(request.id)}
                  >
                    {processingIds.includes(request.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRequestAction(request.id, 'rejected')}
                    disabled={processingIds.includes(request.id)}
                  >
                    {processingIds.includes(request.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamJoinRequests;
