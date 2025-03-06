
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import MessageThread from '@/components/messaging/MessageThread';
import NewMessageModal from '@/components/messaging/NewMessageModal';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import ConversationPanel from '@/components/messaging/ConversationPanel';
import EmptyConversation from '@/components/messaging/EmptyConversation';
import { useConversations } from '@/hooks/useConversations';
import type { Contact } from '@/types/messaging';

const MessagesPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const { conversations, isLoading } = useConversations();

  useEffect(() => {
    const state = location.state as { startConversation?: boolean, contact?: Contact } | null;
    if (state?.startConversation && state?.contact) {
      console.log('Starting conversation with:', state.contact);
      setActiveChat(state.contact);
      // Clear the state to avoid restarting the conversation on page reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleStartNewChat = (contact: Contact) => {
    console.log('Starting chat with contact:', contact);
    setActiveChat(contact);
    setIsNewMessageModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-dark-200 to-dark pb-16" // Added bottom padding to account for navigation
    >
      <div className="flex flex-1 overflow-hidden">
        <ConversationPanel
          conversations={conversations}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          isLoading={isLoading}
          onNewMessage={() => setIsNewMessageModalOpen(true)}
        />
        
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <MessageThread contact={activeChat} />
          ) : (
            <EmptyConversation onStartNewConversation={() => setIsNewMessageModalOpen(true)} />
          )}
        </div>
      </div>

      {isNewMessageModalOpen && (
        <NewMessageModal
          isOpen={isNewMessageModalOpen}
          onClose={() => setIsNewMessageModalOpen(false)}
          onSelectContact={handleStartNewChat}
        />
      )}

      <BottomNavigation />
    </motion.div>
  );
};

export default MessagesPage;
