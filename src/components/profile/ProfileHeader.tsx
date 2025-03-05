
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProfileAvatar from './ProfileAvatar';

interface ProfileHeaderProps {
  profile: any;
  user: any;
}

const ProfileHeader = ({ profile, user }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && user?.id) {
      const file = e.target.files[0];
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image must be less than 5MB');
        return;
      }
      
      try {
        setIsUploading(true);
        
        // Upload to Supabase Storage
        const fileName = `banner-${user.id}-${Date.now()}`;
        const { data, error } = await supabase.storage
          .from('profiles')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });
          
        if (error) throw error;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName);
          
        // Update the user's profile with the new banner URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ banner_url: publicUrlData.publicUrl })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        toast.success("Banner updated successfully!");
        
      } catch (error: any) {
        toast.error(`Error uploading banner: ${error.message}`);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-4xl z-10 mb-6"
    >
      {/* Positioned Banner with Avatar overlay */}
      <div className="relative">
        {/* Banner Image */}
        <div 
          className="relative w-full h-48 md:h-64 rounded-t-2xl overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {profile?.banner_url ? (
            <img 
              src={profile.banner_url} 
              alt="Profile banner" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/30 to-secondary/50"></div>
          )}
          
          {/* Upload banner overlay */}
          {isHovering && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleBannerUpload}
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={triggerFileInput}
                disabled={isUploading}
                className="border-white/20 bg-black/30 text-white hover:bg-black/50"
              >
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Camera size={16} className="mr-2" />
                    Upload Banner
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Avatar overlapping the banner */}
        <div className="absolute -bottom-16 left-8 md:left-12 transform">
          <ProfileAvatar 
            avatarUrl={profile?.avatar_url || ""} 
            editing={true}
            userId={user?.id}
            onAvatarUpdate={() => {}}
          />
        </div>
      </div>
      
      {/* Profile info panel */}
      <GlassPanel className="p-6 pt-20 mt-4 flex flex-col items-start">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 text-white/80 hover:text-white"
        >
          <ChevronLeft size={24} />
        </Button>
        
        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center pl-24 md:pl-28">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              {profile?.display_name || 'Anonymous User'}
            </h1>
            <p className="text-sm text-white/70">{profile?.bio ? profile.bio.substring(0, 80) + (profile.bio.length > 80 ? '...' : '') : 'No bio yet'}</p>
          </div>
          
          {/* User Stats */}
          <div className="flex items-center space-x-6 mt-3 md:mt-0 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-medium text-white">{profile?.role || 'Switch'}</span>
              <span className="text-xs text-white/60">Role</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-white">{profile?.experience_level || 'Curious'}</span>
              <span className="text-xs text-white/60">Experience</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-white">{profile?.kinks_fetishes?.length || 0}</span>
              <span className="text-xs text-white/60">Kinks</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

export default ProfileHeader;
