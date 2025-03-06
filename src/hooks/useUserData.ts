
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface Filters {
  activityStatus: string;
  joinDate: string;
  role: string;
  sort: string;
}

export function useUserData(searchQuery: string, filters: Filters, pagination = false) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = pagination ? 20 : 100; // Limit to 20 for pagination, more for grid view

  // Setup real-time subscription
  useEffect(() => {
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
  }, []);

  // Reset pagination when filters or search query change
  useEffect(() => {
    if (pagination) {
      setPage(1);
      setHasMore(true);
    }
    fetchUsers(1);
  }, [filters, searchQuery, pagination]);

  const fetchUsers = async (pageNumber = 1) => {
    if (pagination && pageNumber === 1) {
      setUsers([]);
    }
    
    setLoading(true);
    try {
      // Calculate the timestamp for 30 minutes ago
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      
      // Calculate offset for pagination
      const offset = pagination ? (pageNumber - 1) * perPage : 0;
      
      let query = supabase
        .from('profiles')
        .select('*');
      
      // Apply pagination if needed
      if (pagination) {
        query = query.range(offset, offset + perPage - 1);
      }
      
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
        joined_at: user.joined_at || user.created_at,
        is_active: user.is_active || false
      }));
      
      if (pagination) {
        if (pageNumber === 1) {
          setUsers(processedUsers);
        } else {
          setUsers(prev => [...prev, ...processedUsers]);
        }
        
        // Check if we have more results
        setHasMore(processedUsers.length === perPage);
      } else {
        setUsers(processedUsers);
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!pagination || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  return { users, loading, fetchUsers, loadMore, hasMore, page };
}
