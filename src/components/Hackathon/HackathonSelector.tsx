
import React, { useState } from 'react';
import { useHackathon, Hackathon } from '@/context/HackathonContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, Plus, RefreshCw } from 'lucide-react';

const HackathonSelector: React.FC = () => {
  const { currentHackathon, setCurrentHackathon, hackathons, isLoading, joinHackathon, createHackathon, refreshHackathons } = useHackathon();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newHackathonName, setNewHackathonName] = useState('');
  const [newHackathonDescription, setNewHackathonDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHackathonChange = (value: string) => {
    if (value === "create-new") {
      setIsCreateDialogOpen(true);
      return;
    }
    
    const selected = hackathons.find(h => h.id === value);
    if (selected) {
      joinHackathon(selected.id);
    }
  };

  const handleCreateHackathon = async () => {
    if (!newHackathonName.trim()) return;
    
    setIsSubmitting(true);
    await createHackathon(newHackathonName.trim(), newHackathonDescription.trim());
    setIsSubmitting(false);
    setIsCreateDialogOpen(false);
    setNewHackathonName('');
    setNewHackathonDescription('');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-[200px]">
        <Select
          value={currentHackathon?.id}
          onValueChange={handleHackathonChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select hackathon" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {hackathons.map((hackathon) => (
                <SelectItem key={hackathon.id} value={hackathon.id}>
                  {hackathon.name}
                </SelectItem>
              ))}
              <SelectItem value="create-new" className="font-medium text-primary">
                + Create New Hackathon
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-8 top-0 h-full"
          onClick={() => refreshHackathons()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Hackathon</DialogTitle>
            <DialogDescription>
              Create a new hackathon to collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="hackathon-name">Hackathon Name</Label>
              <Input
                id="hackathon-name"
                placeholder="Enter hackathon name"
                value={newHackathonName}
                onChange={(e) => setNewHackathonName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hackathon-description">Description</Label>
              <Textarea
                id="hackathon-description"
                placeholder="Describe the hackathon..."
                value={newHackathonDescription}
                onChange={(e) => setNewHackathonDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateHackathon} 
              disabled={!newHackathonName.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Hackathon'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HackathonSelector;
