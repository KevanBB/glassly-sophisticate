
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface UserAvatarProps {
  user: {
    id: string;
    avatar_url: string | null;
    display_name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    is_active?: boolean;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showActiveIndicator?: boolean;
  className?: string;
  linkToProfile?: boolean;
}

const UserAvatar = ({ 
  user, 
  size = 'md', 
  showActiveIndicator = false,
  className,
  linkToProfile = true
}: UserAvatarProps) => {
  // Determine avatar size based on prop
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  // Determine indicator size and position based on avatar size
  const indicatorSize = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3.5 w-3.5',
    xl: 'h-4 w-4'
  };
  
  const indicatorPosition = {
    sm: 'right-0 top-0',
    md: 'right-0 top-0',
    lg: 'right-1 top-1',
    xl: 'right-1 top-1'
  };
  
  // Get initials for fallback
  const getInitials = () => {
    if (user.display_name) {
      return user.display_name.charAt(0).toUpperCase();
    } else if (user.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    } else {
      return 'U';
    }
  };

  const avatarContent = (
    <div className="relative inline-block">
      <Avatar className={cn(sizeClass[size], className)}>
        <AvatarImage src={user.avatar_url || ''} alt="User avatar" />
        <AvatarFallback>
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {showActiveIndicator && user.is_active && (
        <span className={cn(
          "absolute block rounded-full bg-green-500 ring-2 ring-background transition-opacity duration-300",
          indicatorSize[size],
          indicatorPosition[size]
        )} />
      )}
    </div>
  );

  if (linkToProfile && user.id) {
    return (
      <Link to={`/profile/${user.id}`}>
        {avatarContent}
      </Link>
    );
  }

  return avatarContent;
};

export default UserAvatar;
