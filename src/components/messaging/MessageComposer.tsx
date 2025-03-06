
import React, { useState } from 'react';
import MessageInput from './MessageInput';
import SelfDestructControls from './SelfDestructControls';
import type { Contact } from '@/types/messaging';

interface MessageComposerProps {
  user: any;
  contact: Contact;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ user, contact }) => {
  const [isSelfDestruct, setIsSelfDestruct] = useState(false);
  const [destructTime, setDestructTime] = useState(5); // minutes
  
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
      <MessageInput 
        user={user}
        contact={contact}
        isSelfDestruct={isSelfDestruct}
        setIsSelfDestruct={setIsSelfDestruct}
        destructTime={destructTime}
        setDestructTime={setDestructTime}
      />
    </div>
  );
};

export default MessageComposer;
