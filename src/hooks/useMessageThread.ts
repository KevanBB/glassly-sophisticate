
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import type { Contact, Message, MessageType } from '@/types/messaging';

export const useMessageThread = (user: any, contact: Contact | null) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !contact) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Update user's activity status when they open a message thread
        const now = new Date().toISOString();
        await supabase
          .from('profiles')
          .update({ 
            last_active: now,
            is_active: true 
          })
          .eq('id', user.id);
          
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contact.id}),and(sender_id.eq.${contact.id},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // Map database messages to our Message type
        const mappedMessages: Message[] = (data || []).map(dbMessage => ({
          id: dbMessage.id,
          sender_id: dbMessage.sender_id,
          receiver_id: dbMessage.receiver_id,
          content: dbMessage.content,
          type: (dbMessage.media_type as MessageType) || 'text',
          created_at: dbMessage.created_at || new Date().toISOString(),
          read: dbMessage.read_at !== null,
          self_destruct_time: dbMessage.is_self_destruct ? 
            (typeof dbMessage.destruct_after === 'string' ? 
              parseInt(dbMessage.destruct_after.split(' ')[0], 10) : 
              null) : 
            null,
          media_url: dbMessage.media_url
        }));
        
        setMessages(mappedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error fetching messages",
          description: "There was a problem loading your conversation.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up periodic activity updates
    const activityInterval = setInterval(async () => {
      if (user) {
        try {
          const now = new Date().toISOString();
          await supabase
            .from('profiles')
            .update({ 
              last_active: now,
              is_active: true 
            })
            .eq('id', user.id);
        } catch (error) {
          console.error('Error updating activity status:', error);
        }
      }
    }, 60000); // Every minute
    
    // Create a single subscription with multiple filters
    const messagesSubscription = supabase
      .channel('message-thread')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${user.id},receiver_id=eq.${contact.id}` 
      }, (payload) => {
        handleNewMessage(payload.new);
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${contact.id},receiver_id=eq.${user.id}` 
      }, (payload) => {
        handleNewMessage(payload.new);
        markMessageAsRead(payload.new.id);
      })
      .subscribe();
      
    // Mark messages as read
    const markAsRead = async () => {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('sender_id', contact.id)
          .eq('receiver_id', user.id)
          .is('read_at', null);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };
    
    markAsRead();
    
    // Helper function to handle new messages from subscription
    const handleNewMessage = (dbMsg: any) => {
      const newMsg: Message = {
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
      
      setMessages(prev => [...prev, newMsg]);
    };
    
    // Helper function to mark a message as read
    const markMessageAsRead = async (messageId: string) => {
      try {
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('id', messageId);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    };
    
    return () => {
      clearInterval(activityInterval);
      supabase.removeChannel(messagesSubscription);
    };
  }, [user, contact, toast]);

  return { messages, isLoading };
};
