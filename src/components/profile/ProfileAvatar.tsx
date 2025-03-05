
import React from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileAvatarProps {
  avatarUrl: string;
  editing: boolean;
}

const ProfileAvatar = ({ avatarUrl, editing }: ProfileAvatarProps) => {
  return (
    <div className="flex justify-center">
      <div className="relative group">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-brand">
          <img 
            src={avatarUrl || "https://i.pravatar.cc/150?img=12"} 
            alt="Profile avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        {editing && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute bottom-0 right-0 bg-brand/80 hover:bg-brand text-white rounded-full w-8 h-8"
          >
            <Edit2 size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
