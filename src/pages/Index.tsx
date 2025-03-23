import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Search, CalendarDays } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HackathonSelector } from '@/components/Hackathon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHackathon } from '@/context/HackathonContext';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentHackathon, hackathons } = useHackathon();
  const navigate = useNavigate();

  const handleFindTeams = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in before looking for teams",
      });
      return;
    }

    if (!currentHackathon) {
      toast({
        variant: "destructive",
        title: "Hackathon selection required",
        description: "Please join a hackathon before looking for teams",
      });
      return;
    }

    navigate('/explore');
  };

  return (
    <Layout className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Cluster</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Build the perfect team for your next hackathon project and manage tasks efficiently
          </p>
          
          {/* Step 1: Sign In First */}
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                Sign In
              </h2>
              {user ? (
                <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 p-4 rounded-lg w-full">
                  <p className="font-medium">Signed in as {user.email}</p>
                  <p className="text-sm">You're ready for the next step</p>
                </div>
              ) : (
                <Link to="/auth" className="w-full">
                  <Button size="lg" variant="default" className="w-full gap-2">
                    <LogIn size={18} />
                    Sign In / Register
                  </Button>
                </Link>
              )}
            </div>

            {/* Step 2: Join Hackathon */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md mt-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                Join a Hackathon
              </h2>
              {!user ? (
                <div className="bg-muted p-4 rounded-lg w-full opacity-70">
                  <p className="font-medium">Please sign in first</p>
                  <p className="text-sm text-muted-foreground">Step 1 required</p>
                </div>
              ) : currentHackathon ? (
                <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 p-4 rounded-lg w-full">
                  <p className="font-medium">Current hackathon: {currentHackathon.name}</p>
                  <p className="text-sm">You're ready for the next step</p>
                </div>
              ) : (
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Join or Create a Hackathon</CardTitle>
                    <CardDescription>
                      Select an existing hackathon or create your own
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="join" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="join">Join</TabsTrigger>
                        <TabsTrigger value="create">Create</TabsTrigger>
                      </TabsList>
                      <TabsContent value="join">
                        <HackathonSelector />
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">
                            {hackathons.length === 0 
                              ? "No hackathons available. Create one to get started!" 
                              : `${hackathons.length} hackathon${hackathons.length !== 1 ? 's' : ''} available`}
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="create">
                        <HackathonSelector />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Step 3: Find Teams */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md mt-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                Find Teams
              </h2>
              {!user || !currentHackathon ? (
                <div className="bg-muted p-4 rounded-lg w-full opacity-70">
                  <p className="font-medium">Complete previous steps first</p>
                  <p className="text-sm text-muted-foreground">Steps 1 and 2 required</p>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  variant="default" 
                  className="w-full gap-2" 
                  onClick={handleFindTeams}
                >
                  <Search size={18} />
                  Find Teams
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to build something amazing?</h2>
          <p className="text-muted-foreground mb-6">
            Cluster helps you form the perfect team, manage your hackathon projects, and stay organized from start to finish.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
