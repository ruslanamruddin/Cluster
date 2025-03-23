import { ProjectIdeaGenerator, ProfileEnhancer } from '@/components/AI';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles } from 'lucide-react';

export default function AITools() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
            <p className="text-muted-foreground">
              Powered by Google Gemini AI to enhance your hackathon experience
            </p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI Powered</span>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              HackHub AI Tools
            </CardTitle>
            <CardDescription>
              Use these AI-powered tools to enhance your hackathon project and collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ideas" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ideas">Project Ideas</TabsTrigger>
                <TabsTrigger value="profile">Profile Enhancer</TabsTrigger>
              </TabsList>
              <TabsContent value="ideas" className="mt-6">
                <div className="flex justify-center">
                  <ProjectIdeaGenerator />
                </div>
              </TabsContent>
              <TabsContent value="profile" className="mt-6">
                <div className="flex justify-center">
                  <ProfileEnhancer />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How AI Can Help Your Hackathon</CardTitle>
              <CardDescription>Enhance your project with AI capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Project Ideation</span>
                    <p className="text-sm text-muted-foreground">Generate innovative project ideas based on themes and technologies</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Profile Enhancement</span>
                    <p className="text-sm text-muted-foreground">Improve your profile to attract potential team members</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Team Formation</span>
                    <p className="text-sm text-muted-foreground">Get AI-powered recommendations for potential team members</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Project Enhancement</span>
                    <p className="text-sm text-muted-foreground">Get suggestions to improve your project description and presentation</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Your hackathon companion available anywhere in the app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The AI Assistant is available throughout the app by clicking the assistant icon in the bottom right corner.
                You can ask it questions about:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">How to build effective teams for your hackathon project</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">Technical advice for implementing project features</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">Guidance on organizing tasks and project management</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/10 p-1 rounded mt-0.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">Help with preparing presentations and demos</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 