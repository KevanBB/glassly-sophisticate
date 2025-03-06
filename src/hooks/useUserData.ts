
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

// This version is for fetching a single user's data
export function useUserData(userId?: string | null) {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        setUserData(data);
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return { userData, isLoading };
}

// This version is for fetching multiple users with filtering and pagination
export function useUsersData(searchQuery: string, filters: Filters, pagination = false) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = pagination ? 20 : 100; // Limit to 20 for pagination, more for grid view
  const [cacheTime, setCacheTime] = useState<Date | null>(null);
  const [cachedUsers, setCachedUsers] = useState<User[]>([]);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Setup real-time subscription for user status changes
  useEffect(() => {
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
        payload => {
          // Update the user in the users array when their status changes
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === payload.new.id 
                ? { 
                    ...user, 
                    is_active: payload.new.is_active, 
                    last_active: payload.new.last_active 
                  } 
                : user
            )
          );
        }
      )
      .subscribe();

    // Cleanup function
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
    
    // Check if we have a valid cache before fetching
    const now = new Date();
    if (cacheTime && cachedUsers.length > 0 && now.getTime() - cacheTime.getTime() < CACHE_DURATION) {
      // Use cached data
      console.log('Using cached user data');
      setUsers(cachedUsers);
      setLoading(false);
    } else {
      // Cache expired or doesn't exist, fetch new data
      fetchUsers(1);
    }
  }, [filters, searchQuery, pagination]);

  const fetchUsers = async (pageNumber = 1) => {
    if (pagination && pageNumber === 1) {
      setUsers([]);
    }
    
    setLoading(true);
    try {
      // Calculate the timestamp for 5 minutes ago for "online" status
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      
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
      if (filters.activityStatus === 'online') {
        query = query.gte('last_active', fiveMinutesAgo.toISOString());
      } else if (filters.activityStatus === 'active') {
        query = query.eq('is_active', true);
      }
      
      // Apply role filter
      if (filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }
      
      // Apply sorting
      if (filters.sort === 'recent') {
        query = query.order('last_active', { ascending: false });
      } else if (filters.sort === 'az') {
        query = query.order('display_name', { ascending: true });
      } else if (filters.sort === 'za') {
        query = query.order('display_name', { ascending: false });
      } else if (filters.joinDate === 'newest') {
        query = query.order('joined_at', { ascending: false });
      } else if (filters.joinDate === 'oldest') {
        // Use joined_at instead of created_at
        query = query.order('joined_at', { ascending: true });
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
        joined_at: user.joined_at || user.updated_at, // Fallback to updated_at
        is_active: isUserActive(user.last_active, fiveMinutesAgo.toISOString())
      }));
      
      if (pagination) {
        if (pageNumber === 1) {
          setUsers(processedUsers);
          // Update cache for first page results
          setCachedUsers(processedUsers);
          setCacheTime(new Date());
        } else {
          setUsers(prev => [...prev, ...processedUsers]);
        }
        
        // Check if we have more results
        setHasMore(processedUsers.length === perPage);
      } else {
        setUsers(processedUsers);
        // Update cache
        setCachedUsers(processedUsers);
        setCacheTime(new Date());
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if a user is active based on last_active timestamp
  const isUserActive = (lastActive: string | null, fiveMinutesAgo: string): boolean => {
    if (!lastActive) return false;
    
    try {
      const lastActiveDate = new Date(lastActive);
      const thresholdDate = new Date(fiveMinutesAgo);
      
      return lastActiveDate >= thresholdDate;
    } catch (error) {
      console.error('Error parsing date:', error);
      return false;
    }
  };

  const loadMore = () => {
    if (!pagination || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  // Function to update user activity (to be called from components)
  const updateUserActivity = async (userId: string) => {
    if (!userId) return;
    
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('profiles')
        .update({ 
          last_active: now,
          is_active: true 
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user activity:', error);
      }
    } catch (error) {
      console.error('Error in updateUserActivity:', error);
    }
  };

  return { users, loading, fetchUsers, loadMore, hasMore, page, updateUserActivity };
}
