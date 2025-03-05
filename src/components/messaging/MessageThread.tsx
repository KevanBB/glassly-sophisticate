
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Lock, Send, Mic, Image, Clock, X, Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MessageBubble from './MessageBubble';
import type { Contact, Message, MessageType } from '@/types/messaging';

interface MessageThreadProps {
  contact: Contact;
}

const MessageThread: React.FC<MessageThreadProps> = ({ contact }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSelfDestruct, setIsSelfDestruct] = useState(false);
  const [destructTime, setDestructTime] = useState(5); // minutes
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user || !contact) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
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
    
    // Set up realtime subscription for this conversation
    const messagesSubscription = supabase
      .channel('message-thread')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `or(and(sender_id=eq.${user.id},receiver_id=eq.${contact.id}),and(sender_id=eq.${contact.id},receiver_id=eq.${user.id}))` 
      }, (payload) => {
        // Add new message to the list
        const dbMsg = payload.new as any;
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
    
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [user, contact, toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !contact) return;
    
    try {
      const messageData = {
        sender_id: user.id,
        receiver_id: contact.id,
        content: newMessage,
        is_encrypted: true,
        is_self_destruct: isSelfDestruct,
        destruct_after: isSelfDestruct ? `${destructTime} minutes` : null,
        media_type: 'text',
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(messageData);
        
      if (error) throw error;
      
      // Clear input after sending
      setNewMessage('');
      setIsSelfDestruct(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message.",
        variant: "destructive"
      });
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !contact) return;
    
    setIsUploading(true);
    
    try {
      // Determine media type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      
      let mediaType: MessageType = 'text';
      if (isImage) mediaType = 'image';
      else if (isVideo) mediaType = 'video';
      else if (isAudio) mediaType = 'voice';
      
      // Upload file to storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('message_media')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('message_media')
        .getPublicUrl(fileName);
        
      // Send message with media
      const messageData = {
        sender_id: user.id,
        receiver_id: contact.id,
        content: mediaType === 'text' ? 'File attachment' : `${mediaType} attachment`,
        is_encrypted: true,
        is_self_destruct: isSelfDestruct,
        destruct_after: isSelfDestruct ? `${destructTime} minutes` : null,
        media_url: urlData.publicUrl,
        media_type: mediaType,
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(messageData);
        
      if (error) throw error;
      
      toast({
        title: "File uploaded",
        description: "Your file has been sent successfully.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "There was a problem sending your file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setIsSelfDestruct(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 backdrop-blur-md bg-white/5 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
            {contact.avatar_url ? (
              <img src={contact.avatar_url} alt={contact.first_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-lg font-medium">
                {contact.first_name?.[0] || '?'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">
              {contact.first_name} {contact.last_name}
            </h3>
            <div className="flex items-center text-xs text-white/60">
              <Lock size={12} className="mr-1" />
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages area */}
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
              Start a secure conversation with {contact.first_name}. All messages are encrypted.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isFromCurrentUser={message.sender_id === user?.id}
            />
          ))
        )}
        <div ref={messageEndRef} />
      </div>
      
      {/* Self-destruct message controls */}
      {isSelfDestruct && (
        <div className="px-4 py-2 bg-yellow-900/20 border-t border-yellow-600/30 flex items-center justify-between">
          <div className="flex items-center text-sm text-yellow-400">
            <Clock size={16} className="mr-2" />
            <span>Self-destructing message: {destructTime} minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setDestructTime(prev => Math.max(1, prev - 1))}
              className="text-xs text-white/80 hover:text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-white/80 text-sm">{destructTime}</span>
            <button 
              onClick={() => setDestructTime(prev => Math.min(60, prev + 1))}
              className="text-xs text-white/80 hover:text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center"
            >
              +
            </button>
            <button 
              onClick={() => setIsSelfDestruct(false)}
              className="text-xs text-white/80 hover:text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-2"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="p-4 border-t border-white/10 backdrop-blur-md bg-white/5">
        <div className="flex items-end space-x-2">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <label 
            htmlFor="file-upload" 
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
          >
            {isUploading ? (
              <Upload size={20} className="animate-pulse" />
            ) : (
              <Image size={20} />
            )}
          </label>
          
          <button 
            onClick={() => setIsSelfDestruct(!isSelfDestruct)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isSelfDestruct ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}
          >
            <Clock size={20} />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full p-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          
          <button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full ${newMessage.trim() ? 'bg-brand hover:bg-brand-light' : 'bg-white/10 text-white/30'} text-white transition-colors`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
