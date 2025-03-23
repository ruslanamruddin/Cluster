
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateText } from '@/integrations/gemini/client';
import { Loader2, UserCog, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type EnhancementStyle = 'professional' | 'creative' | 'technical' | 'leadership';

export function ProfileEnhancer() {
  const [inputBio, setInputBio] = useState<string>('');
  const [enhancedBio, setEnhancedBio] = useState<string>('');
  const [style, setStyle] = useState<EnhancementStyle>('professional');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('input');
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const enhanceProfile = async () => {
    if (!inputBio.trim()) {
      toast({
        title: 'Please enter your profile information',
        description: 'Enter your current bio or profile information to enhance.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSelectedTab('enhanced');

    try {
      const styleGuide = {
        professional: "formal, polished, industry-standard, highlighting achievements and experience",
        creative: "innovative, engaging, unique, showcasing creativity and personality",
        technical: "detail-oriented, skill-focused, emphasizing technical abilities and projects",
        leadership: "authoritative, vision-focused, highlighting leadership skills and team achievements"
      };

      const prompt = `
        You are an expert profile writer for a hackathon platform called HackSync.
        
        CURRENT PROFILE:
        ${inputBio}
        
        STYLE GUIDANCE:
        ${styleGuide[style]}
        
        Task: Enhance this user's profile/bio to make it more compelling, engaging, and professional.
        The enhanced profile should:
        1. Maintain the same key information but present it more effectively
        2. Be well-structured and easy to read
        3. Highlight key skills and achievements more clearly
        4. Match the requested style: ${style}
        5. Be approximately the same length as the original
        
        Only return the enhanced profile text with no additional explanation or commentary.
      `;

      const response = await generateText(prompt);
      setEnhancedBio(response.trim());
    } catch (error) {
      console.error('Error enhancing profile:', error);
      toast({
        title: 'Error enhancing profile',
        description: 'There was an error enhancing your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedBio);
    setCopied(true);
    toast({
      title: 'Copied to clipboard',
      description: 'The enhanced profile has been copied to your clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          AI Profile Enhancer
        </CardTitle>
        <CardDescription>
          Let AI improve your profile to make it more compelling
        </CardDescription>
      </CardHeader>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <CardContent>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Original Profile</TabsTrigger>
            <TabsTrigger value="enhanced" disabled={!enhancedBio && !loading}>
              Enhanced Profile {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label>Enhancement Style</Label>
              <RadioGroup 
                defaultValue="professional" 
                className="flex space-x-4"
                value={style}
                onValueChange={(value) => setStyle(value as EnhancementStyle)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="style-professional" />
                  <Label htmlFor="style-professional">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creative" id="style-creative" />
                  <Label htmlFor="style-creative">Creative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="technical" id="style-technical" />
                  <Label htmlFor="style-technical">Technical</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leadership" id="style-leadership" />
                  <Label htmlFor="style-leadership">Leadership</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input-bio">Your Current Profile</Label>
              <Textarea
                id="input-bio"
                placeholder="Paste your current bio or profile information here..."
                value={inputBio}
                onChange={(e) => setInputBio(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="enhanced" className="pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Enhancing your profile...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={enhancedBio}
                    readOnly
                    className="min-h-[200px] pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setInputBio('');
            setEnhancedBio('');
            setSelectedTab('input');
          }}
        >
          Clear
        </Button>
        <Button 
          onClick={enhanceProfile} 
          disabled={loading || !inputBio.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>Enhance Profile</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
