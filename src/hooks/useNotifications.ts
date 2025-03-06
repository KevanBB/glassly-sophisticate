
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  content: Record<string, any>;
  is_read: boolean;
  created_at: string;
  sender_info?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch notifications with joined sender profiles for connection requests
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender_info:profiles!inner(
            display_name,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .eq('type', 'connection_request')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the notifications to include sender info
      const processedNotifications = await Promise.all((data || []).map(async (notification) => {
        // For connection requests, get the requester's profile
        if (notification.type === 'connection_request' && notification.content.requester_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('display_name, first_name, last_name, avatar_url')
            .eq('id', notification.content.requester_id)
            .single();

          if (!profileError && profileData) {
            return {
              ...notification,
              sender_info: profileData
            };
          }
        }
        return notification;
      }));

      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up realtime subscription for notifications
    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsSubscription);
    };
  }, [userId]);

  // Function to mark a notification as read
  const markAsRead = async (notificationId: string) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);

      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
