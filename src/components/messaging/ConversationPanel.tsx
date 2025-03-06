
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ChatList from '@/components/messaging/ChatList';
import type { Contact } from '@/types/messaging';

interface ConversationPanelProps {
  conversations: Contact[];
  activeChat: Contact | null;
  onSelectChat: (chat: Contact) => void;
  isLoading: boolean;
  onNewMessage: () => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  conversations,
  activeChat,
  onSelectChat,
  isLoading,
  onNewMessage
}) => {
  return (
    <div className="w-1/4 border-r border-white/10 backdrop-blur-md bg-white/5 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium text-white">Messages</h2>
        <p className="text-xs text-white/60">End-to-end encrypted</p>
      </div>
      
      <ChatList 
        conversations={conversations}
        activeChat={activeChat}
        onSelectChat={onSelectChat}
        isLoading={isLoading}
      />
      
      <div className="mt-auto p-4">
        <button
          onClick={onNewMessage}
          className="w-full flex items-center justify-center space-x-2 bg-brand/80 hover:bg-brand text-white rounded-full py-2 px-4 transition-colors"
        >
          <Plus size={18} />
          <span>New Message</span>
        </button>
      </div>
    </div>
  );
};

export default ConversationPanel;
