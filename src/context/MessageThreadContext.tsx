
import React, { createContext, useContext, useState } from 'react';
import type { Contact } from '@/types/messaging';

interface MessageThreadContextType {
  isSelfDestruct: boolean;
  setIsSelfDestruct: React.Dispatch<React.SetStateAction<boolean>>;
  destructTime: number;
  setDestructTime: React.Dispatch<React.SetStateAction<number>>;
  user: any;
  contact: Contact;
}

const MessageThreadContext = createContext<MessageThreadContextType | undefined>(undefined);

export const MessageThreadProvider: React.FC<{
  children: React.ReactNode;
  user: any;
  contact: Contact;
}> = ({ children, user, contact }) => {
  const [isSelfDestruct, setIsSelfDestruct] = useState(false);
  const [destructTime, setDestructTime] = useState(5); // Default 5 minutes
  
  return (
    <MessageThreadContext.Provider value={{
      isSelfDestruct,
      setIsSelfDestruct,
      destructTime,
      setDestructTime,
      user,
      contact
    }}>
      {children}
    </MessageThreadContext.Provider>
  );
};

export const useMessageThreadContext = () => {
  const context = useContext(MessageThreadContext);
  if (context === undefined) {
    throw new Error('useMessageThreadContext must be used within a MessageThreadProvider');
  }
  return context;
};
