
import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/community/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

interface User {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active: string | null;
  joined_at: string | null;
  is_active: boolean;
  role: string | null;
}

interface MemberListItemProps {
  user: User;
}

const MemberListItem = ({ user }: MemberListItemProps) => {
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

  // Format the join date
  const formatJoinDate = (timestamp: string | null) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Link 
      to={`/profile/${user.id}`} 
      className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors"
    >
      <UserAvatar 
        user={user} 
        size="md" 
        showActiveIndicator={true} 
      />
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-white truncate">
              {formatName(user)}
            </span>
            {user.role && (
              <Badge variant="outline" className="text-xs px-1.5 capitalize">
                {user.role}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 text-white/60 text-sm">
            <div className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              <span>
                {user.is_active ? 'Active now' : formatLastActive(user.last_active)}
              </span>
            </div>
            <div className="hidden md:flex items-center">
              <Calendar size={14} className="mr-1.5" />
              <span>Joined {formatJoinDate(user.joined_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MemberListItem;
