
import React, { useState } from 'react';
import SelfDestructControls from './SelfDestructControls';
import VoiceRecordingButton from './VoiceRecordingButton';
import FileUploadButton from './FileUploadButton';
import SelfDestructToggle from './SelfDestructToggle';
import SendButton from './SendButton';
import { useToast } from "@/components/ui/use-toast";
import { sendTextMessage } from './utils/messageUtils';
import type { Contact } from '@/types/messaging';
import { useMessageThreadContext } from '@/context/MessageThreadContext';

interface MessageComposerProps {
  user: any;
  contact: Contact;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ user, contact }) => {
  const { toast } = useToast();
  const { isSelfDestruct, setIsSelfDestruct, destructTime, setDestructTime } = useMessageThreadContext();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !contact || isSending) return;
    
    setIsSending(true);
    try {
      await sendTextMessage(user, contact, newMessage, isSelfDestruct, destructTime);
      
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
    } finally {
      setIsSending(false);
    }
  };
  
  const toggleSelfDestruct = () => {
    setIsSelfDestruct(!isSelfDestruct);
  };
  
  return (
    <div className="mt-auto">
      {/* Self-destruct message controls */}
      {isSelfDestruct && (
        <SelfDestructControls 
          destructTime={destructTime} 
          setDestructTime={setDestructTime} 
          setIsSelfDestruct={setIsSelfDestruct} 
        />
      )}
      
      {/* Input area */}
      <div className="p-4 border-t border-white/10 backdrop-blur-md bg-white/5">
        <div className="flex items-end space-x-2">
          <FileUploadButton 
            user={user} 
            contact={contact} 
            isSelfDestruct={isSelfDestruct} 
            destructTime={destructTime}
            setIsSelfDestruct={setIsSelfDestruct}
          />
          
          <VoiceRecordingButton
            user={user}
            contact={contact}
            isSelfDestruct={isSelfDestruct}
            destructTime={destructTime}
            setIsSelfDestruct={setIsSelfDestruct}
          />
          
          <SelfDestructToggle 
            isSelfDestruct={isSelfDestruct}
            toggleSelfDestruct={toggleSelfDestruct}
          />
          
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
          
          <SendButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            isLoading={isSending}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
