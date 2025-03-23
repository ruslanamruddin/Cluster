
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Search, UserPlus, LogIn, CalendarDays } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HackathonSelector } from '@/components/Hackathon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHackathon } from '@/context/HackathonContext';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { hackathons } = useHackathon();

  return (
    <Layout className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">HackSync</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Build the perfect team for your next hackathon project and manage tasks efficiently
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link to="/explore">
              <Button size="lg" variant="default" className="gap-2">
                <Search size={18} />
                Find Teams
              </Button>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  <CalendarDays size={18} />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" variant="outline" className="gap-2">
                  <LogIn size={18} />
                  Sign In / Register
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full mx-auto grid-cols-2">
              <TabsTrigger value="join">Join Hackathon</TabsTrigger>
              <TabsTrigger value="create">Create Hackathon</TabsTrigger>
            </TabsList>
            <TabsContent value="join" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Join an Existing Hackathon</CardTitle>
                  <CardDescription>
                    Select a hackathon to join from the list below or create your own
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HackathonSelector />

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      {hackathons.length === 0 
                        ? "No hackathons available. Create one to get started!" 
                        : `${hackathons.length} hackathon${hackathons.length !== 1 ? 's' : ''} available`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="create" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Hackathon</CardTitle>
                  <CardDescription>
                    Start a new hackathon to collaborate with your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HackathonSelector />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to build something amazing?</h2>
          <p className="text-muted-foreground mb-6">
            HackSync helps you form the perfect team, manage your hackathon projects, and stay organized from start to finish.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link to="/explore">
                <Button className="gap-2">
                  <UserPlus size={16} />
                  Find Teammates
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="gap-2">
                  <LogIn size={16} />
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
