
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProfileAvatarProps {
  avatarUrl?: string;
  editing?: boolean;
  userId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ProfileAvatar = ({ avatarUrl, editing = false, userId, size = 'lg' }: ProfileAvatarProps) => {
  const [uploading, setUploading] = useState(false);
  
  // Determine avatar size based on prop
  const sizeClass = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
        
      if (uploadError) {
        toast.error('Error uploading avatar: ' + uploadError.message);
        return;
      }
      
      // Get public URL
      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);
        
      if (updateError) {
        toast.error('Error updating avatar: ' + updateError.message);
        return;
      }
      
      toast.success('Avatar updated successfully!');
      
      // Refresh the page to show new avatar
      window.location.reload();
      
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="relative">
      <Avatar className={`border-4 border-dark bg-dark-200 ${sizeClass[size]}`}>
        <AvatarImage src={avatarUrl || undefined} alt="Profile" />
        <AvatarFallback className="bg-primary/20 text-primary text-lg">
          {userId?.substring(0, 2).toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      
      {editing && (
        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 cursor-pointer">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <PenSquare size={15} className="text-white" />
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
