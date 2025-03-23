
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateText } from '@/integrations/gemini/client';
import { Loader2, Lightbulb, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProjectIdea {
  title: string;
  description: string;
  techStack: string[];
  challengeLevel: string;
  keyFeatures: string[];
}

export function ProjectIdeaGenerator() {
  const [keywords, setKeywords] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('input');
  const { toast } = useToast();

  const generateIdeas = async () => {
    if (!keywords.trim()) {
      toast({
        title: 'Please enter keywords',
        description: 'Enter some keywords, technologies, or themes to generate project ideas.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSelectedTab('ideas');

    try {
      const prompt = `
        You are an AI project idea generator for a hackathon platform.
        
        KEYWORDS/THEMES: ${keywords}
        
        Generate 3 creative and innovative hackathon project ideas based on these keywords/themes.
        For each idea, provide:
        1. A catchy title
        2. A brief description (2-3 sentences)
        3. Suggested tech stack (list of technologies)
        4. Challenge level (Beginner, Intermediate, Advanced)
        5. Key features (3-5 bullet points)
        
        Format your response as a JSON array with the following structure:
        [
          {
            "title": "Project Title",
            "description": "Project description",
            "techStack": ["Tech1", "Tech2", "Tech3"],
            "challengeLevel": "Beginner/Intermediate/Advanced",
            "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"]
          },
          ...
        ]
      `;

      const response = await generateText(prompt);
      const generatedIdeas = JSON.parse(response) as ProjectIdea[];
      setIdeas(generatedIdeas);
    } catch (error) {
      console.error('Error generating project ideas:', error);
      toast({
        title: 'Error generating ideas',
        description: 'There was an error generating project ideas. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Project Idea Generator
        </CardTitle>
        <CardDescription>
          Enter keywords, technologies, or themes to generate hackathon project ideas
        </CardDescription>
      </CardHeader>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <CardContent>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="ideas" disabled={ideas.length === 0 && !loading}>
              Generated Ideas {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords / Themes</Label>
                <Textarea
                  id="keywords"
                  placeholder="e.g., sustainability, AR/VR, healthcare, mobile app, React"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ideas" className="space-y-6 pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Generating creative project ideas...</p>
              </div>
            ) : (
              <>
                {ideas.map((idea, index) => (
                  <div key={index} className="space-y-4 border rounded-lg p-4">
                    <div>
                      <h3 className="text-lg font-semibold">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Tech Stack</h4>
                        <ul className="text-sm mt-1">
                          {idea.techStack.map((tech, i) => (
                            <li key={i} className="list-disc ml-4">{tech}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Key Features</h4>
                        <ul className="text-sm mt-1">
                          {idea.keyFeatures.map((feature, i) => (
                            <li key={i} className="list-disc ml-4">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm px-2 py-1 bg-muted rounded-md">
                        {idea.challengeLevel}
                      </span>
                      
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Save className="h-4 w-4" />
                        Save Idea
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setKeywords('');
            setIdeas([]);
            setSelectedTab('input');
          }}
        >
          Clear
        </Button>
        <Button 
          onClick={generateIdeas} 
          disabled={loading || !keywords.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Ideas</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
