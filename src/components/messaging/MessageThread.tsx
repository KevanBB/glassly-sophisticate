
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ConversationHeader from './ConversationHeader';
import MessagesContainer from './MessagesContainer';
import MessageComposer from './MessageComposer';
import { useMessageThread } from '@/hooks/useMessageThread';
import { MessageThreadProvider } from '@/context/MessageThreadContext';
import { useUserData } from '@/hooks/useUserData';
import type { Contact } from '@/types/messaging';

interface MessageThreadProps {
  contact: Contact;
}

const MessageThread: React.FC<MessageThreadProps> = ({ contact }) => {
  const { user } = useAuth();
  const { messages, isLoading } = useMessageThread(user, contact);
  const { userData, isLoading: isUserDataLoading } = useUserData(user?.id);
  
  return (
    <MessageThreadProvider user={user} contact={contact}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <ConversationHeader contact={contact} />
        
        {/* Messages area - flex-1 so it takes available space and allows scrolling */}
        <MessagesContainer 
          messages={messages} 
          isLoading={isLoading} 
          userId={user?.id}
          contactName={contact.first_name} 
          userAvatar={userData?.avatar_url}
          contactAvatar={contact.avatar_url}
        />
        
        {/* Message composer with self-destruct controls and input */}
        <MessageComposer user={user} contact={contact} />
      </div>
    </MessageThreadProvider>
  );
};

export default MessageThread;
