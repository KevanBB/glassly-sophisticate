
import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/community/UserAvatar';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active: string | null;
  is_active: boolean;
  email?: string | null; // Make email optional
  role?: string; // Add role property
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

  // Get role color based on role
  const getRoleColor = (role?: string) => {
    if (!role) return '';
    
    switch(role.toLowerCase()) {
      case 'dominant':
        return 'bg-red-500/20 text-red-400';
      case 'submissive':
        return 'bg-blue-500/20 text-blue-400';
      case 'switch':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
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
      
      {user.role && (
        <Badge variant="outline" className={`${getRoleColor(user.role)} text-xs px-2 py-0.5`}>
          {user.role}
        </Badge>
      )}
      
      <span className="text-white/60 text-xs">
        {user.is_active ? 'Active now' : formatLastActive(user.last_active)}
      </span>
    </Link>
  );
};

export default UserGridItem;
