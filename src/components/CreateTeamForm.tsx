
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  projectIdea: z.string().min(20, {
    message: "Project idea must be at least 20 characters.",
  }),
});

const CreateTeamForm = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      projectIdea: "",
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This will be replaced with actual API call once Supabase is connected
    console.log({ ...values, tags });
    
    toast({
      title: "Team created!",
      description: "Your team has been successfully created.",
    });
    
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Awesome Coders" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A brief description of your team" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This will be displayed on your team card.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="projectIdea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Idea</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project idea in detail" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This will help us suggest tasks based on team members' skills.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Skills Needed</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-tech-accent1/20 text-tech-accent1 border-tech-accent1/30 flex items-center gap-1"
              >
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(index)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="React, UI/UX, ML, etc."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={addTag}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <FormDescription>
            Add skills that you're looking for in team members.
          </FormDescription>
        </div>
        
        <Button 
          type="submit"
          className="w-full bg-cta-gradient hover:shadow-neon-cyan transition-all duration-300"
        >
          Create Team
        </Button>
      </form>
    </Form>
  );
};

export default CreateTeamForm;
