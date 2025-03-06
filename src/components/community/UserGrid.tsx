
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserGridItem from './UserGridItem';
import UserGridSkeleton from './UserGridSkeleton';
import EmptyUserState from './EmptyUserState';

interface User {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active: string | null;
  is_active: boolean;
}

interface UserGridProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
}

const UserGrid = ({ users, loading, onRefresh }: UserGridProps) => {
  const [displayCount, setDisplayCount] = useState(12);

  const loadMoreUsers = () => {
    setDisplayCount(prev => prev + 12);
  };

  if (loading) {
    return <UserGridSkeleton />;
  }

  if (users.length === 0) {
    return <EmptyUserState onRefresh={onRefresh} />;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {users.slice(0, displayCount).map(user => (
          <UserGridItem key={user.id} user={user} />
        ))}
      </div>
      
      {users.length > displayCount && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={loadMoreUsers}
            className="text-white border-white/20 hover:bg-white/10"
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

export default UserGrid;
