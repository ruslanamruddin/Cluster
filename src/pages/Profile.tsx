
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile, Skill } from '@/components/ProfileCard';
import ResumeUpload from '@/components/ResumeUpload';
import { Github, Linkedin, Plus, X, Save, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  
  // Sample user data
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user-1',
    name: 'Jamie Smith',
    title: 'Full Stack Developer',
    skills: [
      { name: 'JavaScript', level: 'expert' },
      { name: 'React', level: 'expert' },
      { name: 'Node.js', level: 'intermediate' },
      { name: 'TypeScript', level: 'intermediate' },
      { name: 'GraphQL', level: 'beginner' }
    ],
    bio: 'Full stack developer with a passion for building web applications and solving complex problems.',
    linkedIn: 'https://linkedin.com/in/jamiesmith',
    github: 'https://github.com/jamiesmith'
  });
  
  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    linkedIn: profile.linkedIn || '',
    github: profile.github || ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      linkedIn: formData.linkedIn,
      github: formData.github
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };
  
  const handleSkillsAnalyzed = (skills: Skill[]) => {
    setProfile({
      ...profile,
      skills: skills
    });
    
    toast({
      title: "Skills updated",
      description: `Your skill profile has been updated with ${skills.length} skills.`
    });
  };
  
  const handleRemoveSkill = (skillName: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill.name !== skillName)
    });
  };
  
  const getSkillBadgeColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" alt={profile.name} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">{profile.name}</CardTitle>
                <CardDescription className="text-center">{profile.title}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <Badge 
                        key={skill.name} 
                        variant="secondary"
                        className={getSkillBadgeColor(skill.level)}
                      >
                        {skill.name} ({skill.level})
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h3 className="text-sm font-medium mb-2">Connect</h3>
                  <div className="flex flex-col space-y-2">
                    {profile.github && (
                      <a 
                        href={profile.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={16} className="mr-2" />
                        GitHub
                      </a>
                    )}
                    {profile.linkedIn && (
                      <a 
                        href={profile.linkedIn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin size={16} className="mr-2" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Edit Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile Info</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Linkedin size={16} />
                          </div>
                          <Input
                            id="linkedin"
                            name="linkedIn"
                            className="pl-10"
                            value={formData.linkedIn}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub URL</Label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Github size={16} />
                          </div>
                          <Input
                            id="github"
                            name="github"
                            className="pl-10"
                            value={formData.github}
                            onChange={handleInputChange}
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save size={16} className="mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-6 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Skills</CardTitle>
                    <CardDescription>
                      Manage your skills or analyze your resume to update them
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Your Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map(skill => (
                            <div 
                              key={skill.name}
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSkillBadgeColor(skill.level)} transition-all duration-200`}
                            >
                              {skill.name} ({skill.level})
                              <button 
                                type="button"
                                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                                onClick={() => handleRemoveSkill(skill.name)}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                          {profile.skills.length === 0 && (
                            <p className="text-sm text-muted-foreground">No skills added yet</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium mb-4">Update Skills from Resume/LinkedIn</h3>
                        <ResumeUpload onSkillsAnalyzed={handleSkillsAnalyzed} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
