
import React, { useRef, useEffect } from 'react';
import { Lock } from 'lucide-react';
import MessageBubble from './MessageBubble';
import type { Message } from '@/types/messaging';

interface MessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
  userId: string | undefined;
  contactName?: string | null;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({ 
  messages, 
  isLoading, 
  userId,
  contactName
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <Lock className="text-brand-light" size={20} />
          </div>
          <p className="text-white/60 max-w-xs">
            Start a secure conversation with {contactName}. All messages are encrypted.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isFromCurrentUser={message.sender_id === userId}
          />
        ))
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesContainer;
