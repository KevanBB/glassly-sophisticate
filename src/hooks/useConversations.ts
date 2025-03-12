
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import type { Contact, Message, MessageType } from '@/types/messaging';

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('contact_id')
        .eq('user_id', user.id);

      if (contactsError) throw contactsError;

      if (!contactsData || contactsData.length === 0) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      const contactIds = contactsData.map(contact => contact.contact_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', contactIds);

      if (profilesError) throw profilesError;

      const contacts: Contact[] = profilesData.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        last_active: profile.last_active,
        is_active: profile.is_active || false,
      }));

      const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contact.id}),and(sender_id.eq.${contact.id},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (messagesError) throw messagesError;
        
        const { count: unreadCount, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', contact.id)
          .eq('receiver_id', user.id)
          .is('read_at', null);
          
        if (countError) throw countError;

        let lastMessage: Contact['lastMessage'] = undefined;
        if (messagesData && messagesData.length > 0) {
          const dbMsg = messagesData[0];
          lastMessage = {
            id: dbMsg.id,
            sender_id: dbMsg.sender_id,
            receiver_id: dbMsg.receiver_id,
            content: dbMsg.content,
            type: (dbMsg.media_type as MessageType) || 'text',
            created_at: dbMsg.created_at || new Date().toISOString(),
            read: dbMsg.read_at !== null,
            self_destruct_time: dbMsg.is_self_destruct ? 
              (typeof dbMsg.destruct_after === 'string' ? 
                parseInt(dbMsg.destruct_after.split(' ')[0], 10) : 
                null) : 
              null,
            media_url: dbMsg.media_url
          };
        }

        return {
          ...contact,
          lastMessage,
          unreadCount: unreadCount || 0,
        };
      }));

      setConversations(contactsWithLastMessage);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error fetching conversations",
        description: "There was a problem loading your messages.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // Set up realtime subscription for new messages
    const messagesSubscription = supabase
      .channel('new-messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id}` 
      }, () => {
        // Refresh conversation list when receiving a new message
        fetchConversations();
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${user.id}` 
      }, () => {
        // Refresh conversation list when sending a new message
        fetchConversations();
      })
      .subscribe();

    // Set up a subscription for contact changes
    const contactsSubscription = supabase
      .channel('contacts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'contacts',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(contactsSubscription);
    };
  }, [user, toast]);

  return { conversations, isLoading, fetchConversations };
};
