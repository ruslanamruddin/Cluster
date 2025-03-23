
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AvatarUploadProps {
  userId: string;
  url?: string;
  onUploadComplete: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  name: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  userId, 
  url, 
  onUploadComplete, 
  size = 'md',
  name 
}) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getAvatarSize = () => {
    switch (size) {
      case 'sm': return 'h-16 w-16';
      case 'lg': return 'h-32 w-32';
      default: return 'h-24 w-24';
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        toast({
          title: "Error",
          description: "No file selected",
          variant: "destructive"
        });
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "File must be an image",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);
      onUploadComplete(publicUrl);

      toast({
        title: "Success",
        description: "Avatar uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className={`${getAvatarSize()} border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-300`}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="text-2xl bg-primary/5">
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <Button 
          size="icon" 
          variant="outline" 
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-background bg-white/95 shadow-sm dark:bg-black/80 hover:bg-primary/10"
          onClick={triggerFileInput}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
};

export default AvatarUpload;
