
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  last_active: string | null;
  is_active: boolean;
}

interface Filters {
  activityStatus: string;
  joinDate: string;
  role: string;
  sort: string;
}

export function useUserData(searchQuery: string, filters: Filters) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch users whenever filters or search query change
  useEffect(() => {
    fetchUsers();
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

  return { users, loading, fetchUsers };
}
