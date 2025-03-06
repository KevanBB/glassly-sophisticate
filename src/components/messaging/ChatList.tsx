
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import UserAvatar from '@/components/community/UserAvatar';
import type { Contact } from '@/types/messaging';

interface ChatListProps {
  conversations: Contact[];
  activeChat: Contact | null;
  onSelectChat: (chat: Contact) => void;
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, activeChat, onSelectChat, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center space-x-3 p-3 mb-2 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-white/10"></div>
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-white/60">
          <p>No conversations yet</p>
          <p className="text-xs mt-1">Start a new message to connect</p>
        </div>
      ) : (
        conversations.map((chat) => {
          const isActive = activeChat?.id === chat.id;
          const lastMessage = chat.lastMessage;
          const timeAgo = lastMessage?.created_at 
            ? formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: false })
            : '';
            
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center p-3 cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-white/20 backdrop-blur-md' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="relative">
                <UserAvatar
                  user={chat}
                  size="md"
                  showActiveIndicator={true}
                  linkToProfile={false}
                />
                
                {chat.unreadCount && chat.unreadCount > 0 ? (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand flex items-center justify-center text-xs text-white">
                    {chat.unreadCount}
                  </div>
                ) : null}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white truncate">
                    {chat.first_name} {chat.last_name}
                  </h3>
                  {lastMessage && (
                    <span className="text-xs text-white/60">{timeAgo}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 mt-1">
                  {lastMessage && lastMessage.sender_id === chat.id && !lastMessage.read && (
                    <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0"></div>
                  )}
                  
                  <p className="text-sm text-white/60 truncate flex-1">
                    {lastMessage ? (
                      lastMessage.type !== 'text' ? (
                        <span className="italic">
                          {lastMessage.type === 'image' && '📷 Image'}
                          {lastMessage.type === 'video' && '🎥 Video'}
                          {lastMessage.type === 'voice' && '🎤 Voice message'}
                        </span>
                      ) : (
                        lastMessage.content
                      )
                    ) : (
                      <span className="italic text-white/40">No messages yet</span>
                    )}
                  </p>
                  
                  {lastMessage && lastMessage.sender_id !== chat.id && (
                    lastMessage.read ? (
                      <CheckCheck size={14} className="text-brand flex-shrink-0" />
                    ) : (
                      <Check size={14} className="text-white/60 flex-shrink-0" />
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;
