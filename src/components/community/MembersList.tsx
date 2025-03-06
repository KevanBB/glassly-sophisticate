
import React from 'react';
import { Button } from '@/components/ui/button';
import MemberListItem from './MemberListItem';
import MemberListSkeleton from './MemberListSkeleton';
import EmptyUserState from './EmptyUserState';
import GlassPanel from '@/components/ui/GlassPanel';
import { useUsersData } from '@/hooks/useUserData';

interface MembersListProps {
  searchQuery: string;
  filters: {
    activityStatus: string;
    joinDate: string;
    role: string;
    sort: string;
  };
}

const MembersList = ({ searchQuery, filters }: MembersListProps) => {
  const { users, loading, fetchUsers, loadMore, hasMore } = useUsersData(
    searchQuery, 
    filters, 
    true // Enable pagination
  );

  return (
    <div className="w-full max-w-6xl z-10 space-y-4 mb-6">
      <GlassPanel className="p-6">
        <div className="flex flex-col space-y-6">
          {loading && users.length === 0 ? (
            <MemberListSkeleton />
          ) : users.length > 0 ? (
            <>
              <div className="space-y-1">
                {users.map(user => (
                  <MemberListItem key={user.id} user={user} />
                ))}
              </div>
              
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={loading}
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyUserState onRefresh={() => fetchUsers(1)} />
          )}
        </div>
      </GlassPanel>
    </div>
  );
};

export default MembersList;
