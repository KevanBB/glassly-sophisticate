
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Clock, Image, Send, Upload, X } from 'lucide-react';
import type { Contact, MessageType } from '@/types/messaging';

interface MessageInputProps {
  user: any;
  contact: Contact;
  isSelfDestruct: boolean;
  setIsSelfDestruct: React.Dispatch<React.SetStateAction<boolean>>;
  destructTime: number;
  setDestructTime: React.Dispatch<React.SetStateAction<number>>;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  user, 
  contact, 
  isSelfDestruct, 
  setIsSelfDestruct, 
  destructTime, 
  setDestructTime 
}) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
  );
};

export default MessageInput;
