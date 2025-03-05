
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Mail, UserPlus, Calendar } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

interface ProfileHeaderProps {
  profile: any;
  user: any;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

const ProfileHeader = ({ profile, user, isEditing = false, onToggleEdit }: ProfileHeaderProps) => {
  const isOwnProfile = user && profile && user.id === profile.id;
  
  const formatJoinDate = (timestamp: string) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="relative w-full max-w-4xl z-10 mb-6">
      {/* Banner Image */}
      <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary/30 to-purple-500/30 relative">
        {profile?.banner_url ? (
          <img
            src={profile.banner_url}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30" />
        )}
        
        {/* Banner Edit Button */}
        {isOwnProfile && (
          <div className="absolute bottom-3 right-3">
            {isEditing ? (
              <Button 
                size="sm" 
                variant="secondary" 
                className="opacity-80 hover:opacity-100 bg-black/50"
              >
                Change Banner
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={onToggleEdit}
                className="opacity-80 hover:opacity-100 bg-black/50"
              >
                <Edit2 size={16} className="mr-1" />
                Edit Profile
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Profile Info Section */}
      <div className="flex flex-col sm:flex-row px-4 pt-0 pb-4 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-4 sm:left-8">
          <ProfileAvatar 
            profile={profile} 
            size="xl" 
            editing={isEditing} 
          />
        </div>
        
        {/* Profile Details */}
        <div className="mt-16 sm:mt-4 sm:ml-32 md:ml-36 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white truncate">
                {profile?.display_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`}
              </h1>
              
              <div className="flex items-center text-white/60 mt-1">
                <Calendar size={14} className="mr-1.5" />
                <span className="text-sm">
                  Joined {formatJoinDate(profile?.joined_at || profile?.updated_at)}
                </span>
              </div>
            </div>
            
            {!isOwnProfile && (
              <div className="flex gap-2">
                <Button size="sm" className="bg-brand hover:bg-brand/90 text-white">
                  <UserPlus size={16} className="mr-1.5" />
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="border-white/20 text-white">
                  <Mail size={16} className="mr-1.5" />
                  Message
                </Button>
              </div>
            )}
            
            {isOwnProfile && !isEditing && (
              <div className="sm:hidden">
                <Button onClick={onToggleEdit} className="w-full">
                  <Edit2 size={16} className="mr-1.5" />
                  Edit Profile
                </Button>
              </div>
            )}
            
            {isEditing && (
              <div>
                <Button onClick={onToggleEdit} variant="outline" className="border-white/20 text-white">
                  Cancel Editing
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
