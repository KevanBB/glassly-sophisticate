
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Check, CheckCheck, Lock, Clock, Send, Mic, Image, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import ChatList from '@/components/messaging/ChatList';
import MessageThread from '@/components/messaging/MessageThread';
import NewMessageModal from '@/components/messaging/NewMessageModal';
import type { Message, Contact } from '@/types/messaging';

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // Get all contacts where user is either the user or the contact
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
        
        // Get profiles for all contacts
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', contactIds);

        if (profilesError) throw profilesError;

        // Convert to Contact objects
        const contacts: Contact[] = profilesData.map(profile => ({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
        }));

        // For each contact, get the last message
        const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .or(`sender_id.eq.${contact.id},receiver_id.eq.${contact.id}`)
            .order('created_at', { ascending: false })
            .limit(1);

          if (messagesError) throw messagesError;

          return {
            ...contact,
            lastMessage: messagesData && messagesData.length > 0 ? messagesData[0] : null,
            unreadCount: 0, // We'll implement this later
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

    fetchConversations();

    // Set up real-time subscription for new messages
    const messagesSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${user.id},receiver_id=eq.${user.id}` 
      }, (payload) => {
        // Update conversations when a new message is received
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [user, toast]);

  const handleStartNewChat = (contact: Contact) => {
    setActiveChat(contact);
    setIsNewMessageModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-dark-200 to-dark"
    >
      {/* Messaging interface with glass morphism */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with conversations */}
        <div className="w-1/4 border-r border-white/10 backdrop-blur-md bg-white/5 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-medium text-white">Messages</h2>
            <p className="text-xs text-white/60">End-to-end encrypted</p>
          </div>
          
          <ChatList 
            conversations={conversations}
            activeChat={activeChat}
            onSelectChat={setActiveChat}
            isLoading={isLoading}
          />
          
          <div className="mt-auto p-4">
            <button
              onClick={() => setIsNewMessageModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 bg-brand/80 hover:bg-brand text-white rounded-full py-2 px-4 transition-colors"
            >
              <Plus size={18} />
              <span>New Message</span>
            </button>
          </div>
        </div>
        
        {/* Main message area */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <MessageThread contact={activeChat} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Lock className="text-brand-light" size={24} />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Secure Messaging</h3>
              <p className="text-white/60 max-w-md">
                Select a conversation to start messaging. All messages are end-to-end encrypted for your privacy.
              </p>
              <button
                onClick={() => setIsNewMessageModalOpen(true)}
                className="mt-6 flex items-center space-x-2 bg-brand text-white rounded-full py-2 px-4 hover:bg-brand-light transition-colors"
              >
                <Plus size={18} />
                <span>Start a new conversation</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New message modal */}
      {isNewMessageModalOpen && (
        <NewMessageModal
          isOpen={isNewMessageModalOpen}
          onClose={() => setIsNewMessageModalOpen(false)}
          onSelectContact={handleStartNewChat}
        />
      )}
    </motion.div>
  );
};

export default MessagesPage;
