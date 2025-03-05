
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import UserAvatar from '@/components/community/UserAvatar';
import { Button } from '@/components/ui/button';
import { Users, Clock, Calendar } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/badge';

interface MembersListProps {
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
  joined_at: string | null;
  is_active: boolean;
  role: string | null;
}

const MembersList = ({ searchQuery, filters }: MembersListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20;

  useEffect(() => {
    // Reset pagination when filters or search changes
    setPage(1);
    setHasMore(true);
    fetchUsers(1);
    
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

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true);
    try {
      // Calculate the timestamp for 30 minutes ago
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      
      // Calculate offset
      const offset = (pageNumber - 1) * perPage;
      
      let query = supabase
        .from('profiles')
        .select('*')
        .range(offset, offset + perPage - 1);
      
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
        role: user.role,
        last_active: user.last_active || user.updated_at,
        joined_at: user.joined_at || user.updated_at,
        is_active: user.is_active || false
      }));
      
      if (pageNumber === 1) {
        setUsers(processedUsers);
      } else {
        setUsers(prev => [...prev, ...processedUsers]);
      }
      
      // Check if we have more results
      setHasMore(processedUsers.length === perPage);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
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

  // Format the join date
  const formatJoinDate = (timestamp: string | null) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="w-full max-w-6xl z-10 space-y-4 mb-6">
      <GlassPanel className="p-6">
        <div className="flex flex-col space-y-6">
          {loading && page === 1 ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-white/10"></div>
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-white/5 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="space-y-1">
                {users.map(user => (
                  <Link 
                    to={`/profile/${user.id}`} 
                    key={user.id}
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
            <div className="flex flex-col items-center justify-center py-10 text-white/60">
              <Users size={48} className="mb-4 opacity-50" />
              <p>No users found matching your criteria</p>
              <Button variant="link" onClick={() => fetchUsers(1)} className="mt-2">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
};

export default MembersList;
