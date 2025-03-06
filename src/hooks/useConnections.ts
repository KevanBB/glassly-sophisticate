
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  updated_at: string;
}

export interface ConnectionWithProfile extends Connection {
  profile?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export function useConnections(userId: string | undefined) {
  const [connections, setConnections] = useState<ConnectionWithProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user connections
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchConnections = async () => {
      setLoading(true);
      try {
        // Fetch approved connections where current user is requester
        const { data: sentConnections, error: sentError } = await supabase
          .from('connections')
          .select(`
            *,
            profile:profiles!recipient_id(
              display_name,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('requester_id', userId)
          .eq('status', 'approved');

        if (sentError) throw sentError;

        // Fetch approved connections where current user is recipient
        const { data: receivedConnections, error: receivedError } = await supabase
          .from('connections')
          .select(`
            *,
            profile:profiles!requester_id(
              display_name,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('recipient_id', userId)
          .eq('status', 'approved');

        if (receivedError) throw receivedError;

        // Combine both types of connections
        const combinedConnections = [
          ...(sentConnections || []),
          ...(receivedConnections || [])
        ];

        setConnections(combinedConnections);

        // Fetch pending requests received by current user
        const { data: requests, error: requestsError } = await supabase
          .from('connections')
          .select(`
            *,
            profile:profiles!requester_id(
              display_name,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('recipient_id', userId)
          .eq('status', 'pending');

        if (requestsError) throw requestsError;

        setPendingRequests(requests || []);
      } catch (error) {
        console.error('Error fetching connections:', error);
        setError('Failed to load connections');
        toast.error('Failed to load connections');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();

    // Set up realtime subscription for connections
    const connectionsSubscription = supabase
      .channel('connections-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'connections', filter: `requester_id=eq.${userId}` },
        () => fetchConnections()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'connections', filter: `recipient_id=eq.${userId}` },
        () => fetchConnections()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connectionsSubscription);
    };
  }, [userId]);

  // Function to send a connection request
  const sendConnectionRequest = async (recipientId: string) => {
    if (!userId) {
      toast.error('You must be logged in to send a connection request');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { data, error } = await supabase
        .from('connections')
        .insert({
          requester_id: userId,
          recipient_id: recipientId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error('A connection request already exists with this user');
        } else {
          toast.error('Failed to send connection request');
          console.error('Error sending connection request:', error);
        }
        return { success: false, error: error.message };
      }

      toast.success('Connection request sent');
      return { success: true, data };
    } catch (error) {
      console.error('Error in sendConnectionRequest:', error);
      toast.error('Failed to send connection request');
      return { success: false, error };
    }
  };

  // Function to respond to a connection request
  const respondToConnectionRequest = async (connectionId: string, status: 'approved' | 'denied') => {
    if (!userId) {
      toast.error('You must be logged in to respond to a connection request');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', connectionId)
        .eq('recipient_id', userId) // Security check to ensure user can only respond to their own requests
        .select()
        .single();

      if (error) {
        toast.error(`Failed to ${status} connection request`);
        console.error(`Error ${status}ing connection request:`, error);
        return { success: false, error: error.message };
      }

      if (status === 'approved') {
        toast.success('Connection request approved');
      } else {
        toast.success('Connection request denied');
      }
      
      return { success: true, data };
    } catch (error) {
      console.error(`Error in respondToConnectionRequest (${status}):`, error);
      toast.error(`Failed to ${status} connection request`);
      return { success: false, error };
    }
  };
  
  // Function to remove a connection
  const removeConnection = async (connectionId: string) => {
    if (!userId) {
      toast.error('You must be logged in to remove a connection');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
        .eq('id', connectionId)
        .eq('status', 'approved'); // Can only delete approved connections

      if (error) {
        toast.error('Failed to remove connection');
        console.error('Error removing connection:', error);
        return { success: false, error: error.message };
      }

      toast.success('Connection removed');
      return { success: true };
    } catch (error) {
      console.error('Error in removeConnection:', error);
      toast.error('Failed to remove connection');
      return { success: false, error };
    }
  };

  // Function to get connection status with another user
  const getConnectionStatus = async (otherUserId: string) => {
    if (!userId || !otherUserId) return null;
    
    try {
      // Check if there's a connection where current user is requester
      const { data: sentConnection, error: sentError } = await supabase
        .from('connections')
        .select('*')
        .eq('requester_id', userId)
        .eq('recipient_id', otherUserId)
        .maybeSingle();

      if (sentError) throw sentError;
      
      if (sentConnection) return sentConnection;

      // Check if there's a connection where current user is recipient
      const { data: receivedConnection, error: receivedError } = await supabase
        .from('connections')
        .select('*')
        .eq('requester_id', otherUserId)
        .eq('recipient_id', userId)
        .maybeSingle();

      if (receivedError) throw receivedError;
      
      return receivedConnection;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return null;
    }
  };

  return {
    connections,
    pendingRequests,
    loading,
    error,
    sendConnectionRequest,
    respondToConnectionRequest,
    removeConnection,
    getConnectionStatus
  };
}
