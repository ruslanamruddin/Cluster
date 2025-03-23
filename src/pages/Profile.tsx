import React, { useState, useEffect } from 'react';
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
import { Github, Linkedin, Plus, X, Save, Upload, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { supabase } from '@/integrations/supabase/client';
import AvatarUpload from '@/components/AvatarUpload';
import { supabaseApi, showResponseToast } from '@/integrations/supabase/api';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    skills, 
    hasCompletedSkillAnalysis, 
    isLoading, 
    setSkillsAnalyzed, 
    resetSkillAnalysis 
  } = useUserProfile();
  
  // Sample user data for form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    linkedIn: '',
    github: ''
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching profile for user:", user.id);
        const response = await supabaseApi.getById('profiles', user.id);
        
        if (response.error) {
          // If the profile doesn't exist yet, create a default one
          if (response.status === 404) {
            console.log("Profile not found, creating default profile");
            
            const defaultProfile = {
              id: user.id,
              name: user.email?.split('@')[0] || 'User',
              title: 'HackHub Member',
              bio: 'No bio yet',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            // Create a new profile
            const createResponse = await supabaseApi.insert('profiles', defaultProfile);
            if (createResponse.error) {
              console.error("Error creating default profile:", createResponse.error);
              throw new Error(createResponse.error);
            }
            
            const data = createResponse.data;
            if (data) {
              const profile: UserProfile = {
                id: data.id,
                name: data.name,
                title: data.title,
                bio: data.bio,
                linkedIn: data.linkedin_url || '',
                github: data.github_url || '',
                avatar: data.avatar_url || '',
                skills: skills || [],
                skillsAnalyzed: hasCompletedSkillAnalysis
              };
              
              setUserProfile(profile);
              setFormData({
                name: profile.name,
                title: profile.title,
                bio: profile.bio,
                linkedIn: profile.linkedIn,
                github: profile.github
              });
            }
          } else {
            console.error("Error fetching profile:", response.error);
            throw new Error(response.error);
          }
        } else if (response.data) {
          console.log("Profile data retrieved:", response.data);
          
          const data = response.data;
          const profile: UserProfile = {
            id: data.id,
            name: data.name || user.email?.split('@')[0] || 'User',
            title: data.title || 'HackHub Member',
            bio: data.bio || 'No bio yet',
            linkedIn: data.linkedin_url || '',
            github: data.github_url || '',
            avatar: data.avatar_url || '',
            skills: skills || [],
            skillsAnalyzed: hasCompletedSkillAnalysis
          };
          
          setUserProfile(profile);
          setFormData({
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            linkedIn: profile.linkedIn,
            github: profile.github
          });
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        toast({
          title: "Error loading profile",
          description: "We couldn't load your profile data. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchProfile();
  }, [user, skills, hasCompletedSkillAnalysis]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    // Log what we're trying to save
    console.log("Saving profile with data:", formData);
    
    // Create a properly structured profile object
    const profileData = {
      id: user.id,
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      linkedin_url: formData.linkedIn,
      github_url: formData.github,
      updated_at: new Date().toISOString()
    };
    
    // Attempt a direct Supabase operation first for debugging
    try {
      console.log("Attempting direct Supabase operation...");
      const { data: directData, error: directError } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          returning: 'minimal'
        });
        
      if (directError) {
        console.error("Direct Supabase error:", directError);
        toast({
          title: "Direct update failed",
          description: `Error: ${directError.message || 'Unknown error'}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Direct operation successful");
      
      // Now try using our API utility
      const response = await supabaseApi.upsert('profiles', profileData);
      console.log("API response:", response);
      
      const success = showResponseToast(response, {
        success: "Your profile has been successfully updated.",
        error: "Update failed"
      });
      
      if (success && userProfile && response.data) {
        setUserProfile({
          ...userProfile,
          name: formData.name,
          title: formData.title,
          bio: formData.bio,
          linkedIn: formData.linkedIn,
          github: formData.github
        });
      }
    } catch (error) {
      console.error("Profile save error:", error);
      toast({
        title: "Update failed",
        description: "Could not update profile. Check console for details.",
        variant: "destructive"
      });
    }
  };
  
  const handleAvatarUpload = async (url: string) => {
    if (!user || !userProfile) return;
    
    const response = await supabaseApi.update(
      'profiles',
      user.id,
      { avatar_url: url }
    );
    
    const success = showResponseToast(response, {
      success: "Avatar updated successfully",
      error: "Avatar update failed"
    });
    
    if (success && userProfile) {
      setUserProfile({
        ...userProfile,
        avatar: url
      });
    }
  };
  
  const handleSkillsAnalyzed = (newSkills: Skill[]) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        skills: newSkills,
        skillsAnalyzed: true
      });
    }
  };
  
  const handleRemoveSkill = async (skillName: string) => {
    if (!userProfile || !user) return;
    
    const updatedSkills = userProfile.skills.filter(skill => skill.name !== skillName);
    
    try {
      await setSkillsAnalyzed(updatedSkills);
      
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          skills: updatedSkills
        });
      }
      
      toast({
        title: "Skill removed",
        description: `"${skillName}" has been removed from your skills.`
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "We couldn't remove the skill. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleResetSkillAnalysis = async () => {
    try {
      await resetSkillAnalysis();
      
      toast({
        title: "Skills reset",
        description: "Your skills have been reset. You can now perform a new skill analysis."
      });
    } catch (error) {
      console.error('Error resetting skills:', error);
      toast({
        title: "Error",
        description: "We couldn't reset your skills. Please try again.",
        variant: "destructive"
      });
    }
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

  if (isLoading || !userProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center">
                  {user && (
                    <AvatarUpload 
                      userId={user.id}
                      url={userProfile.avatar}
                      name={userProfile.name}
                      onUploadComplete={handleAvatarUpload}
                      size="lg"
                    />
                  )}
                  <div className="mt-4 text-center">
                    <CardTitle>{userProfile.name}</CardTitle>
                    <CardDescription>{userProfile.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Bio</h3>
                    <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
                      Skills
                      {userProfile.skillsAnalyzed && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-xs font-normal">
                          <Brain size={10} />
                          AI-Analyzed
                        </Badge>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map(skill => (
                        <Badge 
                          key={skill.name} 
                          variant="secondary"
                          className={getSkillBadgeColor(skill.level)}
                        >
                          {skill.name} ({skill.level})
                        </Badge>
                      ))}
                      {userProfile.skills.length === 0 && (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">Social Profiles</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {userProfile.linkedIn && (
                        <a 
                          href={userProfile.linkedIn} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5"
                        >
                          <Linkedin size={16} className="mr-2" />
                          LinkedIn
                        </a>
                      )}
                      
                      {userProfile.github && (
                        <a 
                          href={userProfile.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5"
                        >
                          <Github size={16} className="mr-2" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Profile Tabs - Edit and Skills */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Edit Profile</TabsTrigger>
                <TabsTrigger value="skills">Skills & Resume</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Your Profile</CardTitle>
                    <CardDescription>
                      Update your personal information and social links
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="title">Title / Role</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleInputChange} 
                            placeholder="e.g. Full Stack Developer"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          value={formData.bio} 
                          onChange={handleInputChange} 
                          placeholder="Tell others about yourself..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedIn">LinkedIn URL</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                              <Linkedin size={16} />
                            </div>
                            <Input 
                              id="linkedIn" 
                              name="linkedIn" 
                              type="url" 
                              className="pl-10"
                              value={formData.linkedIn} 
                              onChange={handleInputChange} 
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub URL</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                              <Github size={16} />
                            </div>
                            <Input 
                              id="github" 
                              name="github" 
                              type="url" 
                              className="pl-10"
                              value={formData.github} 
                              onChange={handleInputChange} 
                              placeholder="https://github.com/username"
                            />
                          </div>
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
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Skill Analysis
                    </CardTitle>
                    <CardDescription>
                      Use AI to analyze your skills from your resume or LinkedIn profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      {userProfile.skillsAnalyzed && (
                        <div className="mb-6 p-4 bg-primary/5 rounded-md border border-primary/10">
                          <h3 className="text-base font-medium flex items-center mb-3">
                            <Brain size={18} className="mr-2 text-primary" />
                            AI-Analyzed Skills
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {userProfile.skills.map(skill => (
                              <div 
                                key={skill.name}
                                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-white/10 border border-border/50 shadow-sm"
                              >
                                <span className={`w-2 h-2 rounded-full mr-1.5 ${
                                  skill.level === 'expert' ? 'bg-green-500' : 
                                  skill.level === 'intermediate' ? 'bg-purple-500' : 
                                  'bg-blue-500'
                                }`}></span>
                                {skill.name}
                                <button 
                                  type="button"
                                  className="ml-1.5 rounded-full p-0.5 hover:bg-white/20"
                                  onClick={() => handleRemoveSkill(skill.name)}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            {userProfile.skills.length === 0 && (
                              <p className="text-sm text-muted-foreground">No skills added yet</p>
                            )}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleResetSkillAnalysis}
                            className="text-xs"
                          >
                            Reset and Analyze Again
                          </Button>
                        </div>
                      )}
                      
                      {!userProfile.skillsAnalyzed && (
                        <div className="mb-6">
                          <p className="mb-4 text-muted-foreground">
                            Upload your resume or provide your LinkedIn profile to receive an AI-powered skill analysis.
                            This will help teams find you based on your skills and experience.
                          </p>
                          <ResumeUpload onSkillsAnalyzed={handleSkillsAnalyzed} />
                        </div>
                      )}
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
