import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Settings } from 'lucide-react';

const AIConfigForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState('mock');
  const [openaiKey, setOpenaiKey] = useState('');
  const [cohereKey, setCohereKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Fetch any existing settings
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // Get the AI provider setting
      const { data: providerData, error: providerError } = await supabase
        .functions.invoke('get-settings', {
          body: { key: 'AI_PROVIDER' }
        });
      
      if (providerError) throw providerError;
      if (providerData && providerData.value) {
        setProvider(providerData.value);
      }

      // Check if API keys exist (we don't fetch the actual values for security reasons)
      const { data: keysData, error: keysError } = await supabase
        .functions.invoke('get-settings', {
          body: { checkKeys: ['OPENAI_API_KEY', 'COHERE_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY'] }
        });
      
      if (keysError) throw keysError;
      
      if (keysData) {
        // Just set placeholders to indicate keys exist
        if (keysData.OPENAI_API_KEY) setOpenaiKey('••••••••••••••••••••••••••');
        if (keysData.COHERE_API_KEY) setCohereKey('••••••••••••••••••••••••••');
        if (keysData.ANTHROPIC_API_KEY) setAnthropicKey('••••••••••••••••••••••••••');
        if (keysData.GEMINI_API_KEY) setGeminiKey('••••••••••••••••••••••••••');
      }
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      toast({
        title: 'Failed to load settings',
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Save the AI provider setting
      const { error: providerError } = await supabase
        .functions.invoke('set-settings', {
          body: { key: 'AI_PROVIDER', value: provider }
        });
      
      if (providerError) throw providerError;

      // Save API keys if they're provided (not placeholders)
      if (openaiKey && !openaiKey.includes('•')) {
        const { error: openaiError } = await supabase
          .functions.invoke('set-settings', {
            body: { key: 'OPENAI_API_KEY', value: openaiKey }
          });
        if (openaiError) throw openaiError;
      }

      if (cohereKey && !cohereKey.includes('•')) {
        const { error: cohereError } = await supabase
          .functions.invoke('set-settings', {
            body: { key: 'COHERE_API_KEY', value: cohereKey }
          });
        if (cohereError) throw cohereError;
      }

      if (anthropicKey && !anthropicKey.includes('•')) {
        const { error: anthropicError } = await supabase
          .functions.invoke('set-settings', {
            body: { key: 'ANTHROPIC_API_KEY', value: anthropicKey }
          });
        if (anthropicError) throw anthropicError;
      }

      if (geminiKey && !geminiKey.includes('•')) {
        const { error: geminiError } = await supabase
          .functions.invoke('set-settings', {
            body: { key: 'GEMINI_API_KEY', value: geminiKey }
          });
        if (geminiError) throw geminiError;
      }

      toast({
        title: 'Settings saved',
        description: 'AI configuration has been updated successfully.',
      });
      
      // Refresh the form to show placeholders for saved keys
      fetchSettings();
    } catch (error) {
      console.error('Error saving AI settings:', error);
      toast({
        title: 'Failed to save settings',
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
        <CardDescription>
          Configure the AI provider and API keys for skill analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="provider">AI Provider</Label>
          <Select 
            disabled={isLoading}
            value={provider} 
            onValueChange={setProvider}
          >
            <SelectTrigger id="provider">
              <SelectValue placeholder="Select an AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mock">Mock (No API required)</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="cohere">Cohere</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="gemini">Google Gemini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {provider === 'openai' && (
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://platform.openai.com/api-keys" className="text-primary underline" target="_blank" rel="noopener noreferrer">OpenAI Dashboard</a>
            </p>
          </div>
        )}

        {provider === 'cohere' && (
          <div className="space-y-2">
            <Label htmlFor="cohere-key">Cohere API Key</Label>
            <Input
              id="cohere-key"
              type="password"
              value={cohereKey}
              onChange={(e) => setCohereKey(e.target.value)}
              placeholder="Enter your Cohere API key"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://dashboard.cohere.com/api-keys" className="text-primary underline" target="_blank" rel="noopener noreferrer">Cohere Dashboard</a>
            </p>
          </div>
        )}

        {provider === 'anthropic' && (
          <div className="space-y-2">
            <Label htmlFor="anthropic-key">Anthropic API Key</Label>
            <Input
              id="anthropic-key"
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="Enter your Anthropic API key"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://console.anthropic.com/settings/keys" className="text-primary underline" target="_blank" rel="noopener noreferrer">Anthropic Console</a>
            </p>
          </div>
        )}

        {provider === 'gemini' && (
          <div className="space-y-2">
            <Label htmlFor="gemini-key">Google Gemini API Key</Label>
            <Input
              id="gemini-key"
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://aistudio.google.com/app/apikey" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
            </p>
          </div>
        )}

        <div className="bg-muted p-4 rounded-md">
          <h4 className="text-sm font-medium flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Configuration Notes
          </h4>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li>• API keys are stored securely and never exposed to clients</li>
            <li>• Mock provider uses simple keyword matching (no API cost)</li>
            <li>• OpenAI provides the most accurate skill analysis</li>
            <li>• Changes take effect immediately for new skill analyses</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveSettings} 
          disabled={isLoading}
          className="ml-auto"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIConfigForm;
