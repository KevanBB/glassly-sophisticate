
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { Check, CheckCheck, Lock, Clock, Eye } from 'lucide-react';
import type { Message } from '@/types/messaging';

interface MessageBubbleProps {
  message: Message;
  isFromCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isFromCurrentUser }) => {
  const [isExpiring, setIsExpiring] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Format the timestamp
  const timeAgo = message.created_at 
    ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true })
    : '';
  
  const exactTime = message.created_at 
    ? format(new Date(message.created_at), 'h:mm a')
    : '';

  // Handle self-destructing messages
  useEffect(() => {
    if (message.self_destruct_time) {
      setIsExpiring(true);
      
      // Calculate remaining time in seconds
      const destructTime = message.self_destruct_time * 60; // convert minutes to seconds
      setRemainingTime(destructTime);
      
      // Set up countdown
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setIsVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [message.self_destruct_time]);

  // Format remaining time
  const formatRemainingTime = () => {
    if (remainingTime === null) return '';
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderMediaContent = () => {
    if (!message.media_url) return null;
    
    switch (message.type) {
      case 'image':
        return (
          <div className="mb-2 rounded-lg overflow-hidden">
            <img 
              src={message.media_url} 
              alt="Image" 
              className="max-w-xs max-h-60 object-contain rounded-lg"
              onLoad={() => console.log('Image loaded')}
              onError={() => console.error('Error loading image')}
            />
          </div>
        );
      case 'video':
        return (
          <div className="mb-2 rounded-lg overflow-hidden">
            <video 
              src={message.media_url} 
              controls 
              className="max-w-xs max-h-60 object-contain rounded-lg"
            />
          </div>
        );
      case 'voice':
        return (
          <div className="mb-2">
            <audio src={message.media_url} controls className="w-full" />
          </div>
        );
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[75%] ${
            isFromCurrentUser
              ? 'bg-gradient-to-br from-brand/80 to-brand rounded-tl-2xl rounded-tr-sm rounded-bl-2xl text-white'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-tr-2xl rounded-tl-sm rounded-br-2xl text-white'
          } p-3 shadow-lg relative overflow-hidden`}
        >
          {/* Glass morphism effect */}
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGZpbHRlciBpZD0ibm9pc2UiPgogICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIG51bU9jdGF2ZXM9IjIiIHNlZWQ9IjAiIHJlc3VsdD0idHVyYnVsZW5jZSIgLz4KICAgIDxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiIC8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50 mix-blend-soft-light pointer-events-none"></div>
          </div>

          {/* Media content if any */}
          {renderMediaContent()}

          {/* Message content */}
          <p className="relative z-10">{message.content}</p>
          
          {/* Self-destruct indicator */}
          {isExpiring && (
            <div className="mt-1 flex items-center text-xs text-white/70">
              <Clock size={12} className="mr-1" />
              <span>{formatRemainingTime()}</span>
            </div>
          )}
          
          {/* Message metadata */}
          <div className="mt-1 flex items-center justify-end space-x-1 text-xs text-white/70">
            <Lock size={10} /> 
            <span>{exactTime}</span>
            {isFromCurrentUser && (
              message.read ? (
                <CheckCheck size={12} className="text-white/90" />
              ) : (
                <Check size={12} />
              )
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessageBubble;
