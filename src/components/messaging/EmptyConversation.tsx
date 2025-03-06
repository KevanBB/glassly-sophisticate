
import React from 'react';
import { Lock, Plus } from 'lucide-react';

interface EmptyConversationProps {
  onStartNewConversation: () => void;
}

const EmptyConversation: React.FC<EmptyConversationProps> = ({ onStartNewConversation }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <Lock className="text-brand-light" size={24} />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">Secure Messaging</h3>
      <p className="text-white/60 max-w-md">
        Select a conversation to start messaging. All messages are end-to-end encrypted for your privacy.
      </p>
      <button
        onClick={onStartNewConversation}
        className="mt-6 flex items-center space-x-2 bg-brand text-white rounded-full py-2 px-4 hover:bg-brand-light transition-colors"
      >
        <Plus size={18} />
        <span>Start a new conversation</span>
      </button>
    </div>
  );
};

export default EmptyConversation;
