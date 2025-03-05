
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from '@/components/ui/GlassPanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      {/* Banner Image */}
      <div 
        className="relative w-full h-32 md:h-48 rounded-t-2xl overflow-hidden mb-1"
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
          <div className="w-full h-full bg-gradient-to-r from-crimson/30 to-gunmetal/50"></div>
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
      
      <GlassPanel className="p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="text-white/80 hover:text-white"
        >
          <ChevronLeft size={24} />
        </Button>
        
        <h1 className="text-xl font-semibold text-white">Profile Management</h1>
        
        <div className="w-10" /> {/* Spacer for alignment */}
      </GlassPanel>
    </motion.div>
  );
};

export default ProfileHeader;
