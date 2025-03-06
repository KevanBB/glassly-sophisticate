
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import UserGrid from './UserGrid';
import { useUsersData } from '@/hooks/useUserData';

interface CommunityActiveUsersProps {
  searchQuery: string;
  filters: {
    activityStatus: string;
    joinDate: string;
    role: string;
    sort: string;
  };
}

const CommunityActiveUsers = ({ searchQuery, filters }: CommunityActiveUsersProps) => {
  const { users, loading, fetchUsers } = useUsersData(searchQuery, filters);

  return (
    <div className="w-full max-w-6xl z-10 space-y-4 mb-6">
      <GlassPanel className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Active Community Members</h2>
            <Link to="/members" className="text-primary hover:text-primary/80 text-sm">
              View All
            </Link>
          </div>
          
          <UserGrid users={users} loading={loading} onRefresh={fetchUsers} />
        </div>
      </GlassPanel>
      
      <div className="flex justify-center">
        <Link to="/members">
          <Button className="flex items-center gap-2" size="lg">
            <Users size={18} />
            View All Members
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CommunityActiveUsers;
