import React from 'react';
import Layout from '@/components/Layout';
import AIAssistant from '@/components/AIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AITools = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">AI Tools</h1>
        
        <Tabs defaultValue="assistant" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="code-helper">Code Helper</TabsTrigger>
            <TabsTrigger value="idea-generator">Idea Generator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant" className="space-y-4">
            <AIAssistant />
          </TabsContent>
          
          <TabsContent value="code-helper" className="space-y-4">
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Code Helper</h2>
              <p className="text-muted-foreground mb-4">
                Get help with coding problems, debug issues, or generate boilerplate code.
              </p>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="idea-generator" className="space-y-4">
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Project Idea Generator</h2>
              <p className="text-muted-foreground mb-4">
                Need inspiration? Generate hackathon project ideas based on your interests and skills.
              </p>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AITools; 