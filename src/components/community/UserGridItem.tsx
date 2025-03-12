
import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/community/UserAvatar';

interface User {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active: string | null;
  is_active: boolean;
  email: string | null;
}

interface UserGridItemProps {
  user: User;
}

const UserGridItem = ({ user }: UserGridItemProps) => {
  // Format the display name
  const formatName = (user: User) => {
    if (user.display_name) return user.display_name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    return 'Anonymous';
  };

  // Format the last active time
  const formatLastActive = (timestamp: string | null) => {
    if (!timestamp) return 'Unknown';
    
    const lastActive = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Link to={`/profile/${user.id}`} key={user.id} className="flex flex-col items-center space-y-2">
      <UserAvatar 
        user={user} 
        size="lg" 
        showActiveIndicator={true} 
      />
      <span className="text-white font-medium text-center truncate max-w-full">
        {formatName(user)}
      </span>
      <span className="text-white/60 text-xs">
        {user.is_active ? 'Active now' : formatLastActive(user.last_active)}
      </span>
    </Link>
  );
};

export default UserGridItem;
