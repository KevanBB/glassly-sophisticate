
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import UserAvatar from '@/components/community/UserAvatar';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';

interface CommunityActiveUsersProps {
  searchQuery: string;
  filters: {
    activityStatus: string;
    joinDate: string;
    role: string;
    sort: string;
  };
}

interface User {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active: string | null;
  is_active: boolean;
}

const CommunityActiveUsers = ({ searchQuery, filters }: CommunityActiveUsersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    fetchUsers();
    // Set up a real-time subscription for user status changes
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
        payload => {
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === payload.new.id 
                ? { ...user, ...(payload.new as any) } 
                : user
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Calculate the timestamp for 30 minutes ago
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      
      let query = supabase
        .from('profiles')
        .select('*');
      
      // Apply search query if present
      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }
      
      // Apply activity status filter
      if (filters.activityStatus === 'active') {
        query = query.eq('is_active', true);
      } else if (filters.activityStatus === 'recent') {
        query = query.gte('last_active', thirtyMinutesAgo.toISOString());
      }
      
      // Apply role filter
      if (filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }
      
      // Apply sorting
      if (filters.sort === 'recent' || filters.joinDate === 'newest') {
        query = query.order('last_active', { ascending: false });
      } else if (filters.sort === 'az') {
        query = query.order('display_name', { ascending: true });
      } else if (filters.sort === 'za') {
        query = query.order('display_name', { ascending: false });
      } else if (filters.joinDate === 'oldest') {
        query = query.order('created_at', { ascending: true });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      
      // Process the data to determine active status
      const processedUsers = data.map(user => ({
        id: user.id,
        display_name: user.display_name,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        last_active: user.last_active || user.updated_at,
        is_active: user.is_active || false
      }));
      
      setUsers(processedUsers);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = () => {
    setDisplayCount(prev => prev + 12);
  };

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
    <div className="w-full max-w-6xl z-10 space-y-4 mb-6">
      <GlassPanel className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Active Community Members</h2>
            <Link to="/members" className="text-primary hover:text-primary/80 text-sm">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-white/10"></div>
                  <div className="h-4 w-20 bg-white/10 rounded"></div>
                  <div className="h-3 w-16 bg-white/5 rounded"></div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {users.slice(0, displayCount).map(user => (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-white/60">
              <Users size={48} className="mb-4 opacity-50" />
              <p>No users found matching your criteria</p>
              <Button variant="link" onClick={() => fetchUsers()} className="mt-2">
                Refresh
              </Button>
            </div>
          )}
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
